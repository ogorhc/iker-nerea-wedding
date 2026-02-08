import React, { useEffect, useMemo, useRef } from "react";
import { weGetMarriedPhrases } from "@/data/weGetMarriedPhrases";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type Offset = { x: number; y: number };

function InverseHoverParallax({
  children,
  maxOffsetPx = 24,
  className = "",
  lerp = 0.12,
}: {
  children: (api: { offsetRef: React.MutableRefObject<Offset> }) => React.ReactNode;
  maxOffsetPx?: number;
  className?: string;
  lerp?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const targetRef = useRef<Offset>({ x: 0, y: 0 });
  const currentRef = useRef<Offset>({ x: 0, y: 0 });
  const offsetRef = currentRef;

  // Detectar si tiene “hover real” (mouse/trackpad). En móvil lo desactivamos.
  const canHoverRef = useRef<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined" && "matchMedia" in window) {
      canHoverRef.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    }
  }, []);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const t = targetRef.current;
      const c = currentRef.current;

      c.x += (t.x - c.x) * lerp;
      c.y += (t.y - c.y) * lerp;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [lerp]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHoverRef.current) return;

    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const nx = (e.clientX - cx) / (rect.width / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);

    const x = clamp(-nx * maxOffsetPx, -maxOffsetPx, maxOffsetPx);
    const y = clamp(-ny * maxOffsetPx, -maxOffsetPx, maxOffsetPx);

    targetRef.current = { x, y };
  };

  const onMouseLeave = () => {
    targetRef.current = { x: 0, y: 0 };
  };

  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className={className}>
      {children({ offsetRef })}
    </div>
  );
}

function ParallaxLayer({
  offsetRef,
  className,
  baseTransform = "translateX(-50%)",
  children,
}: {
  offsetRef: React.MutableRefObject<Offset>;
  className?: string;
  baseTransform?: string;
  children: React.ReactNode;
}) {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const el = layerRef.current;
      if (el) {
        const { x, y } = offsetRef.current;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) ${baseTransform}`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [offsetRef, baseTransform]);

  return (
    <div
      ref={layerRef}
      className={className}
      style={{ transform: `translate3d(0px, 0px, 0) ${baseTransform}` }}
    >
      {children}
    </div>
  );
}

export function HeroMarqueeWeGetMarried() {
  const repeatedPhrases = useMemo(
    () =>
      [
        ...weGetMarriedPhrases,
        ...weGetMarriedPhrases,
        ...weGetMarriedPhrases,
        ...weGetMarriedPhrases,
        ...weGetMarriedPhrases,
        ...weGetMarriedPhrases,
      ],
    []
  );

  return (
    <section className="min-h-screen w-full">
      <InverseHoverParallax
        // ✅ NO h-screen: min-height responsive y estable
        className="relative bg-foreground overflow-hidden min-h-[50vh] md:min-h-screen flex items-stretch justify-center"
        maxOffsetPx={28}
        lerp={0.1}
      >
        {({ offsetRef }) => (
          // ✅ el contenedor interno ahora ocupa todo el alto disponible
          <div className="relative w-full min-h-screen md:min-h-screen flex items-stretch">
            {/* Background */}
            <ParallaxLayer
              offsetRef={offsetRef}
              baseTransform="translateX(-50%)"
              className="
                absolute left-1/2 top-0 h-full
                w-[240%] sm:w-[220%] md:w-[200%]
                flex flex-wrap justify-center content-center
                gap-x-3 gap-y-1 sm:gap-x-5 sm:gap-y-2 md:gap-x-6 md:gap-y-2
                opacity-[0.12] py-4 sm:py-5 md:py-6
                pointer-events-none will-change-transform z-0
              "
              aria-hidden="true"
            >
              {repeatedPhrases.map((phrase, idx) => (
                <span
                  key={`${phrase}-${idx}`}
                  className="font-family-montserrat text-background whitespace-nowrap text-base sm:text-2xl md:text-4xl"
                >
                  {phrase}
                </span>
              ))}
            </ParallaxLayer>

            {/* ✅ Gradiente por encima del background */}
            <div
              className="absolute inset-0 pointer-events-none bg-linear-to-r from-foreground/90 via-foreground/0 to-foreground/90 z-10"
              aria-hidden="true"
            />

            {/* ✅ Marquee centrado SIEMPRE (capa completa) */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="w-full overflow-hidden">
                <div className="flex w-max animate-hero-marquee">
                  <span
                    className="
                      font-family-title font-normal text-background whitespace-nowrap pr-[1.5ch] shrink-0
                      text-[20rem] sm:text-[25rem] md:text-[30rem] lg:text-[35rem] xl:text-[40rem]
                      leading-none
                    "
                  >
                    Nerea & Iker
                  </span>
                  <span
                    className="
                      font-family-title font-normal text-background whitespace-nowrap pr-[1.5ch] shrink-0
                      text-[20rem] sm:text-[25rem] md:text-[30rem] lg:text-[35rem] xl:text-[40rem]
                      leading-none
                    "
                    aria-hidden="true"
                  >
                    Nerea & Iker
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}
      </InverseHoverParallax>
    </section>
  );
}
