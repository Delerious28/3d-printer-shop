import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const materials = await prisma.material.findMany();
  const colors = await prisma.color.findMany();
  const qualities = await prisma.qualityPreset.findMany();
  return NextResponse.json({ materials, colors, qualities });
}
