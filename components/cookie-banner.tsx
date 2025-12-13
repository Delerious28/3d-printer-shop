"use client";
import { useEffect, useState } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) setVisible(true);
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed bottom-4 inset-x-0 flex justify-center px-4">
      <div className="card p-4 max-w-2xl w-full flex items-center justify-between gap-4 text-sm">
        <p>We use cookies for authentication and analytics. By continuing you accept our privacy policy.</p>
        <button className="btn-primary" onClick={() => { localStorage.setItem("cookie-consent", "1"); setVisible(false); }}>Accept</button>
      </div>
    </div>
  );
}
