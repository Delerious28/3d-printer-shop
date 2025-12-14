"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const token = params.get("token");
    const email = params.get("email");
    if (!token || !email) return;
    fetch("/api/verify", { method: "POST", body: JSON.stringify({ token, email }) })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(() => {
        setStatus("Email verified! Redirecting to login...");
        setTimeout(() => router.push("/auth/login"), 1500);
      })
      .catch(() => setStatus("Verification failed"));
  }, [params, router]);

  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center space-y-4">
      <h1 className="text-3xl font-bold">Email verification</h1>
      <p className="text-slate-300">{status}</p>
    </div>
  );
}
