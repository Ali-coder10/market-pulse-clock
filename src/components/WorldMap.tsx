import { useNow } from "@/hooks/use-now";
import { timeInTz } from "@/lib/sessions";

// Approx coords mapped to a 1000x500 viewBox (equirectangular-ish)
const CITIES = [
  { name: "London",   tz: "Europe/London",    x: 500, y: 160 },
  { name: "New York", tz: "America/New_York", x: 280, y: 200 },
  { name: "Tokyo",    tz: "Asia/Tokyo",       x: 820, y: 220 },
  { name: "Dubai",    tz: "Asia/Dubai",       x: 620, y: 240 },
  { name: "Sydney",   tz: "Australia/Sydney", x: 870, y: 370 },
  { name: "Frankfurt",tz: "Europe/Berlin",    x: 520, y: 165 },
  { name: "Hong Kong",tz: "Asia/Hong_Kong",   x: 790, y: 250 },
];

export function WorldMap() {
  const now = useNow();
  return (
    <div className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: "2 / 1" }}>
        <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full">
          <defs>
            <radialGradient id="globe" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="oklch(0.28 0.06 250)" />
              <stop offset="100%" stopColor="oklch(0.16 0.03 250)" />
            </radialGradient>
            <pattern id="dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="oklch(0.7 0.05 250 / 0.18)" />
            </pattern>
          </defs>
          <rect width="1000" height="500" fill="url(#globe)" />
          <rect width="1000" height="500" fill="url(#dots)" />

          {/* connection arcs between major hubs */}
          {[
            ["London", "New York"], ["London", "Tokyo"], ["New York", "Tokyo"],
            ["London", "Dubai"], ["Tokyo", "Sydney"], ["Dubai", "Hong Kong"],
          ].map(([a, b]) => {
            const ca = CITIES.find(c => c.name === a)!;
            const cb = CITIES.find(c => c.name === b)!;
            const mx = (ca.x + cb.x) / 2;
            const my = Math.min(ca.y, cb.y) - 60;
            return (
              <path key={a+b}
                d={`M${ca.x} ${ca.y} Q ${mx} ${my} ${cb.x} ${cb.y}`}
                fill="none" stroke="oklch(0.82 0.17 90 / 0.25)" strokeWidth="1" strokeDasharray="3 4" />
            );
          })}

          {CITIES.map(c => {
            const t = timeInTz(now, c.tz);
            return (
              <g key={c.name}>
                <circle cx={c.x} cy={c.y} r="14" fill="oklch(0.82 0.17 90 / 0.15)">
                  <animate attributeName="r" values="10;18;10" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx={c.x} cy={c.y} r="4" fill="oklch(0.82 0.17 90)" />
                <text x={c.x + 12} y={c.y - 6} fill="oklch(0.96 0.01 250)" fontSize="13" fontWeight="600">{c.name}</text>
                <text x={c.x + 12} y={c.y + 12} fill="oklch(0.85 0.23 145)" fontSize="13" fontFamily="ui-monospace, monospace">
                  {t.h}:{t.m}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
