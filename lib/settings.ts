import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

/**
 * F20/F22 : réglages simples clé/valeur (`Setting`). F22 (paramètres de la
 * boutique) n'est pas encore construit dans son ensemble ; ce module ne sert
 * ici qu'au texte du délai de livraison (F20), sans écran de réglages général.
 */
export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row ? (row.value as T) : fallback;
}

export async function setSetting(key: string, value: Prisma.InputJsonValue): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
