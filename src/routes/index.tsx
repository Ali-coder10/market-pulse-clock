import { createFileRoute } from "@tanstack/react-router";
import { CandleBackground } from "@/components/CandleBackground";
import { ClockCard } from "@/components/ClockCard";
import { SessionsGrid } from "@/components/SessionsGrid";
import { Converter } from "@/components/Converter";
import { Overlaps } from "@/components/Overlaps";
import { WorldMap } from "@/components/WorldMap";
import { Ticker } from "@/components/Ticker";
import { useNow } from "@/hooks/use-now";
import { timeInTz } from "@/lib/sessions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Global Trading Clock — Real-Time Forex Session Tracker" },
      { name: "description", content: "Track UTC, London, New York, Tokyo & Sydney forex sessions in real-time. Live market clocks, session overlaps and timezone converter for traders." },
      { property: "og:title", content: "Global Trading Clock — Real-Time Forex Session Tracker" },
      { property: "og:description", content: "Live forex session clocks, market overlaps and timezone converter built for traders." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function localTz() {
  if (typeof window === "undefined") return "UTC";
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function Index() {
  const now = useNow();
  const utc = timeInTz(now, "UTC");

  return (
    <div className="min-h-screen text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center text-background font-bold text-sm">
              TC
            </div>
            <div>
              <div className="font-semibold tracking-tight leading-none">TraderClock</div>
              <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mt-0.5">Forex · Live</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#clocks" className="hover:text-foreground transition">Clocks</a>
            <a href="#sessions" className="hover:text-foreground transition">Sessions</a>
            <a href="#converter" className="hover:text-foreground transition">Converter</a>
            <a href="#overlaps" className="hover:text-foreground transition">Overlaps</a>
            <a href="#map" className="hover:text-foreground transition">World Map</a>
          </nav>
          <div className="font-mono text-sm text-gold tabular-nums hidden sm:block">
            {utc.h}:{utc.m}:{utc.s} <span className="text-muted-foreground text-xs">UTC</span>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden gradient-hero">
        <CandleBackground density={70} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-gold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse-dot" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-gold">Markets are live</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] max-w-4xl">
            Global Trading Clock —<br />
            <span className="text-gold">Track Market Time</span> in Real-Time
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Monitor UTC, London, New York and Asian market sessions instantly. Built for forex
            traders who need precision down to the second.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#clocks" className="group inline-flex items-center gap-2 gradient-gold text-background font-semibold px-6 py-3.5 rounded-xl glow-gold hover:scale-[1.02] transition-transform">
              Open Trading Clock
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <a href="#converter" className="inline-flex items-center gap-2 glass px-6 py-3.5 rounded-xl font-medium hover:border-gold/40 transition-colors">
              Timezone Converter
            </a>
          </div>

          {/* hero stat strip */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
            {[
              { k: "Sessions tracked", v: "4" },
              { k: "Update rate", v: "1s" },
              { k: "Timezones", v: "10+" },
              { k: "Latency", v: "<5ms" },
            ].map(s => (
              <div key={s.k} className="glass rounded-xl p-4">
                <div className="font-mono text-2xl text-gold">{s.v}</div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Ticker />

      {/* CLOCKS */}
      <section id="clocks" className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <SectionHead eyebrow="Live Clocks" title="Real-time market time, everywhere" subtitle="Five precision clocks updating every second across the world's major financial centers." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <ClockCard label="UTC" city="Coordinated Universal" tz="UTC" highlight="gold" badge="UTC+0" />
          <ClockCard label="Local" city={localTz().split("/").pop()?.replace(/_/g," ") || "Local"} tz={localTz()} highlight="neon" badge="You" />
          <ClockCard label="London" city="United Kingdom" tz="Europe/London" />
          <ClockCard label="New York" city="United States" tz="America/New_York" />
          <ClockCard label="Tokyo" city="Japan · Asian" tz="Asia/Tokyo" />
        </div>
      </section>

      {/* SESSIONS */}
      <section id="sessions" className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <SectionHead eyebrow="Trading Sessions" title="Open, closed, counting down" subtitle="Live status for the four major forex sessions, with countdowns to the next open or close." />
        <SessionsGrid />
      </section>

      {/* CONVERTER */}
      <section id="converter" className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <SectionHead eyebrow="Timezone Converter" title="Convert any time across markets" subtitle="Pick a time and a timezone. See the equivalent in every major trading center, instantly." />
        <Converter />
      </section>

      {/* OVERLAPS */}
      <section id="overlaps" className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <SectionHead eyebrow="Session Overlaps" title="Where the volume actually happens" subtitle="Overlap windows concentrate liquidity and tighten spreads. Live status updates with the market." />
        <Overlaps />
      </section>

      {/* WORLD MAP */}
      <section id="map" className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <SectionHead eyebrow="World Map" title="Trading centers, live" subtitle="A live view of the global trading day across major financial hubs." />
        <WorldMap />
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border mt-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg gradient-gold flex items-center justify-center text-background font-bold text-xs">TC</div>
            <span>TraderClock — Precision time for global markets.</span>
          </div>
          <div className="font-mono text-xs uppercase tracking-widest">
            UTC <span className="text-gold">{utc.h}:{utc.m}:{utc.s}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <div className="text-xs font-mono uppercase tracking-[0.3em] text-gold mb-3">— {eyebrow}</div>
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 text-muted-foreground leading-relaxed">{subtitle}</p>
    </div>
  );
}
