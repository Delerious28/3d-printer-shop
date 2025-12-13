const faqs = [
  { q: "Which files are supported?", a: "STL, OBJ and 3MF up to 200MB." },
  { q: "Do you ship internationally?", a: "Yes, we ship with tracking worldwide." },
  { q: "Can you check my model?", a: "We validate watertightness and basic thickness; if changes are required you will receive an email." }
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-6">
      <h1 className="text-3xl font-bold">FAQ</h1>
      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f.q} className="card p-4">
            <div className="font-semibold">{f.q}</div>
            <p className="text-slate-300 text-sm">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
