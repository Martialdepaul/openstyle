"use server";

import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { parseCsv } from "@/lib/csv-import";
import { parseXlsxBase64 } from "@/lib/xlsx-import";
import { generateUniqueSlug } from "@/lib/slug";
import { getShopSettings } from "@/lib/shop-settings";
import { computeProductInStock } from "@/lib/stock";
import { maybeSendLowStockAlert } from "@/lib/low-stock-alert";
import type { Prisma, ProductStatus } from "@/generated/prisma/client";

/**
 * F15 : import de produits en lot (CSV ou XLSX). Une ligne par variante ;
 * les lignes partageant la même référence forment un seul produit. Les
 * photos en lot (REFERENCE-1.jpg) ne sont pas construites : F14 (stockage
 * d'images) n'est pas encore branché.
 */

export type ImportFileInput = { kind: "csv"; text: string } | { kind: "xlsx"; base64: string };

const REQUIRED_HEADERS = [
  "reference",
  "categorie",
  "nom_fr",
  "nom_en",
  "description_fr",
  "description_en",
  "marque",
  "prix_detail",
  "prix_promo",
  "prix_semi_gros",
  "prix_gros",
  "taille",
  "couleur",
  "parfum",
  "stock",
  "nouveau",
  "populaire",
  "statut",
] as const;

const MAX_ROWS = 2000;
const BATCH_SIZE = 200;

type RawRow = Record<(typeof REQUIRED_HEADERS)[number], string>;

type VariantInput = { size: string | null; color: string | null; scent: string | null; stockRaw: string };

export type ImportProductGroup = {
  reference: string;
  categoryId: string;
  categoryLabel: string;
  nameFr: string;
  nameEnRaw: string;
  descriptionFrRaw: string;
  descriptionEnRaw: string;
  brandRaw: string;
  priceRetail: number;
  pricePromoRaw: string;
  priceSemiRaw: string;
  priceWholesaleRaw: string;
  isNewRaw: string;
  isPopularRaw: string;
  statutRaw: string;
  variants: VariantInput[];
  isUpdate: boolean;
  existingProductId: string | null;
};

export type ImportRowError = { row: number; reference: string; reason: string };

export type ImportPreview = {
  error?: string;
  totalRows: number;
  toCreate: number;
  toUpdate: number;
  errors: ImportRowError[];
  groups: ImportProductGroup[];
};

function toRawRows(input: ImportFileInput): { rows: RawRow[]; error?: string } {
  let table: string[][];
  try {
    table = input.kind === "csv" ? parseCsv(input.text) : parseXlsxBase64(input.base64);
  } catch {
    return { rows: [], error: "Fichier illisible. Vérifiez qu'il s'agit bien d'un fichier CSV ou XLSX valide." };
  }
  if (table.length === 0) return { rows: [], error: "Fichier vide." };

  const headerRow = table[0].map((h) => h.trim().toLowerCase());
  const missing = REQUIRED_HEADERS.filter((h) => !headerRow.includes(h));
  if (missing.length > 0) {
    return { rows: [], error: `Colonnes manquantes : ${missing.join(", ")}.` };
  }

  const dataRows = table.slice(1);
  if (dataRows.length > MAX_ROWS) {
    return { rows: [], error: `Le fichier contient ${dataRows.length} lignes, la limite est de ${MAX_ROWS}.` };
  }

  const indexOf = (header: string) => headerRow.indexOf(header);
  const rows = dataRows.map((cells) => {
    const row = {} as RawRow;
    for (const header of REQUIRED_HEADERS) {
      row[header] = (cells[indexOf(header)] ?? "").trim();
    }
    return row;
  });

  return { rows };
}

function parseBoolean(raw: string): boolean {
  return /^(oui|true|1|yes)$/i.test(raw.trim());
}

function parseStatus(raw: string): ProductStatus | null {
  const normalized = raw.trim().toLowerCase();
  if (normalized === "") return null;
  if (["draft", "brouillon"].includes(normalized)) return "DRAFT";
  if (["published", "publie", "publié"].includes(normalized)) return "PUBLISHED";
  if (["archived", "archive", "archivé"].includes(normalized)) return "ARCHIVED";
  return null;
}

