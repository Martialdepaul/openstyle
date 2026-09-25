"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function updateAdminAccount(formData: FormData) {
  const session = await requireAdminSession();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const newPassword = String(formData.get("newPassword") ?? "");

  const data: { firstName: string; lastName: string; passwordHash?: string } = { firstName, lastName };
  if (newPassword) {
    data.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  await prisma.user.update({ where: { id: session.user.id }, data });
  redirect("/admin/mon-compte?saved=1");
}
