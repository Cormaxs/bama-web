import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import BackToTop from "@/components/back-to-top";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bamafoto.dev"),
  title: {
    default: "BAMA Fotografía | Catamarca y Tucumán",
    template: "%s | BAMA Fotografía",
  },
  description:
    "Fotógrafo en Catamarca y Tucumán. Retratos, paisajes, sesiones, eventos y galerías con una estética natural, editorial y cinematográfica.",
  applicationName: "BAMA Fotografía",
  category: "photography",
  keywords: [
    "fotografía",
    "fotógrafo",
    "fotógrafa",
    "Catamarca",
    "Tucumán",
    "portafolio fotográfico",
    "galería",
    "paisajes",
    "retratos",
    "sesiones fotograficas",
    "eventos",
    "editorial",
  ],
  authors: [{ name: "BAMA Fotografía" }],
  creator: "BAMA Fotografía",
  publisher: "BAMA Fotografía",
  alternates: {
    canonical: "/",
    languages: {
      "es-AR": "https://www.bamafoto.dev",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://www.bamafoto.dev",
    title: "BAMA Fotografía | Catamarca y Tucumán",
    description:
      "Portfolio fotográfico con retratos, paisajes y galerías en Catamarca y Tucumán.",
    siteName: "BAMA Fotografía",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "BAMA Fotografía preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BAMA Fotografía | Catamarca y Tucumán",
    description:
      "Retratos, paisajes y momentos reales capturados con una estética natural y editorial.",
    images: ["/og-image.svg"],
    creator: "@bamafotografia",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/logo-Blanco.webp" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#14110f" />
        <meta name="description" content="Fotógrafo en Catamarca y Tucumán. Retratos, paisajes, sesiones y galerías con estética natural y editorial." />
        <meta name="keywords" content="fotografía, fotógrafo, Catamarca, Tucumán, retratos, paisajes, galerías, sesiones" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BAMA Fotografía" />
        <meta property="og:title" content="BAMA Fotografía | Catamarca y Tucumán" />
        <meta property="og:description" content="Portfolio fotográfico con retratos, paisajes y galerías en Catamarca y Tucumán." />
        <meta property="og:image" content="https://www.bamafoto.dev/og-image.svg" />
        <meta property="og:image:alt" content="BAMA Fotografía" />
        <meta property="og:url" content="https://www.bamafoto.dev" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BAMA Fotografía | Catamarca y Tucumán" />
        <meta name="twitter:description" content="Portfolio fotográfico con retratos, paisajes y galerías en Catamarca y Tucumán." />
        <meta name="twitter:image" content="https://www.bamafoto.dev/og-image.svg" />
      </head>
      <body suppressHydrationWarning className="min-h-full bg-[#14110f] text-[#f6f1eb] flex flex-col">
        {/* Remove known extension-injected attributes before React hydrates to avoid hydration mismatch in some browsers */}
        <Script
          id="remove-extension-attrs"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: `(() => {
            try {
              const re = /^bis_/i;
              const rootNodes = [document.documentElement, document.head, document.body];
              rootNodes.forEach((root) => {
                if (!root) return;
                const els = root.querySelectorAll ? root.querySelectorAll('*') : [];
                for (let i = 0; i < els.length; i++) {
                  const el = els[i];
                  if (!el.attributes) continue;
                  const attrs = Array.from(el.attributes);
                  for (let j = 0; j < attrs.length; j++) {
                    const name = attrs[j].name;
                    if (re.test(name)) el.removeAttribute(name);
                  }
                }
              });
            } catch (e) {
              // silent
            }
          })();` }}
        />

        <header className="sticky top-0 z-40 border-b border-[#9d9edc]/25 bg-[#171310]/80 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
            <Link href="/" className="flex items-center gap-3" aria-label="BAMA photography home">
              <Image src="/logo-Blanco.webp" alt="BAMA FOTOGRAFÍA" width={100} height={52} className="object-contain" priority />
            </Link>

            <nav className="hidden items-center gap-6 text-sm text-[#f3f4f6] md:flex">
              <Link href="/" className="transition hover:text-[#fdfdfd]">Inicio</Link>
              <Link href="/#colecciones" className="transition hover:text-[#fdfdfd]">Colecciones</Link>
              <Link href="/#faq" className="transition hover:text-[#fdfdfd]">Preguntas</Link>
              <Link href="/terminos" className="transition hover:text-[#fdfdfd]">Términos</Link>
              <Link href="/galeria" className="transition hover:text-[#fdfdfd]">Galería</Link>
            </nav>

            <Link
              href="https://wa.me/543834577609"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#9d9edc] px-4 py-2 text-sm font-medium text-[#14110f] transition hover:bg-[#b0b1ea]"
            >
              Contactar
            </Link>
          </div>
        </header>

        <main className="flex-1 w-full">
          {children}
        </main>

        <footer className="w-full border-t border-[#3b2c27] bg-[#171310]">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-[11px] text-[#d9cfc4] sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:text-xs">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
              <span>Copyright © 2024 Bama-Fotografia</span>
              <span className="hidden text-[#8a857f] sm:inline">|</span>
              <a
                href="https://facstock.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#f5d3b8] transition hover:text-white"
              >
                Created by facstock
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link href="/" className="text-[#d9cfc4] hover:text-white">Inicio</Link>
              <Link href="/galeria" className="text-[#d9cfc4] hover:text-white">Galería</Link>
              <Link href="/terminos" className="text-[#d9cfc4] hover:text-white">Términos</Link>
            </div>
          </div>
        </footer>
        <BackToTop />
      </body>
    </html>
  );
}
