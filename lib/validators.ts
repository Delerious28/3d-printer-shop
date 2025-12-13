import { z } from "zod";

export const uploadSchema = z.object({
  name: z.string().min(1),
  size: z.number().max(200_000_000)
});

export const printConfigSchema = z.object({
  modelFileId: z.string().cuid(),
  materialId: z.string().cuid(),
  colorId: z.string().cuid(),
  qualityId: z.string().cuid(),
  infillPercent: z.number().min(0).max(100),
  supportsMode: z.enum(["OFF", "ON", "AUTO"]),
  quantity: z.number().min(1).max(10),
  shippingSpeed: z.enum(["NORMAL", "EXPRESS"])
});
