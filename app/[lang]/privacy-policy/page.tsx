"use client";

import { useLanguage } from "../../hooks/LanguageProvider";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const { t, lang } = useLanguage();

  const currentDate = new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-navy text-white">
      {/* Header Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-navy via-navy/95 to-navy/90 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(246,140,9,0.15),transparent)]" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2">
            <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm font-semibold text-accent">{t("privacyPolicy.subtitle")}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            {t("privacyPolicy.title")}
          </h1>

          <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto">
            {t("privacyPolicy.subtitle")}: {currentDate}
          </p>

          <div className="mt-8">
            <Link 
              href={`/${lang}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 hover:border-accent/40 hover:bg-accent/10 hover:text-white transition-all duration-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t("privacyPolicy.backToHome")}
            </Link>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          {/* Introduction */}
          <div className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-8">
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              {t("privacyPolicy.intro")}
            </p>
          </div>

          {/* Section 1: Information Collection */}
          <div className="mb-10">
            <h2 className="mb-4 text-2xl sm:text-3xl font-bold text-white flex items-start gap-3">
              <span className="text-accent">{t("privacyPolicy.sections.collection.title").split(".")[0]}.</span>
              <span>{t("privacyPolicy.sections.collection.title").split(". ")[1]}</span>
            </h2>
            <p className="text-white/70 leading-relaxed">
              {t("privacyPolicy.sections.collection.content")}
            </p>
          </div>

          {/* Section 2: Use of Information */}
          <div className="mb-10">
            <h2 className="mb-4 text-2xl sm:text-3xl font-bold text-white flex items-start gap-3">
              <span className="text-accent">{t("privacyPolicy.sections.use.title").split(".")[0]}.</span>
              <span>{t("privacyPolicy.sections.use.title").split(". ")[1]}</span>
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              {t("privacyPolicy.sections.use.content")}
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-white/70 flex items-start gap-3">
                <span className="text-accent mt-1">•</span>
                <span>{lang === "fr" ? "Communiquer avec vous" : "Communicate with you"}</span>
              </li>
              <li className="text-white/70 flex items-start gap-3">
                <span className="text-accent mt-1">•</span>
                <span>{lang === "fr" ? "Améliorer et optimiser notre site" : "Improve and optimize our site"}</span>
              </li>
              <li className="text-white/70 flex items-start gap-3">
                <span className="text-accent mt-1">•</span>
                <span>{lang === "fr" ? "Analyser les statistiques d'utilisation" : "Analyze usage statistics"}</span>
              </li>
              <li className="text-white/70 flex items-start gap-3">
                <span className="text-accent mt-1">•</span>
                <span>{lang === "fr" ? "Répondre à vos demandes de contact" : "Respond to your contact requests"}</span>
              </li>
              <li className="text-white/70 flex items-start gap-3">
                <span className="text-accent mt-1">•</span>
                <span>{lang === "fr" ? "Personnaliser votre expérience utilisateur" : "Personalize your user experience"}</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Cookies */}
          <div className="mb-10">
            <h2 className="mb-4 text-2xl sm:text-3xl font-bold text-white flex items-start gap-3">
              <span className="text-accent">{t("privacyPolicy.sections.cookies.title").split(".")[0]}.</span>
              <span>{t("privacyPolicy.sections.cookies.title").split(". ")[1]}</span>
            </h2>
            <p className="text-white/70 leading-relaxed">
              {t("privacyPolicy.sections.cookies.content")}
            </p>
          </div>

          {/* Section 4: Information Sharing */}
          <div className="mb-10">
            <h2 className="mb-4 text-2xl sm:text-3xl font-bold text-white flex items-start gap-3">
              <span className="text-accent">{t("privacyPolicy.sections.sharing.title").split(".")[0]}.</span>
              <span>{t("privacyPolicy.sections.sharing.title").split(". ")[1]}</span>
            </h2>
            <p className="text-white/70 leading-relaxed">
              {t("privacyPolicy.sections.sharing.content")}
            </p>
          </div>

          {/* Section 5: Your Rights */}
          <div className="mb-10">
            <h2 className="mb-4 text-2xl sm:text-3xl font-bold text-white flex items-start gap-3">
              <span className="text-accent">{t("privacyPolicy.sections.rights.title").split(".")[0]}.</span>
              <span>{t("privacyPolicy.sections.rights.title").split(". ")[1]}</span>
            </h2>
            <p className="text-white/70 leading-relaxed">
              {t("privacyPolicy.sections.rights.content")}
            </p>
          </div>

          {/* Section 6: Data Security */}
          <div className="mb-10">
            <h2 className="mb-4 text-2xl sm:text-3xl font-bold text-white flex items-start gap-3">
              <span className="text-accent">{t("privacyPolicy.sections.security.title").split(".")[0]}.</span>
              <span>{t("privacyPolicy.sections.security.title").split(". ")[1]}</span>
            </h2>
            <p className="text-white/70 leading-relaxed">
              {t("privacyPolicy.sections.security.content")}
            </p>
          </div>

          {/* Section 7: Third-Party Services */}
          <div className="mb-10">
            <h2 className="mb-4 text-2xl sm:text-3xl font-bold text-white flex items-start gap-3">
              <span className="text-accent">{t("privacyPolicy.sections.thirdParty.title").split(".")[0]}.</span>
              <span>{t("privacyPolicy.sections.thirdParty.title").split(". ")[1]}</span>
            </h2>
            <p className="text-white/70 leading-relaxed">
              {t("privacyPolicy.sections.thirdParty.content")}
            </p>
          </div>

          {/* Section 8: Contact */}
          <div className="mb-10">
            <h2 className="mb-4 text-2xl sm:text-3xl font-bold text-white flex items-start gap-3">
              <span className="text-accent">{t("privacyPolicy.sections.contact.title").split(".")[0]}.</span>
              <span>{t("privacyPolicy.sections.contact.title").split(". ")[1]}</span>
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              {t("privacyPolicy.sections.contact.content")}
            </p>
            <a 
              href="mailto:nilsen.ung.a@gmail.com"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-semibold transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              nilsen.ung.a@gmail.com
            </a>
          </div>

          {/* Section 9: Policy Changes */}
          <div className="mb-10">
            <h2 className="mb-4 text-2xl sm:text-3xl font-bold text-white flex items-start gap-3">
              <span className="text-accent">{t("privacyPolicy.sections.changes.title").split(".")[0]}.</span>
              <span>{t("privacyPolicy.sections.changes.title").split(". ")[1]}</span>
            </h2>
            <p className="text-white/70 leading-relaxed">
              {t("privacyPolicy.sections.changes.content")}
            </p>
          </div>

          {/* Footer Call-to-Action */}
          <div className="mt-16 rounded-2xl border border-accent/20 bg-accent/5 p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-accent mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">
              {lang === "fr" ? "Vos données sont protégées" : "Your data is protected"}
            </h3>
            <p className="text-white/60 mb-6">
              {lang === "fr" 
                ? "Nous prenons la confidentialité de vos données très au sérieux et nous engageons à les protéger." 
                : "We take the privacy of your data very seriously and are committed to protecting it."}
            </p>
            <Link 
              href={`/${lang}#contact`}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-navy hover:brightness-110 transition-all duration-200 shadow-lg shadow-accent/25"
            >
              {lang === "fr" ? "Contactez-nous" : "Contact us"}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
