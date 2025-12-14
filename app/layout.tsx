import "./globals.css";
import { ReactNode } from "react";
import AppClientProviders from "@/components/AppClientProviders";

export const metadata = {
  title: "Remoof 3D Printing Shop",
  description: "Upload, configure, and order custom 3D prints in the Netherlands."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="gradient-bg">
        <AppClientProviders>
          <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-40 backdrop-blur bg-slate-950/70 border-b border-slate-800">
              <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
                <a className="text-2xl font-bold tracking-tight" href="/">
                  Remoof
                </a>
                <nav className="flex gap-4 text-sm">
                  <a href="/materials">Materials</a>
                  <a href="/upload">Upload</a>
                  <a href="/account">Account</a>
                  <a href="/admin">Admin</a>
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-400">
              © {new Date().getFullYear()} Remoof. Crafted in the Netherlands.
            </footer>
          </div>
        </AppClientProviders>
      </body>
    </html>
  );
}
