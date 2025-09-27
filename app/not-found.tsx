import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-24">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20">
          <Image src="/logo_nil.png" alt="Logo" width={40} height={40} className="object-contain" />
        </div>
        <div className="inline-flex items-center justify-center rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent ring-1 ring-accent/30">
          404
        </div>
        <h1 className="mt-4 inline-flex items-center justify-center gap-2 text-3xl font-extrabold text-foreground">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-accent"><path d="M12 2l3 7h7l-5.5 4.1L18 21l-6-4-6 4 1.5-7.9L2 9h7z"/></svg>
          Page introuvable
        </h1>
        <p className="mt-2 text-foreground/70">
          Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/fr"
            className="inline-flex items-center rounded-full bg-white/10 px-5 py-2 text-sm text-foreground ring-1 ring-white/20 hover:bg-white/15"
          >
            ← Retour à l&apos;accueil
          </Link>
          <Link
            href="/fr/backoffice/dashboard"
            className="inline-flex items-center rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Ouvrir le backoffice
          </Link>
        </div>
      </div>
    </main>
  );
}


