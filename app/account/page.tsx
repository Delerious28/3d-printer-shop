import { getServerSessionSafe } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AccountPage() {
  const session = await getServerSessionSafe();
  if (!session?.user) return <div className="p-8">Please sign in.</div>;
  const orders = await prisma.order.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });
  const models = await prisma.modelFile.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-8">
      <div className="card p-6">
        <h1 className="text-3xl font-bold">Welcome, {session.user.name}</h1>
        <p className="text-slate-300">Manage addresses, models and orders.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Orders</h2>
            <Link href="/checkout" className="text-brand text-sm">Checkout</Link>
          </div>
          <div className="space-y-2 text-sm">
            {orders.map((o) => (
              <div key={o.id} className="border border-slate-800 rounded p-2 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{o.status}</div>
                  <div className="text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="text-brand font-semibold">€{(o.totalCents / 100).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-4">
          <h2 className="text-xl font-semibold mb-2">My Models</h2>
          <div className="space-y-2 text-sm">
            {models.map((m) => (
              <div key={m.id} className="border border-slate-800 rounded p-2">
                <div className="font-semibold">{m.originalName}</div>
                <div className="text-slate-400">{(m.sizeBytes / 1_000_000).toFixed(1)} MB · {m.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
