"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
    if (res.ok) toast.success("Check your email to verify.");
    else toast.error("Unable to register");
  };
  return (
    <div className="mx-auto max-w-md px-6 py-16 space-y-6">
      <h1 className="text-3xl font-bold">Create account</h1>
      <form onSubmit={handle} className="card p-6 space-y-4">
        <input className="w-full bg-slate-900 border border-slate-800 p-2 rounded" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input className="w-full bg-slate-900 border border-slate-800 p-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input className="w-full bg-slate-900 border border-slate-800 p-2 rounded" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button className="btn-primary w-full">Register</button>
      </form>
    </div>
  );
}
