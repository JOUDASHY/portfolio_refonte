"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const links = [
    { href: "dashboard", label: "Dashboard", icon: DashboardIcon, match: "/backoffice/dashboard" },
    { href: "projects", label: "Projects", icon: ProjectsIcon, match: "/backoffice/projects" },
  ];
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-transparent backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-5">
          <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/15 bg-white/10">
            <Image src="/logo_nil.png" alt="Logo" width={28} height={28} className="object-contain" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-foreground">Backoffice</div>
            <div className="text-xs text-foreground/60">Admin Panel</div>
          </div>
        </div>

        <div className="px-3">
          <div className="mb-2 text-xs uppercase tracking-wider text-foreground/50">Navigation</div>
          <nav className="space-y-1">
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

          <div className="mt-6 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
            <div className="text-sm font-medium text-foreground">Aide et support</div>
            <p className="mt-1 text-xs text-foreground/60">Besoin d'aide ? Consultez la documentation.</p>
            <Link href="../" className="mt-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs text-foreground ring-1 ring-white/20 hover:bg-white/15">
              Voir le site public
            </Link>
          </div>
        </div>
      </div>

      <div className="pl-64">
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-white/5 px-4 backdrop-blur">
          <div className="text-sm text-foreground/80">Backoffice</div>
          <div className="flex items-center gap-3">
            <Link href="../" className="text-sm text-accent hover:underline">Retour au site</Link>
          </div>
        </div>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

function SidebarLink({ href, label, icon: Icon, active }: { href: string; label: string; icon: (p: React.SVGProps<SVGSVGElement>) => JSX.Element; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm ring-1 ring-transparent ${
        active ? "bg-white/15 text-foreground ring-white/10" : "text-foreground/80 hover:bg-white/10 hover:text-foreground"
      }`}
    >
      <span className={`flex h-7 w-7 items-center justify-center rounded-md ${active ? "bg-white/10" : "bg-white/5 group-hover:bg-white/10"}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span>{label}</span>
    </Link>
  );
}

function DashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </svg>
  );
}

function ProjectsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3 7h18V5H3v2zm0 4h18V9H3v2zm0 8h18v-6H3v6z" />
    </svg>
  );
}


