import { prisma } from "@/lib/prisma";

export default async function MaterialsPage() {
  const materials = await prisma.material.findMany({ include: { colors: true } });
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-6">
      <h1 className="text-3xl font-bold">Materials & Pricing</h1>
      <p className="text-slate-300">Base prices are stored in the database and can be tuned per material. Shipping and express surcharges are applied during checkout.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {materials.map((m) => (
          <div key={m.id} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold">{m.name}</div>
                <p className="text-slate-400 text-sm">{m.description}</p>
              </div>
              <div className="text-brand font-semibold">€{(m.basePriceCents / 100).toFixed(2)} + time</div>
            </div>
            <div className="mt-3 text-sm text-slate-300">Colors: {m.colors.map((c) => c.name).join(", ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
