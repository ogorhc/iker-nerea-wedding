import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ParallaxScrollIndicatorProps = {
  /** ref del section pinned del parallax */
  targetRef: React.RefObject<HTMLElement | null>;
  /** umbral (0..1) para ocultar cerca del final */
  hideAtProgress?: number;
  /** texto opcional */
  label?: string;
  /** clases extra */
  className?: string;
};

export function ParallaxScrollIndicator({
  targetRef,
  hideAtProgress = 0.98,
  label = "Desliza",
  className = "",
}: ParallaxScrollIndicatorProps) {
  const [visible, setVisible] = useState(true);
  const lastVisible = useRef(true);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    // Busca el ScrollTrigger que pinnea este section
    // (si solo hay uno, suele ser el correcto)
    const st =
      ScrollTrigger.getAll().find((t) => t.trigger === el) ??
      ScrollTrigger.getAll().find((t) => t.pin === el);

    if (!st) {
      // fallback: si no hay trigger, al menos no lo rompas
      setVisible(true);
      return;
    }

    const update = () => {
      const shouldShow = st.progress < hideAtProgress;
      if (shouldShow !== lastVisible.current) {
        lastVisible.current = shouldShow;
        setVisible(shouldShow);
      }
    };

    // actualiza en cada refresh/scroll
    const onRefresh = () => update();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    // tick barato, no re-renderiza continuamente si no cambia
    const ticker = () => update();
    gsap.ticker.add(ticker);

    update();

    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(ticker);
    };
  }, [targetRef, hideAtProgress]);

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none absolute left-8 bottom-28 -translate-x-1/2 z-[9999] lg:left-18 lg:bottom-20",
        "transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
        className,
      ].join(" ")}
    >
      <div className="flex flex-col items-center gap-1 sm:gap-2">
        {/* Mouse */}
        <div
          className="
          h-8 w-5 sm:h-12 sm:w-7
          rounded-[8px] sm:rounded-[11px]
          border border-foreground/80
          flex items-start justify-center
          p-[3px] sm:p-1
        "
        >
          <span className="block h-1.5 w-[2px] sm:h-2 bg-foreground/80 animate-scroll-dot" />
        </div>

        {/* Label */}
        {label ? (
          <span className="text-[10px] sm:text-xs tracking-widest uppercase text-foreground/80">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );

}
