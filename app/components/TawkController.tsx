"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Routes where Tawk must be hidden */
const HIDDEN_ROUTES = ["/login", "/backoffice"];

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget?: () => void;
      showWidget?: () => void;
      onLoad?: () => void;
    };
  }
}

export default function TawkController() {
  const pathname = usePathname();

  useEffect(() => {
    const shouldHide = HIDDEN_ROUTES.some((route) =>
      pathname.includes(route)
    );

    const apply = () => {
      if (shouldHide) {
        window.Tawk_API?.hideWidget?.();
      } else {
        window.Tawk_API?.showWidget?.();
      }
    };

    // If Tawk is already loaded, apply immediately
    if (window.Tawk_API?.hideWidget) {
      apply();
    } else {
      // Otherwise wait for Tawk to finish loading
      const prev = window.Tawk_API?.onLoad;
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.onLoad = () => {
        prev?.();
        apply();
      };
    }
  }, [pathname]);

  return null;
}
