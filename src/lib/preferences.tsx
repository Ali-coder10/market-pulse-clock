import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ClockTheme = "digital" | "analog" | "vintage" | "glass" | "trading";
export type Background = "black" | "gradient" | "night" | "city" | "candles" | "luxury" | "vintage" | "neon";
export type TimeFormat = "12h" | "24h";
export type Mode = "dark" | "light";

export interface Prefs {
  theme: ClockTheme;
  background: Background;
  format: TimeFormat;
  mode: Mode;
  size: number; // 0.8 – 1.4
  animations: boolean;
}

const DEFAULT: Prefs = {
  theme: "digital",
  background: "gradient",
  format: "24h",
  mode: "dark",
  size: 1,
  animations: true,
};

const KEY = "traderclock.prefs.v1";

const Ctx = createContext<{
  prefs: Prefs;
  set: <K extends keyof Prefs>(k: K, v: Prefs[K]) => void;
} | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch {}
    document.documentElement.classList.toggle("light-mode", prefs.mode === "light");
  }, [prefs, hydrated]);

  const set = <K extends keyof Prefs>(k: K, v: Prefs[K]) =>
    setPrefs(p => ({ ...p, [k]: v }));

  return <Ctx.Provider value={{ prefs, set }}>{children}</Ctx.Provider>;
}

export function usePrefs() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePrefs outside provider");
  return c;
}
