import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") return <div className="p-8">Admins only.</div>;
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { user: true } });
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-6">
      <h1 className="text-3xl font-bold">Admin: Orders</h1>
      <div className="grid gap-3">
        {orders.map((o) => (
          <div key={o.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{o.user.name} · {o.status}</div>
              <div className="text-slate-400 text-sm">{new Date(o.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-brand font-semibold">€{(o.totalCents / 100).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
