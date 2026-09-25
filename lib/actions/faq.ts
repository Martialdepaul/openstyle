"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

function readFields(formData: FormData) {
  return {
    questionFr: String(formData.get("questionFr") ?? "").trim(),
    questionEn: String(formData.get("questionEn") ?? "").trim() || null,
    answerFr: String(formData.get("answerFr") ?? "").trim(),
    answerEn: String(formData.get("answerEn") ?? "").trim() || null,
  };
}

export async function createFaqItem(formData: FormData): Promise<void> {
  await requireRole("OWNER", "MANAGER");
  const fields = readFields(formData);
  if (!fields.questionFr || !fields.answerFr) throw new Error("La question et la réponse (FR) sont obligatoires.");

  const max = await prisma.faqItem.aggregate({ _max: { position: true } });
  await prisma.faqItem.create({ data: { ...fields, position: (max._max.position ?? -1) + 1 } });

  revalidatePath("/admin/contenus");
}

export async function updateFaqItem(id: string, formData: FormData): Promise<void> {
  await requireRole("OWNER", "MANAGER");
  const fields = readFields(formData);
  if (!fields.questionFr || !fields.answerFr) throw new Error("La question et la réponse (FR) sont obligatoires.");

  await prisma.faqItem.update({ where: { id }, data: fields });
  revalidatePath("/admin/contenus");
}

export async function deleteFaqItem(id: string): Promise<void> {
  await requireRole("OWNER", "MANAGER");
  await prisma.faqItem.delete({ where: { id } });
  revalidatePath("/admin/contenus");
}

export async function moveFaqItem(id: string, direction: "up" | "down"): Promise<void> {
  await requireRole("OWNER", "MANAGER");

  const items = await prisma.faqItem.findMany({ orderBy: { position: "asc" } });
  const index = items.findIndex((item) => item.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= items.length) return;

  const a = items[index];
  const b = items[swapIndex];
  await prisma.$transaction([
    prisma.faqItem.update({ where: { id: a.id }, data: { position: b.position } }),
    prisma.faqItem.update({ where: { id: b.id }, data: { position: a.position } }),
  ]);

  revalidatePath("/admin/contenus");
}
