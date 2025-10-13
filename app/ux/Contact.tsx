"use client";

import { useState, useRef } from "react";
import { useLanguage } from "../hooks/LanguageProvider";
import { useTheme } from "../components/ThemeProvider";
import { useLatency } from "../hooks/useLatency";
import { useSendEmail } from "../hooks/useSendEmail";
import { useProfile } from "../hooks/useProfile";
import { NotificationService } from "../services/notificationService";
import { getAdaptiveShadow, getAdaptiveBorderColor } from "../lib/shadowUtils";
import VisitStats from "./VisitStats";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import StatusMessage from "./ui/StatusMessage";
import ContactInfoCard from "./ui/ContactInfoCard";

export default function Contact() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { loading, error, success, send } = useSendEmail();
  const { profile, loading: profileLoading } = useProfile();
  const latency = useLatency(5000);
  const isDark = theme === "dark";
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const resetForm = () => {
    setName("");
    setEmail("");
    setMessage("");
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setInvalid(false);

    const isEmail = /.+@.+\..+/.test(email.trim());
    if (!name.trim() || !isEmail || !message.trim()) {
      setInvalid(true);
      return;
    }

    try {
      await send({ name: name.trim(), email: email.trim(), message: message.trim() });
      
      await NotificationService.showSuccess({
        text: t("contact.successMessage")
      });
      
      resetForm();
    } catch {
      await NotificationService.showError({
        text: error || t("contact.errorMessage")
      });
    }
  }

  return (
    <section id="contact" className="relative min-h-screen py-8 sm:py-12 lg:py-20 overflow-hidden border-b-2" style={{ background: 'var(--background)', borderColor: getAdaptiveBorderColor(isDark), boxShadow: getAdaptiveShadow(isDark) }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-accent/15 to-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-accent/10 to-accent/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative mx-auto max-w-6xl px-3 sm:px-4 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-accent to-accent/80 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--foreground)' }}>
            {t("contact.title")}
          </h2>
          <p className="text-sm sm:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed px-2">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Contact Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl sm:rounded-3xl blur-xl" />
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-accent/20">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Name Field */}
                <Input
                  label={t("contact.name")}
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("contact.name")}
                  disabled={loading}
                  required
                />

                {/* Email Field */}
                <Input
                  label={t("contact.email")}
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("contact.email")}
                  disabled={loading}
                  required
                />

                {/* Message Field */}
                <Textarea
                  label={t("contact.message")}
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("contact.message")}
                  rows={5}
                  disabled={loading}
                  required
                />

                {/* Status Messages */}
              {invalid && (
                  <StatusMessage type="warning">
                    {t("contact.invalidMessage")}
                  </StatusMessage>
                )}

              {error && (
                  <StatusMessage type="error">
                    {t("contact.errorMessage")}{error ? `: ${error}` : "."}
                  </StatusMessage>
                )}

              {success && (
                  <StatusMessage type="success">
                    {t("contact.successMessage")}
                  </StatusMessage>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 sm:py-4 px-6 sm:px-8 bg-gradient-to-r from-accent to-accent/90 text-navy font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden text-sm sm:text-base"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/80 to-accent/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t("contact.sending")}
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        {t("contact.send")}
                      </>
                    )}
                  </span>
                </button>
            </form>
          </div>
          </div>

          {/* Contact Info & Stats */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Contact Information */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl sm:rounded-3xl blur-xl" />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-8 shadow-2xl border border-accent/20">
                <div className="flex items-center gap-2.5 sm:gap-4 mb-3.5 sm:mb-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-accent to-accent/80 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-xl lg:text-2xl font-bold text-navy">{t("contact.directContact")}</h3>
                </div>
                
                <div className="space-y-2.5 sm:space-y-4">
                  <ContactInfoCard
                    icon={
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                    title={t("footer.email")}
                  >
                    <a href={`mailto:${profile?.email || "alitsiryeddynilsen@gmail.com"}`} className="text-accent hover:text-accent/80 transition-colors">
                      {profileLoading ? "Loading..." : profile?.email || "alitsiryeddynilsen@gmail.com"}
                    </a>
                  </ContactInfoCard>

                  <ContactInfoCard
                    icon={
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                    title={t("contact.availability")}
                  >
                    <p className="text-navy/70">{t("contact.responseTime")}</p>
                  </ContactInfoCard>

                  <ContactInfoCard
                    icon={
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    }
                    title="Latence"
                  >
                    <p className="text-navy/70">
                      {latency !== null ? `${latency} ms` : '—'}
                    </p>
                  </ContactInfoCard>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl sm:rounded-3xl blur-xl" />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-5 lg:p-7 shadow-2xl border border-accent/20">
                <div className="flex items-center gap-2.5 sm:gap-4 mb-3.5 sm:mb-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-accent to-accent/80 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-xl lg:text-2xl font-bold text-navy">{t("contact.socialNetworks")}</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {profile?.link_linkedin && (
                    <a href={profile.link_linkedin} target="_blank" rel="noreferrer noopener" className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-4 bg-navy/5 rounded-xl sm:rounded-2xl hover:bg-navy/10 hover:border-accent/30 border border-transparent transition-all group">
                      <div className="w-7 h-7 sm:w-10 sm:h-10 bg-navy rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-xs sm:text-base">LinkedIn</p>
                        <p className="text-[10px] sm:text-sm text-navy/70">{t("contact.connectWithMe")}</p>
                      </div>
                    </a>
                  )}

                  {profile?.link_github && (
                    <a href={profile.link_github} target="_blank" rel="noreferrer noopener" className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-4 bg-navy/5 rounded-xl sm:rounded-2xl hover:bg-navy/10 hover:border-accent/30 border border-transparent transition-all group">
                      <div className="w-7 h-7 sm:w-10 sm:h-10 bg-navy rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-xs sm:text-base">GitHub</p>
                        <p className="text-[10px] sm:text-sm text-navy/70">{t("contact.discoverProjects")}</p>
                      </div>
                    </a>
                  )}

                  {profile?.link_facebook && (
                    <a href={profile.link_facebook} target="_blank" rel="noreferrer noopener" className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-4 bg-navy/5 rounded-xl sm:rounded-2xl hover:bg-navy/10 hover:border-accent/30 border border-transparent transition-all group">
                      <div className="w-7 h-7 sm:w-10 sm:h-10 bg-navy rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-xs sm:text-base">Facebook</p>
                        <p className="text-[10px] sm:text-sm text-navy/70">{t("contact.followNews")}</p>
                      </div>
                    </a>
                  )}
              </div>
                </div>
              </div>
              
            {/* Visit Stats */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl sm:rounded-3xl blur-xl" />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-accent/20">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-accent to-accent/80 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-navy">{t("contact.statistics")}</h3>
                </div>
                <VisitStats className="text-navy/80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


