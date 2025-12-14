import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { orderId } = await req.json();
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true, user: true } });
  if (!order || (order.userId !== session.user.id && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (order.status === "PAID") {
    return NextResponse.json({ error: "Order already paid" }, { status: 400 });
  }
  const sessionCheckout = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["ideal", "card"],
    success_url: `${process.env.APP_URL}/success?order=${order.id}`,
    cancel_url: `${process.env.APP_URL}/checkout?order=${order.id}`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          product_data: { name: "3D print order" },
          unit_amount: order.totalCents
        }
      }
    ],
    metadata: { orderId: order.id }
  });
  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentId: sessionCheckout.id,
      statusHistory: { create: { fromStatus: order.status, toStatus: order.status, note: "Payment initiated" } }
    }
  });
  return NextResponse.json({ url: sessionCheckout.url });
}
