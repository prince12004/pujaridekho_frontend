"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function LanguageSwitch() {
  const [lang, setLang] = useState<"en" | "hi">("en");

  return (
    <div className="flex items-center gap-0.5 rounded-full bg-white/10 p-0.5" role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={cn(
          "rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors",
          lang === "en" ? "bg-accent text-secondary" : "text-brand-cream/80 hover:text-brand-cream",
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("hi")}
        aria-pressed={lang === "hi"}
        className={cn(
          "lang-hi rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors",
          lang === "hi" ? "bg-accent text-secondary" : "text-brand-cream/80 hover:text-brand-cream",
        )}
      >
        हिं
      </button>
    </div>
  );
}
