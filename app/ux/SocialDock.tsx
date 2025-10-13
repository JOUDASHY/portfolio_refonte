"use client";

import { useProfile } from "../hooks/useProfile";

export default function SocialDock() {
  const { profile, loading } = useProfile();
  
  // Créer la liste des liens sociaux dynamiquement
  const items = [];
  
  if (profile?.link_linkedin) {
    items.push({ href: profile.link_linkedin, label: "LinkedIn", icon: LinkedInIcon });
  }
  
  if (profile?.link_github) {
    items.push({ href: profile.link_github, label: "GitHub", icon: GitHubIcon });
  }
  
  if (profile?.link_facebook) {
    items.push({ href: profile.link_facebook, label: "Facebook", icon: FacebookIcon });
  }
  
  // Afficher un skeleton pendant le chargement
  if (loading) {
    return (
      <div className="pointer-events-auto fixed bottom-6 right-6 z-50">
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
    <div className="pointer-events-auto fixed bottom-6 right-6 z-50">
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



