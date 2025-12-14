import Link from "next/link";
import { FaArrowRight, FaUpload, FaCreditCard, FaBoxOpen } from "react-icons/fa6";

const steps = [
  { title: "Upload", desc: "Drop your STL/OBJ/3MF and get instant insights.", icon: FaUpload },
  { title: "Configure", desc: "Pick material, color, quality, infill and supports.", icon: FaArrowRight },
  { title: "Pay", desc: "Securely pay with iDEAL via Stripe.", icon: FaCreditCard },
  { title: "Receive", desc: "We print, finish and ship with tracking.", icon: FaBoxOpen }
];

const materials = [
  { name: "PLA", detail: "Affordable and reliable for prototypes." },
  { name: "PETG", detail: "Tough and temperature resistant." },
  { name: "ABS", detail: "Engineering-grade with vapor smoothing." },
  { name: "Resin", detail: "Ultra-fine detail for miniatures." },
  { name: "TPU", detail: "Flexible and impact absorbing." }
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-16">
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full bg-slate-900/70 border border-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
            Dutch 3D printing service
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Remoof turns your 3D files into production-quality prints.
          </h1>
          <p className="text-lg text-slate-300">
            Upload, configure and pay online. Our Haarlem-based team prints, inspects and ships worldwide with clear communication every step of the way.
          </p>
          <div className="flex gap-4">
            <Link className="btn-primary" href="/upload">
              Start an order
            </Link>
            <Link className="inline-flex items-center gap-2 rounded-lg border border-slate-800 px-4 py-2" href="/materials">
              View materials <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="card p-8 space-y-4">
          <p className="text-slate-300 text-sm">How it works</p>
          <div className="grid grid-cols-2 gap-4">
            {steps.map((step) => (
              <div key={step.title} className="rounded-lg border border-slate-800 p-4 bg-slate-900/50">
                <step.icon className="h-6 w-6 text-brand" />
                <div className="mt-3 font-semibold">{step.title}</div>
                <p className="text-sm text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Featured materials</h2>
          <Link href="/materials" className="text-brand">All materials</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {materials.map((mat) => (
            <div key={mat.name} className="rounded-lg border border-slate-800 p-4 bg-slate-900/50">
              <div className="font-semibold text-lg">{mat.name}</div>
              <p className="text-slate-300 text-sm">{mat.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-xl font-semibold">Transparent pricing</h3>
          <p className="text-slate-300 text-sm mt-2">
            Pricing is based on material base cost, print time, supports and your chosen shipping speed. A full breakdown is shown before you pay.
          </p>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-semibold">Quality obsessed</h3>
          <p className="text-slate-300 text-sm mt-2">
            Each part is inspected, deburred and packaged securely. Need design feedback? We can request changes with annotated notes.
          </p>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-semibold">Fast Dutch shipping</h3>
          <p className="text-slate-300 text-sm mt-2">
            Standard and express options with PostNL and DHL. Track your package from print queue to doorstep.
          </p>
        </div>
      </section>
    </div>
  );
}
