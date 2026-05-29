import { useNow } from "@/hooks/use-now";
import { SESSIONS, isSessionOpen } from "@/lib/sessions";

const OVERLAPS = [
  { a: "London", b: "New York", desc: "Highest liquidity of the day. Tightest spreads on EUR/USD, GBP/USD.", hours: "13:00 – 17:00 UTC" },
  { a: "Tokyo",  b: "London",   desc: "Asian-European bridge. Active on JPY and GBP pairs.",                hours: "08:00 – 09:00 UTC" },
  { a: "Sydney", b: "Tokyo",    desc: "Quiet Asian-Pacific overlap. Range-bound moves.",                    hours: "00:00 – 07:00 UTC" },
];

export function Overlaps() {
  const now = useNow();
  const openSet = new Set(SESSIONS.filter(s => isSessionOpen(s, now)).map(s => s.name));

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {OVERLAPS.map(o => {
        const live = openSet.has(o.a) && openSet.has(o.b);
        return (
          <div key={o.a + o.b} className={`relative rounded-2xl p-6 overflow-hidden transition-all ${
            live ? "glass-gold glow-gold" : "glass"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Overlap</div>
              <span className={`text-[10px] font-mono px-2 py-1 rounded-full ${
                live ? "bg-neon/20 text-neon" : "bg-foreground/5 text-muted-foreground"
              }`}>
                {live ? "● LIVE" : "OFFLINE"}
              </span>
            </div>
            <div className="text-2xl font-semibold mb-2">
              {o.a} <span className="text-gold">×</span> {o.b}
            </div>
            <div className="font-mono text-xs text-gold/80 mb-3">{o.hours}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{o.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
