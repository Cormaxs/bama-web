"use client";

import { useEffect } from "react";

export default function RemoveExtensionAttrs() {
  useEffect(() => {
    try {
      const re = /^bis_/i;
      const rootNodes = [document.documentElement, document.head, document.body];
      rootNodes.forEach((root) => {
        if (!root) return;
        const els = root.querySelectorAll ? root.querySelectorAll("*") : [];
        for (let i = 0; i < els.length; i++) {
          const el = els[i] as Element;
          if (!el.attributes) continue;
          const attrs = Array.from(el.attributes);
          for (let j = 0; j < attrs.length; j++) {
            const name = attrs[j].name;
            if (re.test(name)) el.removeAttribute(name);
          }
        }
      });
    } catch {
      // silent
    }
  }, []);

  return null;
}
