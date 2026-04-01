"use client";

import { useProfile } from "../hooks/useProfile";

export default function SocialDock() {
  const { profile, loading } = useProfile();

  // Créer la liste des liens sociaux dynamiquement
  const items = [];

  if (profile?.link_linkedin) {
    items.push({ href: profile.link_linkedin, label: "LinkedIn", icon: LinkedInIcon });
  }

  // if (profile?.link_github) {
  //   items.push({ href: profile.link_github, label: "GitHub", icon: GitHubIcon });
  // }

  if (profile?.link_facebook) {
    items.push({ href: profile.link_facebook, label: "Facebook", icon: FacebookIcon });
  }

  if (profile?.link_instagram) {
    items.push({ href: profile.link_instagram, label: "Instagram", icon: InstagramIcon });
  }

  if (profile?.link_whatsapp) {
    items.push({ href: `https://wa.me/${profile.link_whatsapp.replace(/\D/g, "")}`, label: "WhatsApp", icon: WhatsAppIcon });
  }

  // Afficher un skeleton pendant le chargement
  if (loading) {
    return (
      <div className="pointer-events-auto fixed bottom-6 left-6 z-50">
        <div className="flex items-center gap-4 rounded-full bg-white/10 px-4 py-2 ring-2 ring-accent backdrop-blur-sm border border-accent/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/50 animate-pulse" />
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/50 animate-pulse" />
        </div>
      </div>
    );
  }

  // Si aucun lien social n'est disponible, ne pas afficher le dock
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-auto fixed bottom-6 left-6 z-50">
      <div className="flex items-center gap-4 rounded-full bg-white/10 px-4 py-2 ring-2 ring-accent backdrop-blur-sm border border-accent/50">
        {items.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={label}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white hover:bg-navy/80 transition-colors"
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>
    </div>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.1c.5-1 1.8-2.2 3.7-2.2 4 0 4.7 2.6 4.7 6V24h-4v-7.5c0-1.8 0-4.1-2.5-4.1-2.5 0-2.9 2-2.9 4V24h-4V8z" />
    </svg>
  );
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.73.5.9 5.33.9 11.6c0 4.87 3.16 9 7.55 10.45.55.1.76-.24.76-.53 0-.26-.01-1.13-.02-2.05-3.07.67-3.72-1.3-3.72-1.3-.5-1.27-1.22-1.6-1.22-1.6-1-.69.08-.68.08-.68 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.56 1.19 3.18.9.1-.71.38-1.19.68-1.46-2.45-.28-5.02-1.23-5.02-5.47 0-1.21.43-2.21 1.13-2.99-.12-.28-.48-1.42.1-2.95 0 0 .93-.3 3.05 1.14.88-.25 1.82-.38 2.76-.38.94 0 1.88.13 2.76.38 2.12-1.44 3.05-1.14 3.05-1.14.58 1.53.22 2.67.1 2.95.7.78 1.13 1.78 1.13 2.99 0 4.25-2.58 5.18-5.04 5.46.39.33.73.98.73 1.98 0 1.43-.01 2.58-.01 2.93 0 .29.2.63.76.52A10.74 10.74 0 0 0 23.1 11.6C23.1 5.33 18.27.5 12 .5z" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}




function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  );
}
