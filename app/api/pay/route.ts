import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { orderId } = await req.json();
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId }, include: { items: true, user: true } });
  const session = await stripe.checkout.sessions.create({
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
  await prisma.order.update({ where: { id: order.id }, data: { paymentId: session.id, status: "PAID" } });
  return NextResponse.json({ url: session.url });
}
