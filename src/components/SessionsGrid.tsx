import { useNow } from "@/hooks/use-now";
import { SESSIONS, isSessionOpen, nextEvent } from "@/lib/sessions";

const pad = (n: number) => n.toString().padStart(2, "0");

export function SessionsGrid() {
  const now = useNow();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {SESSIONS.map(s => {
        const open = isSessionOpen(s, now);
        const ev = nextEvent(s, now);
        return (
          <div key={s.name} className="glass rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Session</div>
                <div className="text-lg font-semibold mt-0.5">{s.name}</div>
              </div>
              <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider
                ${open ? "bg-neon/15 text-neon" : "bg-bear/15 text-bear"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${open ? "bg-neon animate-pulse-dot" : "bg-bear"}`} />
                {open ? "Open" : "Closed"}
              </div>
            </div>

            <div className="font-mono text-sm text-muted-foreground space-y-1 mb-4">
              <div className="flex justify-between"><span>Opens</span><span className="text-foreground">{pad(s.openUTC)}:00 UTC</span></div>
              <div className="flex justify-between"><span>Closes</span><span className="text-foreground">{pad(s.closeUTC)}:00 UTC</span></div>
            </div>

            <div className="pt-3 border-t border-border">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{ev.label}</div>
              <div className="font-mono text-2xl tabular-nums">
                {pad(ev.h)}<span className="opacity-40">h </span>
                {pad(ev.m)}<span className="opacity-40">m </span>
                {pad(ev.s)}<span className="opacity-40">s</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