/** F15 : prévisualisation — rien n'est écrit en base ici. */
export async function previewImport(input: ImportFileInput): Promise<ImportPreview> {
  await requireRole("OWNER", "MANAGER");

  const { rows, error } = toRawRows(input);
  if (error) return { error, totalRows: 0, toCreate: 0, toUpdate: 0, errors: [], groups: [] };

  const errors: ImportRowError[] = [];
  const byReference = new Map<string, { rowNumbers: number[]; rows: RawRow[] }>();

  rows.forEach((row, index) => {
    const rowNumber = index + 2; // +1 en-tête, +1 index 1-based
    if (!row.reference) {
      errors.push({ row: rowNumber, reference: "", reason: "Référence manquante." });
      return;
    }
    const bucket = byReference.get(row.reference) ?? { rowNumbers: [], rows: [] };
    bucket.rowNumbers.push(rowNumber);
    bucket.rows.push(row);
    byReference.set(row.reference, bucket);
  });

  const categories = await prisma.category.findMany();
  const categoryByName = new Map(categories.map((c) => [c.nameFr.trim().toLowerCase(), c]));

  const existingProducts = await prisma.product.findMany({
    where: { reference: { in: Array.from(byReference.keys()) } },
    select: { id: true, reference: true },
  });
  const existingByReference = new Map(existingProducts.map((p) => [p.reference, p.id]));

  const groups: ImportProductGroup[] = [];

  for (const [reference, bucket] of byReference) {
    const firstRowNumber = bucket.rowNumbers[0];
    const firstNonEmpty = (field: keyof RawRow) => bucket.rows.map((r) => r[field]).find((v) => v !== "") ?? "";

    const categoryLabel = firstNonEmpty("categorie");
    const nameFr = firstNonEmpty("nom_fr");
    const priceRetailRaw = firstNonEmpty("prix_detail");

    if (!categoryLabel) {
      errors.push({ row: firstRowNumber, reference, reason: "Catégorie manquante." });
      continue;
    }
    const category = categoryByName.get(categoryLabel.trim().toLowerCase());
    if (!category) {
      errors.push({ row: firstRowNumber, reference, reason: `Catégorie inconnue : « ${categoryLabel} ».` });
      continue;
    }
    if (!nameFr) {
      errors.push({ row: firstRowNumber, reference, reason: "Nom (FR) manquant." });
      continue;
    }
    const priceRetail = Number(priceRetailRaw);
    if (!priceRetailRaw || !Number.isFinite(priceRetail) || priceRetail <= 0) {
      errors.push({ row: firstRowNumber, reference, reason: "Prix de détail manquant ou invalide." });
      continue;
    }

    const variants: VariantInput[] = bucket.rows.map((r) => ({
      size: r.taille || null,
      color: r.couleur || null,
      scent: r.parfum || null,
      stockRaw: r.stock,
    }));

    groups.push({
      reference,
      categoryId: category.id,
      categoryLabel: category.nameFr,
      nameFr,
      nameEnRaw: firstNonEmpty("nom_en"),
      descriptionFrRaw: firstNonEmpty("description_fr"),
      descriptionEnRaw: firstNonEmpty("description_en"),
      brandRaw: firstNonEmpty("marque"),
      priceRetail,
      pricePromoRaw: firstNonEmpty("prix_promo"),
      priceSemiRaw: firstNonEmpty("prix_semi_gros"),
      priceWholesaleRaw: firstNonEmpty("prix_gros"),
      isNewRaw: firstNonEmpty("nouveau"),
      isPopularRaw: firstNonEmpty("populaire"),
      statutRaw: firstNonEmpty("statut"),
      variants,
      isUpdate: existingByReference.has(reference),
      existingProductId: existingByReference.get(reference) ?? null,
    });
  }

  return {
    totalRows: rows.length,
    toCreate: groups.filter((g) => !g.isUpdate).length,
    toUpdate: groups.filter((g) => g.isUpdate).length,
    errors,
    groups,
  };
}

export type ImportBatchResult = { processed: number; total: number; done: boolean; error?: string };

/** F15 : traite un lot d'au plus 200 produits, à partir de `offset` (appelé en boucle par le client — barre de progression). */
export async function processImportBatch(groups: ImportProductGroup[], offset: number): Promise<ImportBatchResult> {
  const session = await requireRole("OWNER", "MANAGER");
  const { defaultLowStockThreshold } = await getShopSettings();

  const batch = groups.slice(offset, offset + BATCH_SIZE);

  try {
    for (const group of batch) {
      const lowStockChecks =
        group.isUpdate && group.existingProductId
          ? await updateImportedProduct(group, group.existingProductId, session.user.id, defaultLowStockThreshold)
          : await createImportedProduct(group, session.user.id, defaultLowStockThreshold);

      // F24 (E8) : hors transaction (appel réseau), une variante mise à jour à la fois.
      for (const check of lowStockChecks) {
        await maybeSendLowStockAlert(check.variantId, check.previousStock, check.newStock, check.threshold);
      }
    }
  } catch (error) {
    return { processed: offset, total: groups.length, done: false, error: error instanceof Error ? error.message : "Erreur inconnue." };
  }

  const processed = Math.min(offset + BATCH_SIZE, groups.length);
  const done = processed >= groups.length;
  if (done) revalidatePath("/admin/produits");

  return { processed, total: groups.length, done };
}

