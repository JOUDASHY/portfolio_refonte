import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nilsen Tovohery – Développeur Full‑Stack & Admin Sys",
  description:
    "Portfolio de Nilsen Tovohery, développeur full‑stack et administrateur systèmes basé à Fianarantsoa, Madagascar.",
  metadataBase: new URL("https://portfolio.unityfianar.site"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Nilsen Tovohery – Développeur Full‑Stack & Admin Sys",
    description:
      "Découvrez les projets et compétences de Nilsen Tovohery, développeur full‑stack et administrateur systèmes à Fianarantsoa, Madagascar.",
    url: "/",
    siteName: "Portfolio Nilsen Tovohery",
    images: [
      {
        url: "/nilsen-Photoroom.png",
        width: 968,
        height: 768,
        alt: "Portrait de Nilsen Tovohery, développeur full‑stack et admin sys",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nilsen Tovohery – Développeur Full‑Stack & Admin Sys",
    description:
      "Portfolio de Nilsen Tovohery, développeur full‑stack et administrateur systèmes à Fianarantsoa, Madagascar.",
    images: ["/nilsen-Photoroom.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Script id="tawk-script" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/69be5a32977ac51c36884226/1jk7p0m29';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}

