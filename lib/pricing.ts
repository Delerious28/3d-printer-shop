import { Prisma } from "@prisma/client";

export type PricingInput = {
  volumeMm3?: number | null;
  material: { basePriceCents: number; machineHourRateCents: number; supportMultiplier: number };
  quality: { layerHeight: number; speedMultiplier: number };
  infillPercent: number;
  supportsMode: "OFF" | "ON" | "AUTO";
  quantity: number;
  shippingSpeed: "NORMAL" | "EXPRESS";
  pricingRule: { expressMultiplier: number; minOrderCents: number; shippingBaseCents: number; shippingExpressCents: number };
};

export function estimatePrintTimeHours(volumeMm3: number | null | undefined, layerHeight: number) {
  if (!volumeMm3) return 1;
  const baseSpeed = 120; // mm3 per minute baseline
  const minutes = volumeMm3 / (baseSpeed * (0.2 / layerHeight));
  return Math.max(minutes / 60, 0.2);
}

export function calculatePrice(input: PricingInput) {
  const printTimeHours = estimatePrintTimeHours(input.volumeMm3 || undefined, input.quality.layerHeight);
  const timeCost = printTimeHours * input.material.machineHourRateCents;
  const supportFactor = input.supportsMode === "OFF" ? 1 : input.material.supportMultiplier;
  const subtotal = (input.material.basePriceCents + timeCost) * supportFactor * input.quantity;
  const shipping = input.shippingSpeed === "EXPRESS" ? input.pricingRule.shippingExpressCents : input.pricingRule.shippingBaseCents;
  const expressMultiplier = input.shippingSpeed === "EXPRESS" ? input.pricingRule.expressMultiplier : 1;
  const total = Math.max(subtotal * expressMultiplier + shipping, input.pricingRule.minOrderCents);
  return {
    printTimeHours,
    subtotalCents: Math.round(subtotal),
    shippingCents: shipping,
    totalCents: Math.round(total),
    supportFactor,
    expressMultiplier
  };
}
