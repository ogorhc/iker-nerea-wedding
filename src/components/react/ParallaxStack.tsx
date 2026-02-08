import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUIStore } from "@/stores/uiStore";
import { ParallaxScrollIndicator } from "./components/ParallaxScrollIndicator";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Reduce “saltos” al cambiar el viewport en móvil (barra del navegador, etc.)
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export interface ParallaxLayer {
  id: string;
  srcDesktop: string;
  srcMobile: string;
  alt: string;
  zIndex: number;
  movementDesktop: number;
  movementMobile?: number;
  objectPositionDesktop?: string;
  objectPositionMobile?: string;
  initialOffsetY?: number;
}

const layers: ParallaxLayer[] = [
  {
    id: "front",
    srcDesktop: "/parallax/desktop/front.webp",
    srcMobile: "/parallax/mobile/front.webp",
    alt: "Front",
    zIndex: 1,
    movementDesktop: 50,
    movementMobile: 30,
    objectPositionDesktop: "center bottom",
    objectPositionMobile: "center bottom",
  },
  {
    id: "birds",
    srcDesktop: "/parallax/desktop/birds.webp",
    srcMobile: "/parallax/mobile/birds.webp",
    alt: "Birds",
    zIndex: 2,
    movementDesktop: 350,
    movementMobile: 220,
    objectPositionDesktop: "center bottom",
    objectPositionMobile: "center bottom",
  },
  {
    id: "water",
    srcDesktop: "/parallax/desktop/water.webp",
    srcMobile: "/parallax/mobile/water.webp",
    alt: "Water",
    zIndex: 3,
    movementDesktop: 200,
    movementMobile: 140,
    objectPositionDesktop: "center bottom",
    objectPositionMobile: "center bottom",
  },
  {
    id: "camp",
    srcDesktop: "/parallax/desktop/camp.webp",
    srcMobile: "/parallax/mobile/camp.webp",
    alt: "Camp",
    zIndex: 4,
    movementDesktop: 200,
    movementMobile: 140,
    objectPositionDesktop: "center bottom",
    objectPositionMobile: "center bottom",
  },
  {
    id: "montain",
    srcDesktop: "/parallax/desktop/montain.webp",
    srcMobile: "/parallax/mobile/montain.webp",
    alt: "Mountain",
    zIndex: 5,
    movementDesktop: 250,
    movementMobile: 160,
    objectPositionDesktop: "center bottom",
    objectPositionMobile: "center bottom",
  },
  {
    id: "sun",
    srcDesktop: "/parallax/desktop/sun.webp",
    srcMobile: "/parallax/mobile/sun.webp",
    alt: "Sun",
    zIndex: 6,
    movementDesktop: 350,
    movementMobile: 220,
    objectPositionDesktop: "center 50%",
    objectPositionMobile: "center 55%",
  },
  {
    id: "clouds",
    srcDesktop: "/parallax/desktop/clouds.webp",
    srcMobile: "/parallax/mobile/clouds.webp",
    alt: "Clouds",
    zIndex: 7,
    movementDesktop: 100,
    objectPositionDesktop: "center top",
    objectPositionMobile: "center top",
  },
  {
    id: "stars",
    srcDesktop: "/parallax/desktop/stars.webp",
    srcMobile: "/parallax/mobile/stars.webp",
    alt: "Stars",
    zIndex: 8,
    movementDesktop: 150,
    movementMobile: 150,
    objectPositionDesktop: "center top",
    objectPositionMobile: "center top",
  },
];

interface ParallaxStackProps {
  pinDuration?: number;
}

