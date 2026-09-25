import { prisma } from "@/lib/db";

/** F10 : contenu des pages de contenu, éditable dans l'admin (F21). */
export async function getPageContent(slug: string) {
  return prisma.page.findUnique({ where: { slug } });
}
