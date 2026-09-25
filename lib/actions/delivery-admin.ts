"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { setSetting } from "@/lib/settings";

/** F20 : zones de livraison — nom FR/EN, villes incluses, frais détail et gros. */
export async function updateDeliveryZone(zoneId: string, formData: FormData): Promise<void> {
  await requireRole("OWNER");

  const nameFr = String(formData.get("nameFr") ?? "").trim();
  const nameEn = String(formData.get("nameEn") ?? "").trim() || null;
  const citiesRaw = String(formData.get("cities") ?? "").trim();
  const cities = citiesRaw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const feeRetail = Math.max(0, Math.trunc(Number(formData.get("feeRetail")) || 0));
  const feeWholesale = Math.max(0, Math.trunc(Number(formData.get("feeWholesale")) || 0));

  if (!nameFr || cities.length === 0) throw new Error("Le nom et les villes sont obligatoires.");

  await prisma.deliveryZone.update({
    where: { id: zoneId },
    data: { nameFr, nameEn, cities, feeRetail, feeWholesale },
  });

  revalidatePath("/admin/livraison");
}

/** F20 : le texte du délai (ex. "2 jours") est un réglage. */
export async function updateDeliveryDelayText(formData: FormData): Promise<void> {
  await requireRole("OWNER");

  const text = String(formData.get("deliveryDelayText") ?? "").trim();
  await setSetting("deliveryDelayText", text);

  revalidatePath("/admin/livraison");
}

export async function createRelayPoint(formData: FormData) {
  await requireRole("OWNER");

  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;

  if (!name || !city || !address) throw new Error("Le nom, la ville et l'adresse sont obligatoires.");

  await prisma.relayPoint.create({ data: { name, city, address, phone } });

  revalidatePath("/admin/livraison");
  redirect("/admin/livraison?onglet=relais");
}

export async function updateRelayPoint(relayPointId: string, formData: FormData): Promise<void> {
  await requireRole("OWNER");

  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;

  if (!name || !city || !address) throw new Error("Le nom, la ville et l'adresse sont obligatoires.");

  await prisma.relayPoint.update({ where: { id: relayPointId }, data: { name, city, address, phone } });

  revalidatePath("/admin/livraison");
}

export async function toggleRelayPointActive(relayPointId: string): Promise<void> {
  await requireRole("OWNER");

  const point = await prisma.relayPoint.findUniqueOrThrow({ where: { id: relayPointId } });
  await prisma.relayPoint.update({ where: { id: relayPointId }, data: { isActive: !point.isActive } });

  revalidatePath("/admin/livraison");
}
