import { describe, expect, it } from "vitest";
import { canTransition, isValidCameroonPhone, normalizeCameroonPhone, ORDER_STATUS_TRANSITIONS } from "@/lib/orders";
import type { OrderStatus } from "@/generated/prisma/client";

const ALL_STATUSES: OrderStatus[] = ["NEW", "CONFIRMED", "READY", "SHIPPED", "DELIVERED", "CANCELLED"];

describe("canTransition (RG-09)", () => {
  it("autorise exactement les transitions déclarées dans ORDER_STATUS_TRANSITIONS", () => {
    for (const from of ALL_STATUSES) {
      for (const to of ALL_STATUSES) {
        expect(canTransition(from, to)).toBe(ORDER_STATUS_TRANSITIONS[from].includes(to));
      }
    }
  });

  it("une commande NEW peut être confirmée ou annulée, jamais passer directement à prête/expédiée/livrée", () => {
    expect(canTransition("NEW", "CONFIRMED")).toBe(true);
    expect(canTransition("NEW", "CANCELLED")).toBe(true);
    expect(canTransition("NEW", "READY")).toBe(false);
    expect(canTransition("NEW", "SHIPPED")).toBe(false);
    expect(canTransition("NEW", "DELIVERED")).toBe(false);
  });

  it("les statuts terminaux (DELIVERED, CANCELLED) n'autorisent plus aucune transition", () => {
    for (const to of ALL_STATUSES) {
      expect(canTransition("DELIVERED", to)).toBe(false);
      expect(canTransition("CANCELLED", to)).toBe(false);
    }
  });

  it("aucun statut ne peut revenir en arrière vers NEW", () => {
    for (const from of ALL_STATUSES) {
      expect(canTransition(from, "NEW")).toBe(false);
    }
  });
});

describe("normalizeCameroonPhone / isValidCameroonPhone (F06)", () => {
  it("retire le préfixe +237 et les espaces/tirets/points", () => {
    expect(normalizeCameroonPhone("+237 656 356 687")).toBe("656356687");
    expect(normalizeCameroonPhone("237656356687")).toBe("656356687");
    expect(normalizeCameroonPhone("656-356-687")).toBe("656356687");
    expect(normalizeCameroonPhone("656.356.687")).toBe("656356687");
  });

  it("accepte un numéro valide de 9 chiffres commençant par 6", () => {
    expect(isValidCameroonPhone("656356687")).toBe(true);
    expect(isValidCameroonPhone("+237656356687")).toBe(true);
  });

  it("accepte un numéro valide commençant par 2", () => {
    expect(isValidCameroonPhone("222334455")).toBe(true);
  });

  it("refuse un numéro trop court, trop long ou avec un mauvais préfixe", () => {
    expect(isValidCameroonPhone("65635668")).toBe(false); // 8 chiffres
    expect(isValidCameroonPhone("6563566877")).toBe(false); // 10 chiffres
    expect(isValidCameroonPhone("956356687")).toBe(false); // ne commence pas par 6 ou 2
  });
});
