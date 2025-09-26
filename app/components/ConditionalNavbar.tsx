"use client";

import { usePathname } from "next/navigation";
import Navbar from "../ux/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const isLogin = /^\/[a-zA-Z-]+\/login\/?$/.test(pathname || "");
  const isBackoffice = /^\/[a-zA-Z-]+\/backoffice(\/.*)?$/.test(pathname || "");
  if (isLogin || isBackoffice) return null;
  return <Navbar />;
}



