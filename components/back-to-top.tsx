"use client";

import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <a
        href="https://www.instagram.com/bamafotografia/"
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram de BAMA"
        title="Instagram de BAMA"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#3b2c27] bg-[#171310]/80 text-[#f6f1eb] shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-200 hover:border-[#d38a5a] hover:text-[#f8d8c1]"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm5-3.2a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2Z"/>
        </svg>
      </a>

      <button
        onClick={scrollTop}
        aria-label="Subir al inicio"
        title="Subir al inicio"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d38a5a]/40 bg-[#171310]/80 text-[#f6f1eb] shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-200 hover:bg-[#1d1714] hover:text-white"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-5 5m5-5l5 5" />
        </svg>
      </button>
    </div>
  );
}
