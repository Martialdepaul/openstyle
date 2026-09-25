import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Client Prisma unique côté serveur. PostgreSQL (Neon) — voir
 * docs/decisions.md pour l'historique (SQLite en développement local avant
 * cette migration). Seul ce fichier connaît l'adaptateur ; le reste du code
 * interroge `prisma` sans savoir quel moteur est derrière.
 */
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
