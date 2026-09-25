"use server";

import { revalidatePath } from "next/cache";
import sanitizeHtml from "sanitize-html";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

/** F21 : contenu nettoyé avant affichage — aucun script accepté, balisage limité à du texte structuré simple. */
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["h2", "h3", "p", "ul", "ol", "li", "strong", "em", "a", "br"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
};

export async function updatePage(slug: string, formData: FormData): Promise<void> {
  await requireRole("OWNER", "MANAGER");

  const titleFr = String(formData.get("titleFr") ?? "").trim();
  const titleEn = String(formData.get("titleEn") ?? "").trim() || null;
  const bodyFrRaw = String(formData.get("bodyFr") ?? "");
  const bodyEnRaw = String(formData.get("bodyEn") ?? "");

  if (!titleFr || !bodyFrRaw.trim()) {
    throw new Error("Le titre et le contenu (FR) sont obligatoires.");
  }

  const bodyFr = sanitizeHtml(bodyFrRaw, SANITIZE_OPTIONS);
  const bodyEn = bodyEnRaw.trim() ? sanitizeHtml(bodyEnRaw, SANITIZE_OPTIONS) : null;

  await prisma.page.upsert({
    where: { slug },
    update: { titleFr, titleEn, bodyFr, bodyEn },
    create: { slug, titleFr, titleEn, bodyFr, bodyEn },
  });

  revalidatePath("/admin/contenus");
}
