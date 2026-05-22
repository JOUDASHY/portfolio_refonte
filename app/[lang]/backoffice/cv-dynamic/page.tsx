"use client";

import { useProfile } from "../../../hooks/useProfile";
import { useExperiences } from "../../../hooks/useExperiences";
import { useSkills } from "../../../hooks/useSkills";
import { useBackofficeFormations } from "../../../hooks/useBackofficeFormations";
import { useBackofficeLangues } from "../../../hooks/useBackofficeLangues";
import { useBackofficeAwards } from "../../../hooks/useBackofficeAwards";
import Button from "../../../ux/ui/Button";

export default function CVDynamicPage() {
  const { profile } = useProfile();
  const { items: experiences } = useExperiences();
  const { grouped: skillsGrouped } = useSkills();
  const { items: formations } = useBackofficeFormations();
  const { items: langues } = useBackofficeLangues();
  const { items: awards } = useBackofficeAwards();

  const allExp = [
    ...experiences.filter((e) => e.type === "professionnel"),
    ...experiences.filter((e) => e.type === "stage"),
  ];

  const expHTML = allExp.map((exp, i) => `
    <div class="entry">
      <div class="entry-icon-col">
        <div class="e-dot"></div>
        ${i < allExp.length - 1 ? '<div class="e-line"></div>' : ''}
      </div>
      <div class="entry-body">
        <div class="entry-head">
          <div class="entry-role">${exp.title}</div>
          <span class="entry-badge ${exp.type === 'professionnel' ? 'badge-pro' : 'badge-stage'}">${exp.type === 'professionnel' ? 'Professionnel' : 'Stage'}</span>
        </div>
        <div class="entry-meta">${exp.company}<span class="sep">|</span>${exp.period}</div>
        ${exp.summary ? `<div class="entry-desc"><ul>${exp.summary.split('\n').filter(Boolean).map(l => `<li>${l}</li>`).join('')}</ul></div>` : ''}
      </div>
    </div>
  `).join('');

  const formHTML = formations.map((f, i) => `
    <div class="edu-entry" ${i === formations.length - 1 ? 'style="border-bottom:none"' : ''}>
      <div>
        <div class="edu-degree">${f.title}</div>
        <div class="edu-org">${f.provider}</div>
      </div>
      <div class="edu-year">${f.debut} – ${f.fin}</div>
    </div>
  `).join('');

  const skillsHTML = Array.from(skillsGrouped.entries()).map(([cat, skills]) => `
    <div class="skills-row">
      <div class="skills-label">${cat}</div>
      <div class="pills">${skills.map(s => `<span class="pill">${s.name}</span>`).join('')}</div>
    </div>
  `).join('');

  const projHTML = awards.map(a => `<div class="proj-item">${a.title}</div>`).join('');

  const langHTML = langues.map(l => `<span>${l.titre} — ${l.niveau}</span>`).join('');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600&family=Source+Sans+3:wght@300;400;600&display=swap" rel="stylesheet"/>
<style>
:root{--blue:#000b31;--accent:#c8a96e;--text:#111111;--muted:#4a4a6a;--light:#f4f3ef;--rule:#d0ccc0;}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#cccac3;font-family:'Source Sans 3',sans-serif;font-size:10.5pt;color:var(--text);padding:36px 16px;}
.page{max-width:760px;margin:0 auto;background:#fff;box-shadow:0 4px 32px rgba(0,11,49,0.22);}
.top-bar{background:var(--blue);padding:34px 52px 28px;color:#fff;}
.top-bar h1{font-family:'EB Garamond',serif;font-size:23pt;font-weight:600;letter-spacing:1px;color:#fff;}
.top-bar .title-role{font-size:9.5pt;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-top:5px;font-weight:400;}
.top-bar .exp-badge{display:inline-block;margin-top:8px;font-size:8.5pt;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.25);border-radius:20px;padding:2px 12px;}
.contact-line{margin-top:14px;display:flex;flex-wrap:wrap;gap:6px 20px;font-size:9pt;color:rgba(255,255,255,0.78);}
.contact-line span{display:flex;align-items:center;gap:6px;}
.contact-line a{color:inherit;text-decoration:none;}
.c-ico{display:inline-block;width:13px;height:13px;background-size:contain;background-repeat:no-repeat;background-position:center;flex-shrink:0;opacity:0.85;}
.ico-loc{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E");}
.ico-tel{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.58c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/%3E%3C/svg%3E");}
.ico-mail{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' d='M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/%3E%3C/svg%3E");}
.ico-web{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z'/%3E%3C/svg%3E");}
.ico-gh{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' d='M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z'/%3E%3C/svg%3E");}
.body{padding:36px 52px 50px;}
.section{margin-bottom:24px;}
.section-title{display:flex;align-items:center;gap:8px;font-family:'EB Garamond',serif;font-size:12pt;font-weight:600;color:var(--blue);text-transform:uppercase;letter-spacing:2px;margin-bottom:14px;padding-bottom:5px;border-bottom:1.5px solid var(--blue);}
.section-title svg{flex-shrink:0;}
.about-text{font-size:9.5pt;color:var(--muted);line-height:1.8;border-left:3px solid var(--accent);padding-left:12px;}
.entry{display:flex;gap:14px;margin-bottom:14px;}
.entry-icon-col{display:flex;flex-direction:column;align-items:center;padding-top:4px;flex-shrink:0;}
.e-dot{width:8px;height:8px;border-radius:50%;background:var(--accent);flex-shrink:0;}
.e-line{width:1px;flex:1;background:var(--rule);margin-top:4px;min-height:10px;}
.entry-body{flex:1;}
.entry-head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;}
.entry-role{font-weight:600;font-size:10.5pt;color:var(--blue);line-height:1.2;}
.entry-badge{font-size:8pt;padding:2px 8px;border-radius:20px;font-weight:600;letter-spacing:0.5px;white-space:nowrap;flex-shrink:0;}
.badge-pro{background:rgba(0,11,49,0.09);color:var(--blue);}
.badge-stage{background:rgba(200,169,110,0.18);color:#7a5f20;}
.entry-meta{font-size:9pt;color:var(--muted);margin-top:3px;}
.entry-meta .sep{margin:0 5px;color:var(--rule);}
.entry-desc{margin-top:5px;font-size:9pt;color:var(--muted);line-height:1.7;}
.entry-desc ul{list-style:none;padding:0;}
.entry-desc ul li{padding-left:14px;position:relative;margin-bottom:2px;}
.entry-desc ul li::before{content:'▸';position:absolute;left:0;color:var(--accent);font-size:8pt;top:1px;}
.edu-entry{display:flex;justify-content:space-between;align-items:baseline;gap:10px;padding:7px 0;border-bottom:1px solid var(--rule);flex-wrap:wrap;}
.edu-entry:last-child{border-bottom:none;}
.edu-degree{font-weight:600;font-size:10pt;color:var(--text);}
.edu-org{font-size:9pt;color:var(--muted);margin-top:1px;}
.edu-year{font-size:9pt;color:var(--muted);white-space:nowrap;flex-shrink:0;}
.skills-row{display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;align-items:flex-start;}
.skills-label{font-weight:600;font-size:9.5pt;color:var(--blue);white-space:nowrap;padding-top:3px;min-width:120px;}
.pills{display:flex;flex-wrap:wrap;gap:5px;}
.pill{font-size:8.5pt;padding:3px 10px;border-radius:20px;border:1px solid #c8c4ba;color:var(--muted);background:var(--light);}
.proj-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 20px;}
.proj-item{font-size:9pt;color:var(--muted);display:flex;align-items:center;gap:7px;}
.proj-item::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--accent);flex-shrink:0;}
.inline-grid{display:flex;flex-wrap:wrap;gap:8px 28px;font-size:9.5pt;color:var(--muted);}
@media print{body{background:white;padding:0;}.page{box-shadow:none;}}
</style>
</head>
<body>
<div class="page">
<div class="top-bar">
  <h1>${profile?.username || 'ALITSIRY Eddy Nilsen Tovohery'}</h1>
  <div class="title-role">Administrateur Systèmes · Développeur Full Stack · DevOps</div>
  <div class="exp-badge">3 ans d'expérience professionnelle</div>
  <div class="contact-line">
    ${profile?.address ? `<span><span class="c-ico ico-loc"></span>${profile.address}</span>` : ''}
    ${profile?.phone_number ? `<span><span class="c-ico ico-tel"></span>+261 ${profile.phone_number}</span>` : ''}
    ${profile?.email ? `<span><span class="c-ico ico-mail"></span><a href="mailto:${profile.email}">${profile.email}</a></span>` : ''}
    <span><span class="c-ico ico-web"></span><a href="http://portfolio-nilsen.unityfianar.site/">Portfolio</a></span>
    ${profile?.link_github ? `<span><span class="c-ico ico-gh"></span><a href="${profile.link_github}">github</a></span>` : ''}
  </div>
</div>
<div class="body">
  ${profile?.about ? `
  <div class="section">
    <div class="section-title"><svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="var(--blue)" d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>Profil professionnel</div>
    <p class="about-text">${profile.about}</p>
  </div>` : ''}

  ${allExp.length > 0 ? `
  <div class="section">
    <div class="section-title"><svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="var(--blue)" d="M20 6h-2.18c.07-.44.18-.88.18-1.33C18 2.99 16.5 1.5 14.67 1.5c-1.06 0-1.96.51-2.59 1.29L12 3.4l-.08-.61C11.37 2.01 10.47 1.5 9.33 1.5 7.5 1.5 6 2.99 6 4.67c0 .45.11.89.18 1.33H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5.33-2.83c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9.33 3.17c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM20 19H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.26 1 1.26L15.38 12 17 10.83 14.92 8H20v6z"/></svg>Expériences professionnelles</div>
    ${expHTML}
  </div>` : ''}

  ${formations.length > 0 ? `
  <div class="section">
    <div class="section-title"><svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="var(--blue)" d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm-7 8.26V15l7 3.87L19 15v-3.74l-7 3.82-7-3.82z"/></svg>Formation</div>
    ${formHTML}
  </div>` : ''}

  ${skillsGrouped.size > 0 ? `
  <div class="section">
    <div class="section-title"><svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="var(--blue)" d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>Compétences</div>
    ${skillsHTML}
  </div>` : ''}

  ${awards.length > 0 ? `
  <div class="section">
    <div class="section-title"><svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="var(--blue)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>Projets sélectionnés</div>
    <div class="proj-grid">${projHTML}</div>
  </div>` : ''}

  ${langues.length > 0 ? `
  <div class="section">
    <div class="section-title"><svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="var(--blue)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>Langues</div>
    <div class="inline-grid">${langHTML}</div>
  </div>` : ''}

</div>
</div>
</body>
</html>`;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">CV Dynamique</h1>
          <p className="text-sm text-foreground/50">Aperçu généré depuis vos données backoffice</p>
        </div>
        <Button onClick={() => window.print()} variant="secondary">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2 inline">
            <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
          </svg>
          Imprimer / Exporter PDF
        </Button>
      </div>

      {/* CV iframe */}
      <iframe
        srcDoc={html}
        className="w-full border-0 rounded-xl"
        style={{ height: "90vh" }}
        title="CV Preview"
      />
    </div>
  );
}
