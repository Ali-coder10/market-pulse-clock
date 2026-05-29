import { useNow, useMounted } from "@/hooks/use-now";
import { usePrefs } from "@/lib/preferences";
import { dateInTz } from "@/lib/sessions";

const ROMAN = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

export function VintageClock({ tz, label }: { tz: string; label: string }) {
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

  const size = 340 * prefs.size;
  const transition = prefs.animations ? "transform 0.4s ease-out" : "none";

  return (
    <div className="flex flex-col items-center">
      <div className="text-[11px] uppercase tracking-[0.4em] text-amber-700/80 dark:text-amber-500/70 mb-6 font-serif italic">{label}</div>
      <div
        className="relative rounded-full"
        style={{
          width: size, height: size,
          background: "radial-gradient(circle at 35% 30%, #f3e4c8, #d9bd8b 55%, #8b6a3a 100%)",
          boxShadow: `
            inset 0 0 40px rgba(80, 50, 20, 0.4),
            inset 0 0 0 12px #6b4a26,
            inset 0 0 0 14px #d4a056,
            inset 0 0 0 24px #4a3318,
            0 30px 60px -20px rgba(0,0,0,0.8)
          `,
        }}
      >
        {/* Roman numerals */}
        {ROMAN.map((roman, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const r = size / 2 - 50;
          const x = Math.cos(angle) * r + size / 2;
          const y = Math.sin(angle) * r + size / 2;
          return (
            <div
              key={i}
              className="absolute font-serif font-bold"
              style={{
                left: x, top: y,
                transform: "translate(-50%, -50%)",
                color: "#3a2410",
                fontSize: size * 0.075,
                textShadow: "1px 1px 0 rgba(255,220,170,0.4)",
              }}
            >
              {roman}
            </div>
          );
        })}

        {/* Minute ticks */}
        {Array.from({ length: 60 }).map((_, i) => i % 5 !== 0 && (
          <div
            key={i}
            className="absolute left-1/2 top-0"
            style={{
              width: 1, height: 5,
              background: "#5a3a1a",
              transformOrigin: `50% ${size / 2}px`,
              transform: `translateX(-50%) rotate(${i * 6}deg)`,
              marginTop: 28,
            }}
          />
        ))}

        {/* Hour hand - ornate */}
        <div
          className="absolute left-1/2 top-1/2 origin-bottom"
          style={{
            width: 8, height: size * 0.26,
            background: "linear-gradient(to top, #3a2410, #1a0f05 30%, #1a0f05)",
            clipPath: "polygon(50% 0, 100% 25%, 70% 100%, 30% 100%, 0 25%)",
            transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
            transformOrigin: "50% 100%",
            transition,
          }}
        />
        {/* Minute hand */}
        <div
          className="absolute left-1/2 top-1/2 origin-bottom"
          style={{
            width: 5, height: size * 0.38,
            background: "linear-gradient(to top, #3a2410, #1a0f05)",
            clipPath: "polygon(50% 0, 100% 15%, 70% 100%, 30% 100%, 0 15%)",
            transform: `translate(-50%, -100%) rotate(${minAngle}deg)`,
            transformOrigin: "50% 100%",
            transition,
          }}
        />
        {/* Second hand */}
        {mounted && (
          <div
            className="absolute left-1/2 top-1/2 origin-bottom"
            style={{
              width: 2, height: size * 0.42,
              background: "#8b1a1a",
              transform: `translate(-50%, -100%) rotate(${secAngle}deg)`,
              transformOrigin: "50% 100%",
              transition,
            }}
          />
        )}
        {/* Center */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: 18, height: 18,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, #d4a056, #6b4a26)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
          }}
        />
      </div>
      <div className="mt-8 text-sm font-serif italic text-amber-700/70">
        {mounted ? dateInTz(now, tz) : ""}
      </div>
    </div>
  );
}
