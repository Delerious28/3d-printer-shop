import { authOptions } from "@/lib/auth";
import { uploadSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import path from "path";

const allowed = ["model/stl", "model/obj", "application/octet-stream", "application/vnd.ms-pki.stl", "application/3mf" as const];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });
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
      userId: session.user.id,
      originalName: file.name,
      storageKey,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size
    }
  });
  return NextResponse.json({ id: record.id, storageKey: record.storageKey });
}
