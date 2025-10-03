"use client";

import { useEffect, useState } from "react";
import MaintenancePage from "../[lang]/maintenance/page";
import { apiNoAuth } from "../lib/axiosClient";

export default function KeepAliveGate({ children }: { children: React.ReactNode }) {
  const [alive, setAlive] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const res = await apiNoAuth.get("keep-alive/");
        if (!cancelled) setAlive(res.status >= 200 && res.status < 300);
      } catch {
        if (!cancelled) setAlive(false);
      }
    };
    check();
    const id = setInterval(check, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (alive === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-2 w-56 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15">
          <div className="h-full w-1/3 animate-[shimmer_1.6s_ease-in-out_infinite] bg-accent/70" />
        </div>
      </div>
    );
  }

  if (!alive) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
}
