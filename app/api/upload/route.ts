import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { uploadSchema } from "@/lib/validators";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const allowed = ["model/stl", "model/obj", "application/octet-stream", "application/vnd.ms-pki.stl", "application/3mf" as const];

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const userId = form.get("userId") as string | null;
  if (!file || !userId) return NextResponse.json({ error: "Missing" }, { status: 400 });
  if (!allowed.includes(file.type as any)) return NextResponse.json({ error: "Unsupported file" }, { status: 400 });
  const parsed = uploadSchema.safeParse({ name: file.name, size: file.size });
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const storageKey = `${randomUUID()}-${file.name}`;
  const uploadDir = process.env.STORAGE_PATH || path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, storageKey), buffer);
  const record = await prisma.modelFile.create({
    data: {
      userId,
      originalName: file.name,
      storageKey,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size
    }
  });
  return NextResponse.json({ id: record.id, storageKey });
}
