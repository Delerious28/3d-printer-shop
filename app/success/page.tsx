import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16 text-center space-y-4">
      <h1 className="text-3xl font-bold">Payment received</h1>
      <p className="text-slate-300">We are preparing your print. You will receive email updates as the order progresses.</p>
      <Link href="/account" className="btn-primary">View my orders</Link>
    </div>
  );
}
