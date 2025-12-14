export default function FileRequirements() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-4 text-slate-200">
      <h1 className="text-3xl font-bold">File Requirements</h1>
      <ul className="list-disc pl-6 space-y-2 text-slate-300 text-sm">
        <li>Models must be watertight/manifold with no self-intersections.</li>
        <li>Minimum wall thickness 1.2mm for FDM and 0.8mm for resin.</li>
        <li>Include orientation hints if critical; otherwise our technicians choose optimal orientation.</li>
        <li>Upload units in millimeters.</li>
        <li>Keep file size under 200MB per model.</li>
      </ul>
    </div>
  );
}
