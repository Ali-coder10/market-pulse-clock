import { useNow } from "@/hooks/use-now";
import { SESSIONS, isSessionOpen, timeInTz } from "@/lib/sessions";

export function Ticker() {
  const now = useNow();
  const items = SESSIONS.map(s => {
    const open = isSessionOpen(s, now);
    const t = timeInTz(now, s.tz);
    return { name: s.name, time: `${t.h}:${t.m}`, open };
  });

  const row = (
    <div className="flex items-center gap-10 px-6 shrink-0">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2 font-mono text-sm whitespace-nowrap">
          <span className={`w-1.5 h-1.5 rounded-full ${it.open ? "bg-neon" : "bg-bear"}`} />
          <span className="text-muted-foreground uppercase tracking-wider text-xs">{it.name}</span>
          <span className="text-foreground tabular-nums">{it.time}</span>
          <span className={`text-[10px] uppercase ${it.open ? "text-neon" : "text-bear"}`}>
            {it.open ? "Open" : "Closed"}
          </span>
        </div>
      ))}
      <span className="text-gold font-mono text-xs uppercase tracking-[0.3em]">Live · Forex Sessions</span>
    </div>
  );

  return (
    <div className="relative border-y border-border bg-background/60 backdrop-blur overflow-hidden py-3">
      <div className="flex animate-ticker w-max">
        {row}{row}{row}{row}
      </div>
    </div>
  );
}
