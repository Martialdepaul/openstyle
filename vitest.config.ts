import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Section 0.6 : tests unitaires sur les quatre sujets obligatoires (prix par
 * palier, frais de livraison, décompte du stock, transitions de statut).
 * `design/figma-make/` est l'export Figma Make, exclu comme du build/lint.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/design/figma-make/**", "**/.next/**"],
  },
});