// RG-24/F24 : pas d'alerte de stock bas à la création — il n'y a pas de "précédent" à faire chuter, seulement un choix initial de stock.
async function createImportedProduct(group: ImportProductGroup, userId: string, defaultLowStockThreshold: number): Promise<LowStockCheck[]> {
  const slug = await generateUniqueSlug(group.nameFr);

  await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        reference: group.reference,
        slug,
        nameFr: group.nameFr,
        nameEn: group.nameEnRaw || null,
        descriptionFr: group.descriptionFrRaw,
        descriptionEn: group.descriptionEnRaw || null,
        categoryId: group.categoryId,
        brand: group.brandRaw || null,
        priceRetail: group.priceRetail,
        pricePromo: group.pricePromoRaw ? Number(group.pricePromoRaw) : null,
        priceSemi: group.priceSemiRaw ? Number(group.priceSemiRaw) : null,
        priceWholesale: group.priceWholesaleRaw ? Number(group.priceWholesaleRaw) : null,
        isNew: parseBoolean(group.isNewRaw),
        isPopular: parseBoolean(group.isPopularRaw),
        status: parseStatus(group.statutRaw) ?? "DRAFT",
        inStock: computeProductInStock(group.variants.map((v) => (v.stockRaw ? Number(v.stockRaw) : 0))),
      },
    });

    for (const [index, variant] of group.variants.entries()) {
      const stock = variant.stockRaw ? Math.max(0, Math.trunc(Number(variant.stockRaw))) : 0;
      const created = await tx.variant.create({
        data: {
          productId: product.id,
          sku: `${group.reference}-${index + 1}`,
          size: variant.size,
          color: variant.color,
          scent: variant.scent,
          stock,
          lowStockThreshold: defaultLowStockThreshold,
        },
      });
      if (stock > 0) {
        await tx.stockMovement.create({ data: { variantId: created.id, delta: stock, reason: "IMPORT", userId } });
      }
    }
  });

  return [];
}

type LowStockCheck = { variantId: string; previousStock: number; newStock: number; threshold: number };

async function updateImportedProduct(
  group: ImportProductGroup,
  productId: string,
  userId: string,
  defaultLowStockThreshold: number,
): Promise<LowStockCheck[]> {
  const lowStockChecks: LowStockCheck[] = [];

  await prisma.$transaction(async (tx) => {
    // RG (F15) : une cellule vide ne doit jamais écraser un prix existant — omis du update plutôt que mis à null.
    const data: Prisma.ProductUncheckedUpdateInput = {
      nameFr: group.nameFr,
      categoryId: group.categoryId,
      priceRetail: group.priceRetail,
    };
    if (group.nameEnRaw) data.nameEn = group.nameEnRaw;
    if (group.descriptionFrRaw) data.descriptionFr = group.descriptionFrRaw;
    if (group.descriptionEnRaw) data.descriptionEn = group.descriptionEnRaw;
    if (group.brandRaw) data.brand = group.brandRaw;
    if (group.pricePromoRaw) data.pricePromo = Number(group.pricePromoRaw);
    if (group.priceSemiRaw) data.priceSemi = Number(group.priceSemiRaw);
    if (group.priceWholesaleRaw) data.priceWholesale = Number(group.priceWholesaleRaw);
    if (group.isNewRaw) data.isNew = parseBoolean(group.isNewRaw);
    if (group.isPopularRaw) data.isPopular = parseBoolean(group.isPopularRaw);
    const status = parseStatus(group.statutRaw);
    if (status) data.status = status;

    await tx.product.update({ where: { id: productId }, data });

    const existingVariants = await tx.variant.findMany({ where: { productId } });
    const normalize = (value: string | null) => (value?.trim() ? value.trim() : null);

    for (const [index, variant] of group.variants.entries()) {
      const match = existingVariants.find(
        (v) => normalize(v.size) === normalize(variant.size) && normalize(v.color) === normalize(variant.color) && normalize(v.scent) === normalize(variant.scent),
      );

      if (match) {
        if (variant.stockRaw) {
          const newStock = Math.max(0, Math.trunc(Number(variant.stockRaw)));
          const delta = newStock - match.stock;
          if (delta !== 0) {
            await tx.variant.update({ where: { id: match.id }, data: { stock: newStock } });
            await tx.stockMovement.create({ data: { variantId: match.id, delta, reason: "IMPORT", userId } });
            lowStockChecks.push({ variantId: match.id, previousStock: match.stock, newStock, threshold: match.lowStockThreshold });
          }
        }
        // Cellule stock vide : le stock existant reste inchangé, aucun mouvement créé.
      } else {
        const stock = variant.stockRaw ? Math.max(0, Math.trunc(Number(variant.stockRaw))) : 0;
        const created = await tx.variant.create({
          data: {
            productId,
            sku: `${group.reference}-${existingVariants.length + index + 1}`,
            size: variant.size,
            color: variant.color,
            scent: variant.scent,
            stock,
            lowStockThreshold: defaultLowStockThreshold,
          },
        });
        if (stock > 0) {
          await tx.stockMovement.create({ data: { variantId: created.id, delta: stock, reason: "IMPORT", userId } });
        }
      }
    }

    const refreshedVariants = await tx.variant.findMany({ where: { productId, isActive: true }, select: { stock: true } });
    await tx.product.update({ where: { id: productId }, data: { inStock: computeProductInStock(refreshedVariants.map((v) => v.stock)) } });
  });

  return lowStockChecks;
}
