import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Backgrounds } from "@/components/Backgrounds";
import { SettingsPanel } from "@/components/SettingsPanel";
import { MainClock } from "@/components/clocks/MainClock";
import { SessionsGrid } from "@/components/SessionsGrid";
import { Converter } from "@/components/Converter";
import { useNow, useMounted } from "@/hooks/use-now";
import { usePrefs } from "@/lib/preferences";
import { dateInTz } from "@/lib/sessions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen Clock — Premium World Clock & Trading Time" },
      { name: "description", content: "Beautiful real-time world clock with digital, analog, vintage, glass and trading themes. Track UTC, London, New York and Tokyo sessions live." },
      { property: "og:title", content: "Lumen Clock — Premium World Clock" },
      { property: "og:description", content: "Premium clock app with multiple themes, custom backgrounds and live trading sessions." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

export function Index() {
  const mounted = useMounted();
  const localTz = useMemo(() =>
    (typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC"),
  []);
  const localCity = localTz.split("/").pop()?.replace(/_/g, " ") || "Local";

  return (
    <>
      <Backgrounds />
      <SettingsPanel />

      <main className="min-h-screen text-foreground">
        {/* HERO CLOCK */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-16 md:py-20 relative">
          <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-10 md:mb-12 font-mono">
            Lumen · Premium Clock
          </div>
          {mounted && <MainClock tz={localTz} label={localCity} />}
        </section>

        {/* WORLD CLOCKS */}
        <section id="world" className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20">
          <SectionHeader eyebrow="World Time" title="Five clocks. One glance." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 mt-10">
            <MiniClock label="UTC" tz="UTC" accent="gold" />
            <MiniClock label="Local" tz={localTz} accent="neon" />
            <MiniClock label="London" tz="Europe/London" />
            <MiniClock label="New York" tz="America/New_York" />
            <MiniClock label="Tokyo" tz="Asia/Tokyo" />
          </div>
        </section>

        {/* TRADING SESSIONS */}
        <section id="sessions" className="max-w-6xl mx-auto px-4 md:px-8 py-20">
          <SectionHeader
            eyebrow="Trading Sessions"
            title="Open, closed, counting down."
            subtitle="Live status of the four major forex sessions."
          />
          <div className="mt-10">
            <SessionsGrid />
          </div>
        </section>

        {/* CONVERTER */}
        <section id="converter" className="max-w-6xl mx-auto px-4 md:px-8 py-20">
          <SectionHeader
            eyebrow="Timezone Converter"
            title="Any time. Anywhere."
            subtitle="Pick a time and zone. See the equivalent across every major market."
          />
          <div className="mt-10">
            <Converter />
          </div>
        </section>

        <footer className="text-center py-10 text-xs text-muted-foreground font-mono uppercase tracking-[0.3em]">
          Lumen Clock · Precision Time
        </footer>
      </main>
    </>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="text-[10px] uppercase tracking-[0.4em] text-gold font-mono mb-4">— {eyebrow} —</div>
      <h2 className="text-3xl md:text-5xl font-light tracking-tight">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function MiniClock({ label, tz, accent }: { label: string; tz: string; accent?: "gold" | "neon" }) {
  const now = useNow();
  const mounted = useMounted();
  const { prefs } = usePrefs();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz, hour12: prefs.format === "12h",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(now);
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? "--";

  const color = accent === "gold" ? "text-gold" : accent === "neon" ? "text-neon" : "text-foreground";

  return (
    <div className="glass rounded-2xl p-3 md:p-5 transition-transform hover:scale-[1.03]">
      <div className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2 md:mb-3 truncate">{label}</div>
      <div className={`font-mono text-base sm:text-xl md:text-3xl tabular-nums font-light ${color}`}>
        {mounted ? get("hour") : "--"}<span className="opacity-40">:</span>{mounted ? get("minute") : "--"}
        <span className="text-[0.6em] opacity-60 ml-0.5">:{mounted ? get("second") : "--"}</span>
      </div>
      <div className="text-[8px] md:text-[10px] text-muted-foreground font-mono mt-2 md:mt-3 truncate">
        {mounted ? dateInTz(now, tz) : ""}
      </div>
    </div>
  );
}
