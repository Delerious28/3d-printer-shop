"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", { redirect: false, email, password });
    if (res?.ok) {
      toast.success("Welcome back");
      router.push("/account");
    } else toast.error("Invalid login");
  };
  return (
    <div className="mx-auto max-w-md px-6 py-16 space-y-6">
      <h1 className="text-3xl font-bold">Login</h1>
      <form onSubmit={handle} className="card p-6 space-y-4">
        <input className="w-full bg-slate-900 border border-slate-800 p-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input className="w-full bg-slate-900 border border-slate-800 p-2 rounded" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        <button className="btn-primary w-full">Login</button>
      </form>
    </div>
  );
}
