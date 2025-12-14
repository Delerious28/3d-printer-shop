import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/providers";
import { CookieBanner } from "@/components/cookie-banner";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Remoof 3D Printing Shop",
  description: "Upload, configure, and order custom 3D prints in the Netherlands."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="gradient-bg">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-400">
              © {new Date().getFullYear()} Remoof. Crafted in the Netherlands.
            </footer>
          </div>
        </Providers>
        <CookieBanner />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
