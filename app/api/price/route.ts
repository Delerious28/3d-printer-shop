import { prisma } from "@/lib/prisma";
import { calculatePrice } from "@/lib/pricing";
import { printConfigSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = printConfigSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const model = await prisma.modelFile.findUnique({ where: { id: parsed.data.modelFileId } });
  const material = await prisma.material.findUniqueOrThrow({ where: { id: parsed.data.materialId } });
  const color = await prisma.color.findUniqueOrThrow({ where: { id: parsed.data.colorId } });
  const quality = await prisma.qualityPreset.findUniqueOrThrow({ where: { id: parsed.data.qualityId } });
  const pricingRule = await prisma.pricingRule.findFirstOrThrow();
  const pricing = calculatePrice({
    volumeMm3: model?.volumeMm3,
    material,
    quality,
    infillPercent: parsed.data.infillPercent,
    supportsMode: parsed.data.supportsMode,
    quantity: parsed.data.quantity,
    shippingSpeed: parsed.data.shippingSpeed,
    pricingRule
  });
  return NextResponse.json(pricing);
}
