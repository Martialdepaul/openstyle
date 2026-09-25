"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

function readFields(formData: FormData) {
  return {
    author: String(formData.get("author") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim() || null,
    textFr: String(formData.get("textFr") ?? "").trim(),
    textEn: String(formData.get("textEn") ?? "").trim() || null,
    photoUrl: String(formData.get("photoUrl") ?? "").trim() || null,
  };
}

export async function createTestimonial(formData: FormData): Promise<void> {
  await requireRole("OWNER", "MANAGER");
  const fields = readFields(formData);
  if (!fields.author || !fields.textFr) throw new Error("L'auteur et le texte (FR) sont obligatoires.");

  const max = await prisma.testimonial.aggregate({ _max: { position: true } });
  await prisma.testimonial.create({ data: { ...fields, position: (max._max.position ?? -1) + 1 } });

  revalidatePath("/admin/contenus");
  revalidatePath("/[locale]", "page");
}

export async function updateTestimonial(id: string, formData: FormData): Promise<void> {
  await requireRole("OWNER", "MANAGER");
  const fields = readFields(formData);
  if (!fields.author || !fields.textFr) throw new Error("L'auteur et le texte (FR) sont obligatoires.");

  await prisma.testimonial.update({ where: { id }, data: fields });
  revalidatePath("/admin/contenus");
  revalidatePath("/[locale]", "page");
}

export async function deleteTestimonial(id: string): Promise<void> {
  await requireRole("OWNER", "MANAGER");
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/contenus");
  revalidatePath("/[locale]", "page");
}

export async function toggleTestimonialActive(id: string): Promise<void> {
  await requireRole("OWNER", "MANAGER");
  const testimonial = await prisma.testimonial.findUniqueOrThrow({ where: { id } });
  await prisma.testimonial.update({ where: { id }, data: { isActive: !testimonial.isActive } });
  revalidatePath("/admin/contenus");
  revalidatePath("/[locale]", "page");
}

export async function moveTestimonial(id: string, direction: "up" | "down"): Promise<void> {
  await requireRole("OWNER", "MANAGER");

  const items = await prisma.testimonial.findMany({ orderBy: { position: "asc" } });
  const index = items.findIndex((item) => item.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= items.length) return;

  const a = items[index];
  const b = items[swapIndex];
  await prisma.$transaction([
    prisma.testimonial.update({ where: { id: a.id }, data: { position: b.position } }),
    prisma.testimonial.update({ where: { id: b.id }, data: { position: a.position } }),
  ]);

  revalidatePath("/admin/contenus");
  revalidatePath("/[locale]", "page");
}
