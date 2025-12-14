import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const model = await prisma.modelFile.findUnique({ where: { id: params.id } });
  if (!model || (model.userId !== session.user.id && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    id: model.id,
    originalName: model.originalName,
    storageKey: model.storageKey,
    mimeType: model.mimeType,
    sizeBytes: model.sizeBytes,
    status: model.status,
    dimensions: { x: model.dimensionsX, y: model.dimensionsY, z: model.dimensionsZ },
    volumeMm3: model.volumeMm3,
    createdAt: model.createdAt
  });
}
