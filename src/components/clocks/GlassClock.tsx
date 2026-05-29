import { useNow, useMounted } from "@/hooks/use-now";
import { usePrefs } from "@/lib/preferences";
import { dateInTz } from "@/lib/sessions";

export function GlassClock({ tz, label }: { tz: string; label: string }) {
  const now = useNow();
  const mounted = useMounted();
  const { prefs } = usePrefs();

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz, hour12: prefs.format === "12h",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(now);
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? "00";
  const ampm = prefs.format === "12h" ? parts.find(p => p.type === "dayPeriod")?.value : "";

  return (
    <div className="flex flex-col items-center">
      <div className="text-[11px] uppercase tracking-[0.4em] text-foreground/60 mb-6">{label}</div>
      <div
        className="relative rounded-3xl px-12 py-10 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
          backdropFilter: "blur(40px) saturate(1.5)",
          WebkitBackdropFilter: "blur(40px) saturate(1.5)",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        <div
          className="absolute -top-20 -left-20 w-60 h-60 rounded-full blur-3xl opacity-50"
          style={{ background: "oklch(0.82 0.17 90)" }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-40"
          style={{ background: "oklch(0.7 0.2 280)" }}
        />

        <div
          className="relative font-display font-thin tabular-nums flex items-baseline gap-1 text-foreground"
          style={{ fontSize: `clamp(3rem, ${9 * prefs.size}vw, ${8 * prefs.size}rem)` }}
        >
          <span>{mounted ? get("hour") : "--"}</span>
          <span className={`opacity-60 ${prefs.animations ? "animate-pulse-dot" : ""}`}>:</span>
          <span>{mounted ? get("minute") : "--"}</span>
          <span className="text-[0.4em] opacity-60 ml-2">{mounted ? get("second") : "--"}</span>
          {ampm && <span className="text-[0.3em] opacity-60 ml-2">{ampm}</span>}
        </div>
      </div>
      <div className="mt-6 text-sm text-foreground/60 font-light tracking-wide">
        {mounted ? dateInTz(now, tz) : ""}
      </div>
    </div>
  );
}
