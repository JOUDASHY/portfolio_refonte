"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { SVGProps, ReactElement } from "react";

interface SidebarLink {
  href: string;
  label: string;
  icon: (p: SVGProps<SVGSVGElement>) => ReactElement;
  match: string;
}

interface BackofficeSidebarProps {
  links: SidebarLink[];
  isOpen: boolean;
  onClose: () => void;
}

function SidebarLink({ href, label, icon: Icon, active }: { 
  href: string; 
  label: string; 
  icon: (p: SVGProps<SVGSVGElement>) => ReactElement; 
  active?: boolean 
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-0.5 sm:gap-3 rounded-lg px-1 sm:px-4 py-1 sm:py-3 text-xs ${
        active ? "text-black shadow" : "text-white/80 hover:bg-white/10 hover:text-white"
      }`}
      style={active ? { backgroundColor: '#f68c09' } : {}}
    >
             <span className={`flex h-4 w-4 sm:h-10 sm:w-10 items-center justify-center rounded-lg ${active ? "bg-white/10" : "bg-white/5 group-hover:bg-white/10"}`}>
               <Icon className="icon-responsive" />
             </span>
      <span className="text-xs sm:text-xs font-normal leading-tight" style={{ fontSize: '0.625rem' }}>{label}</span>
    </Link>
  );
}

export default function BackofficeSidebar({ links, isOpen, onClose }: BackofficeSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 border-black/15 bg-navy transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      <div className="px-4 pt-6">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-accent">
          <Image src="/logo_nil.png" alt="Logo" width={84} height={84} className="object-contain" />
        </div>
        <div className="mt-4 rounded-xl bg-white shadow-sm">
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 border-2 border-gray-200">
              <svg viewBox="0 0 24 24" className="h-7 w-7 fill-gray-400">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-black text-lg">Nilsen</div>
              <div className="text-black/60 text-sm">Administrator</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3">
        <div className="mb-2 mt-4 uppercase tracking-wider text-white/70 text-var-caption">Navigation</div>
        <nav className="space-y-0.5">
          {links.map(({ href, label, icon: Icon, match }) => (
            <SidebarLink
              key={href}
              href={`./${href}`}
              label={label}
              icon={Icon}
              active={Boolean(pathname && pathname.includes(match))}
            />
          ))}
        </nav>

        <div className="mt-6 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-medium text-foreground">Aide et support</div>
          <p className="mt-1 text-xs text-foreground/60">Besoin d&apos;aide ? Consultez la documentation.</p>
          <Link href="../" className="mt-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-foreground ring-1 ring-white/20 hover:bg-white/15">
            Voir le site public
          </Link>
        </div>
      </div>
      </div>
    </>
  );
}
