"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import React from "react";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-slate-200 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-800"
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  const { data: session, status } = useSession();
  const userLabel = session?.user?.name || session?.user?.email || "Account";
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-slate-950/80 border-b border-slate-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white">
            Remoof
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/materials">Materials</NavLink>
            <NavLink href="/upload">Upload</NavLink>
            <NavLink href="/file-requirements">File requirements</NavLink>
            <NavLink href="/faq">FAQ</NavLink>
            {isAdmin && <NavLink href="/admin">Admin</NavLink>}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <span className="text-sm text-slate-300">Loading...</span>
          ) : session ? (
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className="text-sm font-medium text-white bg-purple-700 hover:bg-purple-600 px-3 py-1.5 rounded shadow"
              >
                {userLabel}
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-slate-200 hover:text-white px-3 py-1.5 rounded border border-slate-700 hover:border-slate-500"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-sm text-white border border-purple-600 px-3 py-1.5 rounded hover:bg-purple-600/10"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="text-sm font-medium text-white bg-purple-700 hover:bg-purple-600 px-3 py-1.5 rounded shadow"
              >
                Create account
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
