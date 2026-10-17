/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  rootMargin?: string;
};

export default function LazyImage({ src, alt, className = "", rootMargin = "200px", ...rest }: Props) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const maxRetries = 3;
  const retryDelay = 3000; // 3s
  const retryTimer = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisible(true);
              obs.disconnect();
            }
          });
        },
        { root: null, rootMargin }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }

    // fallback: set visible asynchronously to avoid synchronous setState in effect
    setTimeout(() => setVisible(true), 0);
  }, [rootMargin]);

  useEffect(() => {
    return () => {
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
  }, []);

  const addCacheBuster = (u: string, t: number) => {
    try {
      const url = new URL(u);
      url.searchParams.set('r', String(t));
      return url.toString();
    } catch {
      // if invalid URL, append param
      return `${u}${u.includes('?') ? '&' : '?'}r=${t}`;
    }
  };

  const handleError = () => {
    setLoaded(false);
    if (attempt < maxRetries) {
      // schedule another attempt after retryDelay
      retryTimer.current = window.setTimeout(() => {
        setAttempt((a) => a + 1);
      }, retryDelay);
    }
  };

  // If not yet visible, do not set `src` (undefined) to avoid empty-string warnings.
  const currentSrc: string | undefined = visible ? (attempt === 0 ? src : addCacheBuster(src, attempt)) : undefined;

  return (
    <img
      ref={ref}
      src={currentSrc}
      alt={alt}
      className={`${className} ${loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'} transition-all duration-500`}
      onLoad={() => setLoaded(true)}
      onError={handleError}
      loading="lazy"
      {...rest}
    />
  );
}
