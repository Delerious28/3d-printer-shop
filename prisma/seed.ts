import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const pricing = await prisma.pricingRule.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      expressMultiplier: 1.25,
      minOrderCents: 1500,
      shippingBaseCents: 600,
      shippingExpressCents: 1200
    }
  });

  const materialsData = [
    {
      name: "PLA",
      description: "Great all-rounder for prototypes",
      basePriceCents: 350,
      machineHourRateCents: 800,
      supportMultiplier: 1.15,
      densityGcm3: 1.24,
      colors: [
        { name: "Black", hex: "#111111" },
        { name: "White", hex: "#f8f8f8" },
        { name: "Remoof Purple", hex: "#7B61FF" }
      ],
      qualities: [
        { name: "Draft", layerHeight: 0.28, speedMultiplier: 1.2 },
        { name: "Standard", layerHeight: 0.2, speedMultiplier: 1 },
        { name: "Fine", layerHeight: 0.12, speedMultiplier: 0.8 }
      ]
    },
    {
      name: "PETG",
      description: "Tough and temperature resistant",
      basePriceCents: 450,
      machineHourRateCents: 1000,
      supportMultiplier: 1.2,
      densityGcm3: 1.27,
      colors: [
        { name: "Black", hex: "#111111" },
        { name: "Orange", hex: "#f97316" }
      ],
      qualities: [
        { name: "Standard", layerHeight: 0.24, speedMultiplier: 1 },
        { name: "Fine", layerHeight: 0.16, speedMultiplier: 0.85 }
      ]
    }
  ];

  for (const mat of materialsData) {
    const material = await prisma.material.upsert({
      where: { name: mat.name },
      update: {},
      create: {
        name: mat.name,
        description: mat.description,
        basePriceCents: mat.basePriceCents,
        machineHourRateCents: mat.machineHourRateCents,
        supportMultiplier: mat.supportMultiplier,
        densityGcm3: mat.densityGcm3
      }
    });
    for (const color of mat.colors) {
      await prisma.color.upsert({
        where: { name_materialId: { name: color.name, materialId: material.id } },
        update: {},
        create: { name: color.name, hex: color.hex, materialId: material.id }
      });
    }
    for (const quality of mat.qualities) {
      await prisma.qualityPreset.upsert({
        where: { name_materialId: { name: quality.name, materialId: material.id } },
        update: {},
        create: { name: quality.name, layerHeight: quality.layerHeight, speedMultiplier: quality.speedMultiplier, materialId: material.id }
      });
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123!";
  const hash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Remoof Admin",
      email: adminEmail,
      passwordHash: hash,
      role: "ADMIN",
      emailVerifiedAt: new Date()
    }
  });

  console.log("Seed complete", { pricing });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
