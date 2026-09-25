import { describe, expect, it } from "vitest";
import { availableDeliveryMethods, deliveryFee, type ZoneMatch } from "@/lib/delivery";

describe("availableDeliveryMethods (RG-18)", () => {
  it("propose retrait et point relais à Yaoundé", () => {
    expect(availableDeliveryMethods("Yaoundé")).toEqual(["PICKUP", "RELAY"]);
  });

  it("ignore les accents et la casse pour reconnaître Yaoundé", () => {
    expect(availableDeliveryMethods("yaounde")).toEqual(["PICKUP", "RELAY"]);
    expect(availableDeliveryMethods("  YAOUNDÉ  ")).toEqual(["PICKUP", "RELAY"]);
  });

  it("propose retrait et expédition pour les autres villes", () => {
    expect(availableDeliveryMethods("Douala")).toEqual(["PICKUP", "SHIPPING"]);
    expect(availableDeliveryMethods("Bafoussam")).toEqual(["PICKUP", "SHIPPING"]);
  });
});

describe("deliveryFee (RG-18, RG-19)", () => {
  const zone: ZoneMatch = { id: "zone-1", feeRetail: 1500, feeWholesale: 2500 };

  it("le retrait est toujours gratuit, quels que soient la zone et le palier", () => {
    expect(deliveryFee("PICKUP", zone, "RETAIL")).toBe(0);
    expect(deliveryFee("PICKUP", zone, "WHOLESALE")).toBe(0);
    expect(deliveryFee("PICKUP", null, "RETAIL")).toBe(0);
  });

  it("sans zone trouvée, les frais sont nuls", () => {
    expect(deliveryFee("SHIPPING", null, "RETAIL")).toBe(0);
  });

  it("applique le frais détail au palier RETAIL", () => {
    expect(deliveryFee("RELAY", zone, "RETAIL")).toBe(1500);
    expect(deliveryFee("SHIPPING", zone, "RETAIL")).toBe(1500);
  });

  it("applique le frais gros aux paliers semi-gros et gros", () => {
    expect(deliveryFee("SHIPPING", zone, "SEMI_WHOLESALE")).toBe(2500);
    expect(deliveryFee("SHIPPING", zone, "WHOLESALE")).toBe(2500);
  });
});
