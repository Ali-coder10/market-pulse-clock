import { useNow, useMounted } from "@/hooks/use-now";
import { usePrefs } from "@/lib/preferences";
import { dateInTz } from "@/lib/sessions";

export function AnalogClock({ tz, label }: { tz: string; label: string }) {
  const now = useNow();
  const mounted = useMounted();
  const { prefs } = usePrefs();

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz, hour12: false,
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(now);
  const h = Number(parts.find(p => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find(p => p.type === "minute")?.value ?? 0);
  const s = Number(parts.find(p => p.type === "second")?.value ?? 0);

  const secAngle = s * 6;
  const minAngle = m * 6 + s * 0.1;
  const hourAngle = (h % 12) * 30 + m * 0.5;

  const size = 320 * prefs.size;
  const transition = prefs.animations ? "transform 0.5s cubic-bezier(0.4, 2.3, 0.3, 1)" : "none";

  return (
    <div className="flex flex-col items-center">
      <div className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground mb-6">{label}</div>
      <div
        className="relative rounded-full"
        style={{
          width: size, height: size,
          background: "radial-gradient(circle at 30% 25%, oklch(0.32 0.04 80), oklch(0.14 0.02 250) 75%)",
          boxShadow: "inset 0 0 30px oklch(0 0 0 / 0.6), 0 30px 80px -20px oklch(0 0 0 / 0.8), 0 0 0 8px oklch(0.82 0.17 90 / 0.15), 0 0 0 9px oklch(0.82 0.17 90 / 0.4)",
        }}
      >
        {/* Hour ticks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const isHour = i % 5 === 0;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-0"
              style={{
                width: isHour ? 3 : 1,
                height: isHour ? 14 : 6,
                background: isHour ? "oklch(0.82 0.17 90)" : "oklch(0.7 0.02 250 / 0.5)",
                transformOrigin: `50% ${size / 2}px`,
                transform: `translateX(-50%) rotate(${i * 6}deg)`,
                marginTop: 8,
              }}
            />
          );
        })}
        {/* Roman/numeric markers */}
        {[12, 3, 6, 9].map((n) => {
          const angle = ((n % 12) * 30 - 90) * Math.PI / 180;
          const r = size / 2 - 36;
          const x = Math.cos(angle) * r + size / 2;
          const y = Math.sin(angle) * r + size / 2;
          return (
            <div
              key={n}
              className="absolute font-display font-light"
              style={{
                left: x, top: y,
                transform: "translate(-50%, -50%)",
                color: "oklch(0.82 0.17 90)",
                fontSize: size * 0.09,
              }}
            >
              {n}
            </div>
          );
        })}

        {/* Hour hand */}
        <div
          className="absolute left-1/2 top-1/2 origin-bottom rounded-full"
          style={{
            width: 6, height: size * 0.27,
            background: "linear-gradient(to top, oklch(0.95 0.01 250), oklch(0.75 0.02 250))",
            transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
            transformOrigin: "50% 100%",
            transition,
            boxShadow: "0 2px 10px oklch(0 0 0 / 0.5)",
          }}
        />
        {/* Minute hand */}
        <div
          className="absolute left-1/2 top-1/2 origin-bottom rounded-full"
          style={{
            width: 4, height: size * 0.38,
            background: "linear-gradient(to top, oklch(0.95 0.01 250), oklch(0.82 0.17 90))",
            transform: `translate(-50%, -100%) rotate(${minAngle}deg)`,
            transformOrigin: "50% 100%",
            transition,
            boxShadow: "0 2px 10px oklch(0 0 0 / 0.5)",
          }}
        />
        {/* Second hand */}
        {mounted && (
          <div
            className="absolute left-1/2 top-1/2 origin-bottom"
            style={{
              width: 2, height: size * 0.43,
              background: "oklch(0.85 0.23 145)",
              transform: `translate(-50%, -100%) rotate(${secAngle}deg)`,
              transformOrigin: "50% 100%",
              transition,
            }}
          />
        )}
        {/* Center cap */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: 16, height: 16,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, oklch(0.85 0.23 145), oklch(0.6 0.18 145))",
            boxShadow: "0 0 12px oklch(0.85 0.23 145 / 0.6)",
          }}
        />
      </div>
      <div className="mt-8 text-sm text-muted-foreground font-mono">
        {mounted ? dateInTz(now, tz) : ""}
      </div>
    </div>
  );
}
