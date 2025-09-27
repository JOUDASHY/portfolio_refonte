"use client";

export default function SocialDock() {
  const items = [
    { href: "https://www.linkedin.com/", label: "LinkedIn", icon: LinkedInIcon },
    { href: "https://github.com/", label: "GitHub", icon: GitHubIcon },
    { href: "https://dribbble.com/", label: "Dribbble", icon: DribbbleIcon },
  ];

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

function DribbbleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.92 6.41a8.08 8.08 0 0 1 1.69 4.99c0 .25-.01.5-.04.74-2.43-.5-4.58-.42-6.36.26-.2-.5-.38-.93-.65-1.52 2.92-1.36 4.46-3.3 5.36-4.47zM12 4c1.9 0 3.65.63 5.06 1.69-.73 1.03-2.1 2.6-4.63 3.78A36.2 36.2 0 0 0 9.9 6.1C10.63 4.86 11.3 4 12 4zM8.54 6.67c.9.98 1.77 2.16 2.54 3.5-2.8.83-6.35 1.08-7.85 1.1A8.03 8.03 0 0 1 8.54 6.67zM4.1 12.69c1.76-.04 5.9-.23 9.13-1.37.28.6.52 1.15.73 1.69-3.08.94-5.37 2.74-6.8 4.24A7.95 7.95 0 0 1 4.1 12.7zm4.77 5.93c1.37-1.35 3.3-2.9 6.04-3.67.65 1.8 1.1 3.55 1.35 5.06A7.97 7.97 0 0 1 12 20a7.96 7.96 0 0 1-3.13-.38z" />
    </svg>
  );
}



