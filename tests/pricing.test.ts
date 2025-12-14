import { calculatePrice } from "../lib/pricing";
import { describe, expect, it } from "vitest";

describe("pricing", () => {
  it("applies express multiplier and shipping", () => {
    const result = calculatePrice({
      volumeMm3: 50000,
      material: { basePriceCents: 300, machineHourRateCents: 800, supportMultiplier: 1.2 },
      quality: { layerHeight: 0.2, speedMultiplier: 1 },
      infillPercent: 20,
      supportsMode: "ON",
      quantity: 2,
      shippingSpeed: "EXPRESS",
      pricingRule: { expressMultiplier: 1.25, minOrderCents: 1500, shippingBaseCents: 600, shippingExpressCents: 1200 }
    });
    expect(result.totalCents).toBeGreaterThan(result.subtotalCents);
    expect(result.shippingCents).toBe(1200);
  });
});
