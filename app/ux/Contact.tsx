"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../hooks/LanguageProvider";
import { useSendEmail } from "../hooks/useSendEmail";
import { useProfile } from "../hooks/useProfile";
import { toast } from "react-toastify";

// Heartbeat Connection Indicator Component - ECG Style
function HeartbeatConnection() {
  const [latency, setLatency] = useState<number | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'good' | 'medium' | 'poor' | 'checking'>('checking');
  
  useEffect(() => {
    const checkConnection = async () => {
      const start = performance.now();
      try {
        const response = await fetch('/api/health', { 
          method: 'HEAD',
          cache: 'no-store'
        }).catch(() => null);
        
        const end = performance.now();
        const ping = Math.round(end - start);
        setLatency(ping);
        
        if (ping < 100) {
          setConnectionStatus('good');
        } else if (ping < 300) {
          setConnectionStatus('medium');
        } else {
          setConnectionStatus('poor');
        }
      } catch {
        setConnectionStatus('poor');
        setLatency(null);
      }
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const getColor = () => {
    // Use yellow accent color for all statuses
    return '#f68c09';
  };
  
  const getSpeed = () => {
    // Slower animation speeds
    switch (connectionStatus) {
      case 'good': return 2.5;
      case 'medium': return 3;
      case 'poor': return 3.5;
      default: return 2.8;
    }
  };
  
  // Generate ECG path - classic heartbeat pattern
  const generateECGPath = () => {
    const points = [];
    const width = 300;
    const height = 80;
    const baseline = height / 2;
    
    for (let x = 0; x <= width; x += 2) {
      let y = baseline;
      
      // Create repeating heartbeat pattern
      const cycle = x % 100;
      
      if (cycle >= 10 && cycle < 15) {
        // P wave (small bump)
        y = baseline - 10 * Math.sin((cycle - 10) * Math.PI / 5);
      } else if (cycle >= 20 && cycle < 25) {
        // Q dip
        y = baseline + 5;
      } else if (cycle >= 25 && cycle < 30) {
        // R spike (big peak)
        y = baseline - 50;
      } else if (cycle >= 30 && cycle < 35) {
        // S dip
        y = baseline + 15;
      } else if (cycle >= 40 && cycle < 50) {
        // T wave (medium bump)
        y = baseline - 15 * Math.sin((cycle - 40) * Math.PI / 10);
      }
      
      points.push(`${x},${y}`);
    }
    
    return `M ${points.join(' L ')}`;
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-4 bg-black">
      {/* ECG Monitor */}
      <div className="relative w-full h-24 overflow-hidden rounded-lg border border-slate-700 bg-black">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(to right, #333 1px, transparent 1px),
              linear-gradient(to bottom, #333 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        {/* ECG Line */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={getColor()} stopOpacity="0" />
              <stop offset="20%" stopColor={getColor()} stopOpacity="1" />
              <stop offset="80%" stopColor={getColor()} stopOpacity="1" />
              <stop offset="100%" stopColor={getColor()} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={generateECGPath()}
            fill="none"
            stroke="url(#ecgGradient)"
            strokeWidth="2"
            className="animate-ecg"
            style={{
              animationDuration: `${getSpeed()}s`
            }}
          />
        </svg>
        
        {/* Scan line */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white/30 animate-scan"
          style={{
            animationDuration: `${getSpeed()}s`
          }}
        />
      </div>
      
      {/* Status */}
      <div className="mt-2 flex items-center gap-2">
        <div 
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: getColor() }}
        />
        <p className="text-xs text-slate-400 uppercase tracking-wider">
          {connectionStatus === 'checking' ? 'Checking...' : 
           connectionStatus === 'good' ? 'Connected' :
           connectionStatus === 'medium' ? 'Slow Connection' : 'Poor Connection'}
        </p>
        {latency !== null && (
          <span className="text-xs font-mono text-slate-500">{latency}ms</span>
        )}
      </div>
    </div>
  );
}

export default function Contact() {
  const { t } = useLanguage();
  const { loading, error, success, send } = useSendEmail();
  const { profile } = useProfile();
  
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

      toast.success(t("contact.successMessage"));
      
      resetForm();
    } catch {
      toast.error(error || t("contact.errorMessage"));
    }
  }

  return (
    <section 
      id="contact" 
      className="relative py-16 sm:py-20 lg:py-24 border-b-2 border-slate-200 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url(https://wallpaperaccess.com/full/829031.jpg)' }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">
            {t("contact.title")}
          </h2>
          <p className="text-sm sm:text-lg text-white/80 max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-16">
          {/* Contact Form with Voice Wave */}
          <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-200">
            {/* Voice Wave Animation */}
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mt-2 sm:mt-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                  {t("contact.name")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("contact.name")}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                  {t("contact.email")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("contact.email")}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                  {t("contact.message")}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("contact.message")}
                  rows={4}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none text-sm"
                />
              </div>

              {invalid && (
                <div className="p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-xs sm:text-sm">
                  {t("contact.invalidMessage")}
                </div>
              )}

              {error && (
                <div className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
                  {t("contact.errorMessage")}{error ? `: ${error}` : "."}
                </div>
              )}

              {success && (
                <div className="p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs sm:text-sm">
                  {t("contact.successMessage")}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? t("contact.sending") : t("contact.send")}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-8">
            {/* Direct Contact */}
            <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-200">
              <h3 className="text-base sm:text-xl font-semibold text-slate-800 mb-3 sm:mb-6">
                {t("contact.directContact")}
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                <a 
                  href={`mailto:${profile?.email || "alitsiryeddynilsen@gmail.com"}`}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-slate-200 hover:border-accent transition-colors"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">{t("footer.email")}</p>
                    <p className="text-slate-800 font-medium text-xs sm:text-base">
                      {profile?.email || "alitsiryeddynilsen@gmail.com"}
                    </p>
                  </div>
                </a>

                <div className="h-24 sm:h-32 bg-white rounded-lg sm:rounded-xl border border-slate-200 overflow-hidden">
                  <HeartbeatConnection />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-200">
              <h3 className="text-base sm:text-xl font-semibold text-slate-800 mb-3 sm:mb-6">
                {t("contact.socialNetworks")}
              </h3>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {profile?.link_linkedin && (
                  <a 
                    href={profile.link_linkedin} 
                    target="_blank" 
                    rel="noreferrer noopener"
                    className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-slate-200 hover:border-accent transition-colors"
                  >
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-xs sm:text-sm text-slate-600">LinkedIn</span>
                  </a>
                )}

                {/* {profile?.link_github && (
                  <a 
                    href={profile.link_github} 
                    target="_blank" 
                    rel="noreferrer noopener"
                    className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-slate-200 hover:border-accent transition-colors"
                  >
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="text-xs sm:text-sm text-slate-600">GitHub</span>
                  </a>
                )} */}

                {profile?.link_instagram && (
                  <a
                    href={profile.link_instagram}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-slate-200 hover:border-accent transition-colors"
                  >
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24"
                      style={{ color: '#E1306C' }}>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span className="text-xs sm:text-sm text-slate-600">Instagram</span>
                  </a>
                )}

                {profile?.link_whatsapp && (
                  <a
                    href={`https://wa.me/${profile.link_whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-slate-200 hover:border-accent transition-colors"
                  >
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#25D366' }}>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                    </svg>
                    <span className="text-xs sm:text-sm text-slate-600">WhatsApp</span>
                  </a>
                )}

                {profile?.link_facebook && (
                  <a 
                    href={profile.link_facebook} 
                    target="_blank" 
                    rel="noreferrer noopener"
                    className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-slate-200 hover:border-accent transition-colors"
                  >
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-xs sm:text-sm text-slate-600">Facebook</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


