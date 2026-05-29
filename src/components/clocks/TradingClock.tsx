import { useNow, useMounted } from "@/hooks/use-now";
import { usePrefs } from "@/lib/preferences";
import { dateInTz, SESSIONS, isSessionOpen } from "@/lib/sessions";

export function TradingClock({ tz, label }: { tz: string; label: string }) {
  const now = useNow();
  const mounted = useMounted();
  const { prefs } = usePrefs();

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz, hour12: prefs.format === "12h",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(now);
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? "00";

  const openSessions = SESSIONS.filter(s => mounted && isSessionOpen(s, now));

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse-dot" />
        <div className="text-[11px] uppercase tracking-[0.4em] text-neon">{label} · Live</div>
      </div>

      <div
        className="relative rounded-2xl px-10 py-8 border border-gold/30"
        style={{
          background: "linear-gradient(180deg, oklch(0.18 0.03 250 / 0.6), oklch(0.12 0.02 250 / 0.8))",
          boxShadow: "0 0 60px -10px oklch(0.82 0.17 90 / 0.3), inset 0 1px 0 oklch(0.82 0.17 90 / 0.15)",
        }}
      >
        <div
          className="font-mono font-light tabular-nums flex items-baseline gap-1 text-gold"
          style={{
            fontSize: `clamp(3rem, ${9 * prefs.size}vw, ${8 * prefs.size}rem)`,
            textShadow: "0 0 30px oklch(0.82 0.17 90 / 0.6)",
          }}
        >
          <span>{mounted ? get("hour") : "--"}</span>
          <span className={`opacity-50 ${prefs.animations ? "animate-pulse-dot" : ""}`}>:</span>
          <span>{mounted ? get("minute") : "--"}</span>
          <span className="text-[0.45em] opacity-70 ml-2">{mounted ? get("second") : "--"}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {SESSIONS.map(s => {
            const open = openSessions.includes(s);
            return (
              <span
                key={s.name}
                className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded border ${
                  open
                    ? "bg-neon/15 text-neon border-neon/40"
                    : "bg-bear/10 text-bear/60 border-bear/20"
                }`}
              >
                {s.name}
              </span>
            );
          })}
        </div>
      </div>
      <div className="mt-6 text-sm text-muted-foreground font-mono">
        {mounted ? dateInTz(now, tz) : ""}
      </div>
    </div>
  );
}
