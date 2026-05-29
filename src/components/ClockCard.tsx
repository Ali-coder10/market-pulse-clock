import { useNow } from "@/hooks/use-now";
import { timeInTz, dateInTz } from "@/lib/sessions";

interface Props {
  label: string;
  city: string;
  tz: string;
  highlight?: "gold" | "neon" | "default";
  badge?: string;
}

export function ClockCard({ label, city, tz, highlight = "default", badge }: Props) {
  const now = useNow();
  const { h, m, s } = timeInTz(now, tz);
  const date = dateInTz(now, tz);

  const accent =
    highlight === "gold" ? "text-gold" :
    highlight === "neon" ? "text-neon" : "text-foreground";

  const ring =
    highlight === "gold" ? "glass-gold" : "glass";

  return (
    <div className={`${ring} rounded-2xl p-6 relative overflow-hidden group transition-all hover:scale-[1.02]`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
          <div className="text-sm font-medium mt-1">{city}</div>
        </div>
        {badge && (
          <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-foreground/5 border border-border text-muted-foreground">
            {badge}
          </span>
        )}
      </div>

      <div className={`font-mono ${accent} text-4xl md:text-5xl font-light tabular-nums flex items-baseline gap-1`}>
        <span>{h}</span>
        <span className="opacity-40 animate-pulse">:</span>
        <span>{m}</span>
        <span className="text-2xl md:text-3xl opacity-50">:{s}</span>
      </div>

      <div className="mt-4 text-xs text-muted-foreground font-mono">{date}</div>

      {highlight !== "default" && (
        <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30 ${
          highlight === "gold" ? "bg-gold" : "bg-neon"
        }`} />
      )}
    </div>
  );
}