export const ParallaxStack = ({ pinDuration = 3500 }: ParallaxStackProps) => {
  const parallaxRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<(HTMLImageElement | null)[]>([]);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const { maxZ, cssZById } = useMemo(() => {
    const zValues = layers.map((l) => l.zIndex);
    const maxZ = Math.max(...zValues);
    const cssZById = new Map<string, number>();
    layers.forEach((l) => {
      cssZById.set(l.id, maxZ - l.zIndex + 1);
    });
    return { maxZ, cssZById };
  }, []);

  // ✅ Congelar la altura del “viewport usable” en una CSS var para evitar saltos con la barra de Android
  useEffect(() => {
    if (typeof window === "undefined") return;

    const setVh = () => {
      document.documentElement.style.setProperty("--vhpx", `${window.innerHeight}px`);
    };

    setVh();

    // Solo en resize/orientación (no durante scroll)
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);

    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);

  useEffect(() => {
    const container = parallaxRef.current;
    if (!container) return;

    const setBgStop = gsap.quickSetter(container, "--bgStop", "%") as (v: number) => void;

    const imgs = layerRefs.current.filter(Boolean) as HTMLImageElement[];
    const setParallaxLoaded = useUIStore.getState().setParallaxLoaded;

    let loadedCount = imgs.filter((img) => img.complete).length;
    const onImgLoad = () => {
      loadedCount += 1;
      // Refresh tras cargar assets (OK)
      ScrollTrigger.refresh();
      if (loadedCount >= imgs.length) setParallaxLoaded(true);
    };

    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", onImgLoad, { once: true });
    });
    if (imgs.length === 0 || loadedCount >= imgs.length) setParallaxLoaded(true);

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // base: initial offsets (stars, etc.)
      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        const offset = layers[i]?.initialOffsetY ?? 0;
        if (offset) gsap.set(el, { y: offset });
      });

      mm.add(
        {
          isMobile: "(max-width: 768px)",
          isDesktop: "(min-width: 769px)",
        },
        (context) => {
          const isMobile = !!context.conditions?.isMobile;

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: `+=${pinDuration}`,
              scrub: 0.6,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              fastScrollEnd: true,
              onUpdate: (self) => {
                setBgStop(Math.ceil(self.progress * 100 + 20));
              },
            },
          });

          gsap.set(
            [backgroundRef.current, textRef.current, ...layerRefs.current.filter(Boolean)],
            { willChange: "transform", force3D: true }
          );

          layerRefs.current.forEach((el, i) => {
            if (!el) return;
            const layer = layers[i];
            const isBirds = layer.id === "birds";
            const isFront = layer.zIndex === 1;

            const movement = isMobile ? (layer.movementMobile ?? layer.movementDesktop) : layer.movementDesktop;
            if (!movement) return;

            if (isBirds) {
              tl.to(el, { x: `-=${movement}`, y: `-=${movement / 2}` }, 0);
            } else {
              tl.to(el, { y: isFront ? `-=${movement}` : `+=${movement}` }, 0);
            }
          });

          if (backgroundRef.current) tl.to(backgroundRef.current, { y: `-=80` }, 0);
          if (textRef.current) tl.to(textRef.current, { y: isMobile ? `+=220` : `+=350` }, 0);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }
      );
    }, container);

    // ✅ Android bar: durante scroll cambia innerHeight -> dispara resize.
    // Queremos mantener el ANCHO constante y evitar refresh por cambios SOLO de alto.
    let lastW = typeof window !== "undefined" ? window.innerWidth : 0;

    const onResize = () => {
      if (typeof window === "undefined") return;

      // refrescar solo si cambia ancho (rotación / breakpoint real)
      if (window.innerWidth !== lastW) {
        lastW = window.innerWidth;
        ScrollTrigger.refresh();
      }
    };

    const onOrientation = () => {
      if (typeof window === "undefined") return;
      lastW = window.innerWidth;
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientation);

    // Primer refresh tras montar
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientation);
      imgs.forEach((img) => img.removeEventListener("load", onImgLoad));
      mm.revert();
      ctx.revert();
    };
  }, [pinDuration]);

  return (
    <div className="overflow-hidden">
      <section
        ref={parallaxRef}
        className="relative w-full overflow-hidden"
        style={{
          // ✅ alto estable (evita saltos por barra Android); el ancho queda constante
          height: "var(--vhpx, 100vh)",
          ["--bgStop" as any]: 50,
          background: "linear-gradient(#00292b var(--bgStop), #d1fdff)",
        }}
      >
        {layers.map((layer, index) => {
          const zIndex = cssZById.get(layer.id) ?? 1;
          const posDesktop = layer.objectPositionDesktop ?? "center bottom";
          const posMobile = layer.objectPositionMobile ?? posDesktop;

          return (
            <picture key={layer.id}>
              <source media="(max-width: 768px)" srcSet={layer.srcMobile} />
              <img
                ref={(el) => {
                  layerRefs.current[index] = el;
                }}
                src={layer.srcDesktop}
                alt={layer.alt}
                loading={index === 0 ? "eager" : "lazy"}
                className="absolute inset-0 w-full h-full min-w-full min-h-full select-none pointer-events-none"
                style={{
                  zIndex,
                  objectFit: "cover",
                  objectPosition: posDesktop,
                }}
                data-pos-mobile={posMobile}
                draggable={false}
              />
            </picture>
          );
        })}

        {/* Texto ABSOLUTO para no romper el pin */}
        <h1
          ref={textRef}
          className="
            absolute inset-x-0 top-10 sm:top-16
            text-nav-background font-title
            flex items-center justify-center
            text-3xl sm:text-7xl lg:text-9xl
            gap-4 sm:gap-6
            pointer-events-none
          "
          style={{
            zIndex: (() => {
              const mountainZ = layers.find((l) => l.id === "mountain")?.zIndex ?? 5;
              return maxZ - mountainZ;
            })(),
          }}
        >
          <span>Nerea</span>
          <span className="text-xl sm:text-5xl">&</span>
          <span>Iker</span>
        </h1>

        <div
          ref={backgroundRef}
          className="absolute left-0 w-full"
          style={{
            backgroundColor: "#e1eacd",
            zIndex: (() => {
              const first = layers.find((l) => l.zIndex === 1)?.zIndex ?? 1;
              return maxZ - first + 1;
            })(),
            top: "100%",
            height: "200vh",
          }}
        />

        {parallaxRef.current && <ParallaxScrollIndicator targetRef={parallaxRef} label="Desliza" />}
      </section>
    </div>
  );
};
