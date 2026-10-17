"use client";

import React, { useState } from "react";

type Item = {
  question: string;
  answer: string;
};

export default function FaqAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
        Preguntas Frecuentes
      </h2>

      <div className="space-y-3 sm:space-y-4">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm"
          >
            <button
              type="button"
              aria-expanded={open === idx}
              onClick={() => setOpen(open === idx ? null : idx)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
            >
              <span className="text-sm font-medium text-white sm:text-base">{it.question}</span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg transition-colors ${
                  open === idx
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-stone-700 bg-stone-950 text-stone-300"
                }`}
              >
                {open === idx ? "−" : "+"}
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                open === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-stone-800 px-4 pb-4 pt-4 text-sm leading-7 text-stone-300 sm:px-5 sm:text-[15px]">
                {it.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
