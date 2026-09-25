import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

/**
 * Client Prisma unique côté serveur. SQLite en développement local (voir
 * docs/decisions.md) ; à remplacer par l'adaptateur PostgreSQL (Neon) avant
 * la mise en ligne — seul ce fichier change, le reste du code interroge
 * `prisma` sans savoir quel moteur est derrière.
 */
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
