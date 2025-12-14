"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ModelViewer } from "@/components/model-viewer";
import toast from "react-hot-toast";

interface Option { id: string; name: string; materialId?: string; layerHeight?: number }
interface ModelInfo { id: string; storageKey: string; originalName: string }

export default function ConfiguratorPage() {
  const params = useSearchParams();
  const router = useRouter();
  const modelId = params.get("model");
  const [options, setOptions] = useState<{ materials: Option[]; colors: Option[]; qualities: Option[] }>({ materials: [], colors: [], qualities: [] });
  const [selection, setSelection] = useState({ materialId: "", colorId: "", qualityId: "", infill: 20, supports: "AUTO", quantity: 1, shipping: "NORMAL" });
  const [price, setPrice] = useState<{ totalCents: number; breakdown?: any }>();
  const [model, setModel] = useState<ModelInfo | null>(null);

  useEffect(() => {
    fetch("/api/options").then((res) => res.json()).then(setOptions);
  }, []);

  useEffect(() => {
    if (!modelId) return;
    fetch(`/api/models/${modelId}`).then(async (res) => {
      if (!res.ok) {
        toast.error("Unable to load model");
        return;
      }
      const json = await res.json();
      setModel(json);
    });
  }, [modelId]);

  useEffect(() => {
    if (!modelId || !selection.materialId || !selection.colorId || !selection.qualityId) return;
    fetch("/api/price", { method: "POST", body: JSON.stringify({ modelFileId: modelId, ...selection, infillPercent: selection.infill, supportsMode: selection.supports, shippingSpeed: selection.shipping }) })
      .then((res) => res.json())
      .then((data) => setPrice(data));
  }, [modelId, selection]);

  const createCart = async () => {
    if (!modelId) return;
    const res = await fetch("/api/cart", { method: "POST", body: JSON.stringify({ modelFileId: modelId, materialId: selection.materialId, colorId: selection.colorId, qualityId: selection.qualityId, infillPercent: selection.infill, supportsMode: selection.supports, quantity: selection.quantity, shippingSpeed: selection.shipping }) });
    if (!res.ok) return toast.error("Unable to add to cart");
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Configure print</h1>
        {model ? <ModelViewer src={`/uploads/${model.storageKey}`} /> : <div className="text-slate-400">Select a model to view.</div>}
      </div>
      <div className="card p-6 space-y-4">
        <div>
          <label className="text-sm text-slate-300">Material</label>
          <select className="w-full bg-slate-900 border border-slate-800 p-2 rounded" value={selection.materialId} onChange={(e) => setSelection((s) => ({ ...s, materialId: e.target.value }))}>
            <option value="">Select material</option>
            {options.materials.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-300">Color</label>
          <select className="w-full bg-slate-900 border border-slate-800 p-2 rounded" value={selection.colorId} onChange={(e) => setSelection((s) => ({ ...s, colorId: e.target.value }))}>
            <option value="">Select color</option>
            {options.colors.filter((c) => !selection.materialId || c.materialId === selection.materialId).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-300">Quality</label>
          <select className="w-full bg-slate-900 border border-slate-800 p-2 rounded" value={selection.qualityId} onChange={(e) => setSelection((s) => ({ ...s, qualityId: e.target.value }))}>
            <option value="">Select quality</option>
            {options.qualities.filter((q) => !selection.materialId || q.materialId === selection.materialId).map((q) => (
              <option key={q.id} value={q.id}>{q.name} ({q.layerHeight}mm)</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-300">Infill %</label>
            <input type="number" value={selection.infill} min={0} max={100} onChange={(e) => setSelection((s) => ({ ...s, infill: Number(e.target.value) }))} className="w-full bg-slate-900 border border-slate-800 p-2 rounded" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Quantity</label>
            <input type="number" value={selection.quantity} min={1} max={10} onChange={(e) => setSelection((s) => ({ ...s, quantity: Number(e.target.value) }))} className="w-full bg-slate-900 border border-slate-800 p-2 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-300">Supports</label>
            <select value={selection.supports} onChange={(e) => setSelection((s) => ({ ...s, supports: e.target.value }))} className="w-full bg-slate-900 border border-slate-800 p-2 rounded">
              <option value="OFF">Off</option>
              <option value="ON">On</option>
              <option value="AUTO">Auto</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-300">Shipping speed</label>
            <select value={selection.shipping} onChange={(e) => setSelection((s) => ({ ...s, shipping: e.target.value }))} className="w-full bg-slate-900 border border-slate-800 p-2 rounded">
              <option value="NORMAL">Standard</option>
              <option value="EXPRESS">Express</option>
            </select>
          </div>
        </div>
        {price && (
          <div className="rounded border border-slate-800 p-3 bg-slate-900/70 text-sm text-slate-200">
            <div>Estimated total: <span className="text-brand font-semibold">€{(price.totalCents / 100).toFixed(2)}</span></div>
            <p className="text-slate-400">Includes shipping and minimum order rules.</p>
          </div>
        )}
        <button onClick={createCart} className="btn-primary w-full">Add to cart</button>
      </div>
    </div>
  );
}
