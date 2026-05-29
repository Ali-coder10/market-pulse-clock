import { useState } from "react";
import { Settings as SettingsIcon, X, Sun, Moon } from "lucide-react";
import { usePrefs, type ClockTheme, type Background } from "@/lib/preferences";

const THEMES: { id: ClockTheme; label: string; desc: string }[] = [
  { id: "digital", label: "Digital", desc: "LED minimal" },
  { id: "analog", label: "Analog", desc: "Luxury watch" },
  { id: "vintage", label: "Vintage", desc: "Roman antique" },
  { id: "glass", label: "Glass", desc: "Frosted future" },
  { id: "trading", label: "Trading", desc: "Forex pro" },
];

const BGS: { id: Background; label: string; preview: string }[] = [
  { id: "black", label: "Pure Black", preview: "#000" },
  { id: "gradient", label: "Gradient Dark", preview: "linear-gradient(135deg,#1a2050,#0a0820)" },
  { id: "night", label: "Night Sky", preview: "linear-gradient(180deg,#050818,#1a1340)" },
  { id: "city", label: "City Lights", preview: "linear-gradient(180deg,#1a0f2e,#3a1840)" },
  { id: "candles", label: "Candlestick", preview: "linear-gradient(135deg,#1a2030,#0a1525)" },
  { id: "luxury", label: "Luxury", preview: "linear-gradient(135deg,#3a2818,#1a0f08)" },
  { id: "vintage", label: "Vintage", preview: "linear-gradient(135deg,#5a3a1a,#2a1808)" },
  { id: "neon", label: "Neon Future", preview: "linear-gradient(135deg,#3a0a4a,#0a1a3a)" },
];

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const { prefs, set } = usePrefs();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-40 w-11 h-11 rounded-full glass flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Open settings"
      >
        <SettingsIcon className="w-5 h-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <aside
            className="absolute right-0 top-0 bottom-0 w-full sm:w-[420px] overflow-y-auto p-6 glass border-l border-border"
            style={{ background: "oklch(0.12 0.02 250 / 0.85)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold tracking-tight">Customize</h2>
              <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-full hover:bg-white/5 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            <Section title="Clock Style">
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => set("theme", t.id)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      prefs.theme === t.id
                        ? "border-gold bg-gold/10"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <div className="text-sm font-medium">{t.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Background">
              <div className="grid grid-cols-2 gap-2">
                {BGS.map(b => (
                  <button
                    key={b.id}
                    onClick={() => set("background", b.id)}
                    className={`group relative h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      prefs.background === b.id ? "border-gold" : "border-transparent hover:border-foreground/30"
                    }`}
                    style={{ background: b.preview }}
                  >
                    <div className="absolute inset-x-0 bottom-0 text-[10px] uppercase tracking-widest font-mono text-white py-1 bg-black/40">
                      {b.label}
                    </div>
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Time Format">
              <div className="grid grid-cols-2 gap-2">
                {(["12h", "24h"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => set("format", f)}
                    className={`py-3 rounded-xl border font-mono text-sm ${
                      prefs.format === f ? "border-gold bg-gold/10 text-gold" : "border-border"
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Appearance">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => set("mode", "dark")}
                  className={`py-3 rounded-xl border flex items-center justify-center gap-2 ${
                    prefs.mode === "dark" ? "border-gold bg-gold/10 text-gold" : "border-border"
                  }`}
                >
                  <Moon className="w-4 h-4" /> Dark
                </button>
                <button
                  onClick={() => set("mode", "light")}
                  className={`py-3 rounded-xl border flex items-center justify-center gap-2 ${
                    prefs.mode === "light" ? "border-gold bg-gold/10 text-gold" : "border-border"
                  }`}
                >
                  <Sun className="w-4 h-4" /> Light
                </button>
              </div>
            </Section>

            <Section title={`Clock Size · ${Math.round(prefs.size * 100)}%`}>
              <input
                type="range"
                min={0.7} max={1.4} step={0.05}
                value={prefs.size}
                onChange={e => set("size", Number(e.target.value))}
                className="w-full accent-[var(--gold)]"
              />
            </Section>

            <Section title="Animations">
              <button
                onClick={() => set("animations", !prefs.animations)}
                className={`w-full py-3 rounded-xl border ${
                  prefs.animations ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground"
                }`}
              >
                {prefs.animations ? "Enabled" : "Disabled"}
              </button>
            </Section>

            <p className="mt-8 text-[11px] text-muted-foreground text-center">
              Preferences auto-save to this browser.
            </p>
          </aside>
        </div>
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">{title}</div>
      {children}
    </div>
  );
}
