import { useNow, useMounted } from "@/hooks/use-now";
import { usePrefs } from "@/lib/preferences";
import { dateInTz } from "@/lib/sessions";

export function DigitalClock({ tz, label }: { tz: string; label: string }) {
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
    <div className="relative flex flex-col items-center justify-center">
      <div className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground mb-6">{label}</div>
      <div
        className="font-mono font-extralight tabular-nums leading-none flex items-baseline gap-1 text-foreground"
        style={{
          fontSize: `clamp(3rem, ${14 * prefs.size}vw, ${9 * prefs.size}rem)`,
          textShadow: "0 0 40px oklch(0.82 0.17 90 / 0.35), 0 0 80px oklch(0.82 0.17 90 / 0.15)",
        }}
      >
        <span>{mounted ? get("hour") : "--"}</span>
        <span className={`opacity-50 ${prefs.animations ? "animate-pulse-dot" : ""}`}>:</span>
        <span>{mounted ? get("minute") : "--"}</span>
        <span className="text-[0.45em] opacity-60 ml-2">{mounted ? get("second") : "--"}</span>
        {ampm && <span className="text-[0.3em] opacity-50 ml-3 tracking-widest">{ampm}</span>}
      </div>
      <div className="mt-8 text-sm text-muted-foreground font-mono tracking-wide">
        {mounted ? dateInTz(now, tz) : ""}
      </div>
    </div>
  );
}
