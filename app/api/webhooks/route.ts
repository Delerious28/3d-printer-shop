import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();
  if (!process.env.STRIPE_WEBHOOK_SECRET || !signature) return NextResponse.json({ error: "Missing" }, { status: 400 });
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const orderId = session.metadata?.orderId as string;
    if (orderId) {
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          statusHistory: {
            create: {
              fromStatus: order?.status,
              toStatus: "PAID",
              note: "Stripe checkout completed"
            }
          }
        }
      });
    }
  }
  return NextResponse.json({ received: true });
}
