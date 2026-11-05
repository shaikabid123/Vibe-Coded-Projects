import { useMemo } from "react";

/**
 * Animated gradient mesh + floating particles background.
 * Purely decorative — pointer-events disabled.
 */
export function AnimatedBackground({ particles = 18 }: { particles?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: particles }).map((_, i) => ({
        left: `${(i * 37) % 100}%`,
        size: 4 + ((i * 7) % 10),
        delay: `${(i % 6) * 1.4}s`,
        duration: `${10 + (i % 5) * 4}s`,
      })),
    [particles],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-1/4 -top-1/4 h-[60vw] w-[60vw] rounded-full gradient-primary opacity-30 blur-3xl animate-mesh" />
      <div
        className="absolute -right-1/4 top-0 h-[55vw] w-[55vw] rounded-full gradient-vibrant opacity-25 blur-3xl animate-mesh"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[45vw] w-[45vw] rounded-full gradient-emerald opacity-20 blur-3xl animate-mesh"
        style={{ animationDelay: "-12s" }}
      />
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full bg-primary/30 animate-particle"
          style={{
            left: d.left,
            width: d.size,
            height: d.size,
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
        />
      ))}
    </div>
  );
}
