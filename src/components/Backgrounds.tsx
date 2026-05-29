import { useEffect, useRef } from "react";
import { usePrefs } from "@/lib/preferences";
import { CandleBackground } from "./CandleBackground";

function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * cv.width, y: Math.random() * cv.height,
      r: Math.random() * 1.3, a: Math.random(), s: Math.random() * 0.02 + 0.005,
    }));
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      stars.forEach(s => {
        s.a += s.s; if (s.a > 1 || s.a < 0) s.s *= -1;
        ctx.fillStyle = `rgba(255,255,255,${Math.abs(s.a) * 0.8})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

export function Backgrounds() {
  const { prefs } = usePrefs();
  const bg = prefs.background;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden transition-opacity duration-700">
      {bg === "black" && <div className="absolute inset-0 bg-black" />}

      {bg === "gradient" && (
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at top, oklch(0.28 0.08 260), oklch(0.12 0.02 250) 60%), linear-gradient(180deg, oklch(0.16 0.03 250), oklch(0.08 0.02 250))",
          }}
        />
      )}

      {bg === "night" && (
        <>
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, #050818 0%, #0a0f2a 50%, #1a1340 100%)" }}
          />
          {prefs.animations && <StarField />}
          <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
        </>
      )}

      {bg === "city" && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, #0a0a18 0%, #1a0f2e 50%, #3a1840 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: `
                radial-gradient(circle at 10% 80%, oklch(0.7 0.2 30 / 0.4), transparent 30%),
                radial-gradient(circle at 80% 70%, oklch(0.7 0.2 280 / 0.5), transparent 30%),
                radial-gradient(circle at 50% 90%, oklch(0.7 0.2 200 / 0.4), transparent 35%)
              `,
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-2/5"
            style={{
              background: `
                linear-gradient(to top, #000 30%, transparent),
                repeating-linear-gradient(90deg, transparent 0 30px, rgba(255,200,100,0.06) 30px 32px, transparent 32px 60px)
              `,
            }}
          />
        </>
      )}

      {bg === "candles" && (
        <>
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, oklch(0.14 0.02 250), oklch(0.1 0.02 250))" }}
          />
          {prefs.animations && <CandleBackground density={80} />}
        </>
      )}

      {bg === "luxury" && (
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, oklch(0.4 0.08 80 / 0.4), transparent 50%),
              radial-gradient(ellipse at 70% 80%, oklch(0.35 0.05 30 / 0.3), transparent 50%),
              linear-gradient(135deg, #1a1410 0%, #0a0805 100%)
            `,
          }}
        />
      )}

      {bg === "vintage" && (
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at center, #3a2818, #1a0f08 80%),
              repeating-linear-gradient(45deg, transparent 0 8px, rgba(120,80,40,0.06) 8px 9px)
            `,
          }}
        />
      )}

      {bg === "neon" && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, oklch(0.65 0.3 320 / 0.45), transparent 40%),
                radial-gradient(circle at 80% 70%, oklch(0.65 0.3 200 / 0.45), transparent 40%),
                linear-gradient(135deg, #0a0118 0%, #18012a 100%)
              `,
            }}
          />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,0,200,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,200,255,0.15) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              maskImage: "radial-gradient(ellipse at center, black, transparent 70%)",
            }}
          />
        </>
      )}
    </div>
  );
}
