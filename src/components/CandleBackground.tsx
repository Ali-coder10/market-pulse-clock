import { useEffect, useMemo, useRef } from "react";

// Animated candlestick background
export function CandleBackground({ density = 60 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  const candles = useMemo(() => {
    let price = 100;
    return Array.from({ length: density }, () => {
      const open = price;
      const change = (Math.random() - 0.48) * 8;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;
      price = close;
      return { open, close, high, low };
    });
  }, [density]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let offset = 0;

    const resize = () => {
      cv.width = cv.offsetWidth * devicePixelRatio;
      cv.height = cv.offsetHeight * devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = cv.width, h = cv.height;
      ctx.clearRect(0, 0, w, h);

      const prices = candles.flatMap(c => [c.high, c.low]);
      const min = Math.min(...prices), max = Math.max(...prices);
      const range = max - min || 1;
      const candleW = w / density;

      offset += 0.15;

      candles.forEach((c, i) => {
        const x = ((i * candleW) - (offset % candleW));
        const y = (v: number) => h - ((v - min) / range) * h * 0.85 - h * 0.05;
        const bull = c.close >= c.open;
        const color = bull ? "rgba(132, 240, 160, 0.55)" : "rgba(240, 100, 90, 0.45)";
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1 * devicePixelRatio;

        // wick
        ctx.beginPath();
        ctx.moveTo(x + candleW / 2, y(c.high));
        ctx.lineTo(x + candleW / 2, y(c.low));
        ctx.stroke();

        // body
        const bodyTop = y(Math.max(c.open, c.close));
        const bodyBot = y(Math.min(c.open, c.close));
        ctx.fillRect(x + candleW * 0.2, bodyTop, candleW * 0.6, Math.max(1, bodyBot - bodyTop));
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [candles, density]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full opacity-[0.18] pointer-events-none"
      aria-hidden
    />
  );
}
