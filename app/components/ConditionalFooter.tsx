"use client";

import { usePathname } from "next/navigation";
import Footer from "../ux/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isLogin = /^\/[a-zA-Z-]+\/login\/?$/.test(pathname || "");
  const isBackoffice = /^\/[a-zA-Z-]+\/backoffice(\/.*)?$/.test(pathname || "");
  if (isLogin || isBackoffice) return null;
  return <Footer />;
}


