"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isValidCameroonPhone } from "@/lib/orders";

export type ProfileFormState = { error: string | null; saved?: boolean };
export type ProRequestState = { error: string | null };

async function requireCustomer() {
  const session = await auth();
  if (!session?.user || session.user.role !== "CUSTOMER") {
    throw new Error("Non autorisé.");
  }
  return session;
}

export async function updateCustomerProfile(_prevState: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const session = await requireCustomer();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!firstName || !lastName) {
    return { error: "Le prénom et le nom sont obligatoires." };
  }
  if (phone && !isValidCameroonPhone(phone)) {
    return { error: "Le téléphone doit être un numéro camerounais valide (9 chiffres commençant par 6 ou 2)." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { firstName, lastName, phone: phone || null },
  });

  revalidatePath("/compte");
  return { error: null, saved: true };
}

/** F09 : demande de compte pro depuis l'espace client, seulement si le statut actuel le permet. */
export async function requestProUpgrade(_prevState: ProRequestState, formData: FormData): Promise<ProRequestState> {
  const session = await requireCustomer();

  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });
  if (user.proStatus === "PENDING" || user.proStatus === "APPROVED") {
    return { error: "Une demande est déjà en cours ou validée." };
  }

  const shopName = String(formData.get("shopName") ?? "").trim();
  const proCity = String(formData.get("proCity") ?? "").trim();
  const proPhone = String(formData.get("proPhone") ?? "").trim();

  if (!shopName || !proCity || !proPhone) {
    return { error: "Merci de renseigner le nom de la boutique, la ville et le téléphone." };
  }
  if (!isValidCameroonPhone(proPhone)) {
    return { error: "Le téléphone doit être un numéro camerounais valide (9 chiffres commençant par 6 ou 2)." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { proStatus: "PENDING", shopName, proCity, proPhone, proDecidedAt: null },
  });

  revalidatePath("/compte");
  return { error: null };
}
