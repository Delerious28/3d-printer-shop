"use client";
import { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { CookieBanner } from "@/components/cookie-banner";
import { Toaster } from "react-hot-toast";

export default function AppClientProviders({ children }: { children: ReactNode }) {
  return (
    <Providers>
      {children}
      <CookieBanner />
      <Toaster position="bottom-right" />
    </Providers>
  );
}
