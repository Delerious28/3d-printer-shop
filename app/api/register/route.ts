import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/email";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";

const schema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) });

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return NextResponse.json({ error: "User already exists" }, { status: 400 });
  const hash = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.user.create({
    data: { name: parsed.data.name, email: parsed.data.email, passwordHash: hash, role: "CUSTOMER" }
  });
  const token = randomUUID();
  await prisma.verificationToken.create({
    data: { identifier: user.email, token, expires: new Date(Date.now() + 1000 * 60 * 60 * 24) }
  });
  await sendMail(
    user.email,
    "Verify your Remoof account",
    `<p>Welcome to Remoof! Click <a href="${process.env.APP_URL}/verify?token=${token}&email=${user.email}">verify email</a> to activate your account.</p>`
  );
  return NextResponse.json({ ok: true });
}
