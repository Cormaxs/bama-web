"use client";

import { useEffect, useState, useRef, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

interface Img { id?: string; name?: string; url: string; albumSlug?: string }

export default function HeroCarousel({ images }: { images: Img[] }) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const router = useRouter();
  const start = () => {
    stop();
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (images.length ? (i + 1) % images.length : 0));
    }, 4000);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const prev = () => setIndex((i) => (images.length ? (i - 1 + images.length) % images.length : 0));
  const next = () => setIndex((i) => (images.length ? (i + 1) % images.length : 0));

  const current = images[index] || images[0] || { url: "" };

  return (
    <div
      onMouseEnter={stop}
      onMouseLeave={start}
      className="relative w-full h-72 sm:h-96 rounded-[2rem] overflow-hidden border border-stone-800 bg-black"
    >

      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (current.albumSlug) router.push(`/galeria/${current.albumSlug}`);
        }}
        onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" && current.albumSlug) router.push(`/galeria/${current.albumSlug}`);
        }}
        aria-hidden={false}
        style={{ backgroundImage: `url(${current.url})` }}
        className="absolute inset-0 bg-center bg-cover transform transition duration-700 cursor-pointer"
      />

      <div className="absolute inset-0 bg-black/35 pointer-events-none" />

      <div className="absolute z-10 inset-0 flex items-center justify-between px-4 sm:px-6">
        <button onClick={prev} aria-label="Anterior" className="text-white bg-black/30 hover:bg-black/50 rounded-full p-2 hidden sm:inline-flex">
          ❮
        </button>
        <button onClick={next} aria-label="Siguiente" className="text-white bg-black/30 hover:bg-black/50 rounded-full p-2 hidden sm:inline-flex">
          ❯
        </button>
      </div>

      {/* caption removed per request; clicking/tapping the image navigates to its album */}

      <div className="absolute right-4 bottom-4 z-20 flex gap-2">
        {(() => {
          const maxDots = Math.min(4, images.length);
          if (maxDots <= 0) return null;
          const perGroup = Math.ceil(images.length / maxDots);
          const groupIndex = Math.floor(index / perGroup);
          return Array.from({ length: maxDots }).map((_, gi) => {
            const startIndex = gi * perGroup;
            const active = gi === groupIndex;
            return (
              <button
                key={gi}
                onClick={() => setIndex(startIndex)}
                aria-label={`Go to group ${gi + 1}`}
                className={`w-2 h-2 rounded-full ${active ? 'bg-white' : 'bg-white/40'}`}
              />
            );
          });
        })()}
      </div>
    </div>
  );
}
