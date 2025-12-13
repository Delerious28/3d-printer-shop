"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const params = useSearchParams();
  const orderId = params.get("order") || "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    const res = await fetch("/api/pay", { method: "POST", body: JSON.stringify({ orderId }) });
    const json = await res.json();
    if (json.url) {
      window.location.href = json.url;
    } else {
      toast.error("Payment session failed");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 space-y-4">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <p className="text-slate-300">Confirm your address and pay securely with Stripe iDEAL.</p>
      <button onClick={handlePay} disabled={loading} className="btn-primary">{loading ? "Redirecting" : "Pay with Stripe"}</button>
    </div>
  );
}
