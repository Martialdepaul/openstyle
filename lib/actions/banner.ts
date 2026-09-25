"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

function readFields(formData: FormData) {
  return {
    imageUrl: String(formData.get("imageUrl") ?? "").trim(),
    titleFr: String(formData.get("titleFr") ?? "").trim(),
    titleEn: String(formData.get("titleEn") ?? "").trim() || null,
    subtitleFr: String(formData.get("subtitleFr") ?? "").trim() || null,
    subtitleEn: String(formData.get("subtitleEn") ?? "").trim() || null,
    linkUrl: String(formData.get("linkUrl") ?? "").trim() || null,
  };
}

export async function createBanner(formData: FormData): Promise<void> {
  await requireRole("OWNER", "MANAGER");
  const fields = readFields(formData);
  if (!fields.imageUrl || !fields.titleFr) throw new Error("L'image et le titre (FR) sont obligatoires.");

  const max = await prisma.banner.aggregate({ _max: { position: true } });
  await prisma.banner.create({ data: { ...fields, position: (max._max.position ?? -1) + 1 } });

  revalidatePath("/admin/contenus");
  revalidatePath("/[locale]", "page");
}

export async function updateBanner(id: string, formData: FormData): Promise<void> {
  await requireRole("OWNER", "MANAGER");
  const fields = readFields(formData);
  if (!fields.imageUrl || !fields.titleFr) throw new Error("L'image et le titre (FR) sont obligatoires.");

  await prisma.banner.update({ where: { id }, data: fields });
  revalidatePath("/admin/contenus");
  revalidatePath("/[locale]", "page");
}

export async function deleteBanner(id: string): Promise<void> {
  await requireRole("OWNER", "MANAGER");
  await prisma.banner.delete({ where: { id } });
  revalidatePath("/admin/contenus");
  revalidatePath("/[locale]", "page");
}

export async function toggleBannerActive(id: string): Promise<void> {
  await requireRole("OWNER", "MANAGER");
  const banner = await prisma.banner.findUniqueOrThrow({ where: { id } });
  await prisma.banner.update({ where: { id }, data: { isActive: !banner.isActive } });
  revalidatePath("/admin/contenus");
  revalidatePath("/[locale]", "page");
}

export async function moveBanner(id: string, direction: "up" | "down"): Promise<void> {
  await requireRole("OWNER", "MANAGER");

  const items = await prisma.banner.findMany({ orderBy: { position: "asc" } });
  const index = items.findIndex((item) => item.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= items.length) return;

  const a = items[index];
  const b = items[swapIndex];
  await prisma.$transaction([
    prisma.banner.update({ where: { id: a.id }, data: { position: b.position } }),
    prisma.banner.update({ where: { id: b.id }, data: { position: a.position } }),
  ]);

  revalidatePath("/admin/contenus");
  revalidatePath("/[locale]", "page");
}
