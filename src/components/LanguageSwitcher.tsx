import { useEffect, useRef, useState } from "react";

type Lang = "zh" | "en";

const STORAGE_KEY = "language";

function readInitialLang(): Lang {
  if (typeof window === "undefined") return "zh";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "en" ? "en" : "zh";
}

function applyLang(lang: Lang) {
  document.documentElement.setAttribute("data-lang", lang);
  document.documentElement.lang = lang === "en" ? "en" : "zh-TW";
}

export default function LanguageSwitcher() {
  const [lang, setLang] = useState<Lang>("zh");
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLang(readInitialLang());
    setHydrated(true);
  }, []);

  // Close menu on outside click / escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (next: Lang) => {
    setLang(next);
    applyLang(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore quota / private mode errors
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label={lang === "en" ? "Change language" : "切換語言"}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </button>

      {hydrated && open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 min-w-[140px] rounded-md border border-border bg-card shadow-lg overflow-hidden z-50"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => choose("zh")}
            className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-secondary ${
              lang === "zh" ? "bg-secondary font-medium" : ""
            }`}
          >
            繁體中文
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => choose("en")}
            className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-secondary ${
              lang === "en" ? "bg-secondary font-medium" : ""
            }`}
          >
            English
          </button>
        </div>
      )}
    </div>
  );
}
