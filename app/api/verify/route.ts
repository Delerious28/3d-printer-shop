import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ token: z.string(), email: z.string().email() });

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: parsed.data.email, token: parsed.data.token } }
  });
  if (!record || record.expires < new Date()) return NextResponse.json({ error: "Token expired" }, { status: 400 });
  await prisma.user.update({ where: { email: parsed.data.email }, data: { emailVerifiedAt: new Date() } });
  await prisma.verificationToken.delete({ where: { identifier_token: { identifier: parsed.data.email, token: parsed.data.token } } });
  return NextResponse.json({ ok: true });
}
