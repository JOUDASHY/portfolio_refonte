"use client";

import { useEffect, useState } from "react";
import MaintenancePage from "../[lang]/maintenance/page";
import { apiNoAuth } from "../lib/axiosClient";
import Loading from "../ux/Loading";

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
    return <Loading />;
  }

  if (!alive) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
}
