import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useUIStore } from '@/stores/uiStore';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  // Reduce “saltos” al cambiar el viewport en móvil (barra del navegador, etc.)
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export interface ParallaxLayer {
  id: string;
  src: string;
  alt: string;
  zIndex?: number;
  movementAmount?: number;
  objectPosition?: string; // opcional para controlar el encuadre por capa en móvil
}

const layers: ParallaxLayer[] = [
  { id: 'front', src: '/parallax/front.webp', alt: 'Front', zIndex: 1, movementAmount: 50, objectPosition: 'center bottom' },
  { id: 'birds', src: '/parallax/birds.webp', alt: 'Birds', zIndex: 2, movementAmount: 350, objectPosition: 'center center' },
  { id: 'water', src: '/parallax/water.webp', alt: 'Water', zIndex: 3, movementAmount: 200, objectPosition: 'center bottom' },
  { id: 'camp', src: '/parallax/camp.webp', alt: 'Camp', zIndex: 4, movementAmount: 200, objectPosition: 'center bottom' },
  { id: 'mountain', src: '/parallax/mountain.webp', alt: 'Mountain', zIndex: 5, movementAmount: 250, objectPosition: 'center bottom' },
  { id: 'sun', src: '/parallax/sun.webp', alt: 'Sun', zIndex: 6, movementAmount: 350, objectPosition: 'center 50%', },
  { id: 'clouds', src: '/parallax/clouds.webp', alt: 'Clouds', zIndex: 7, movementAmount: 0, objectPosition: 'center top' },
  { id: 'stars', src: '/parallax/stars.webp', alt: 'Stars', zIndex: 7, movementAmount: 0, objectPosition: 'center top' },
];

interface ParallaxStackProps {
  pinDuration?: number; // px de scroll fijado
}

export const ParallaxStack = ({ pinDuration = 5000 }: ParallaxStackProps) => {
  const [background, setBackground] = useState<number>(50);
  const parallaxRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<(HTMLImageElement | null)[]>([]);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const { maxZ, cssZById } = useMemo(() => {
    const zValues = layers.map((l, i) => l.zIndex ?? i + 1);
    const maxZ = Math.max(...zValues);
    const cssZById = new Map<string, number>();
    layers.forEach((l, i) => {
      const z = l.zIndex ?? i + 1;
      // invertimos: zIndex 1 (frente) = css z-index más alto
      cssZById.set(l.id, maxZ - z + 1);
    });
    return { maxZ, cssZById };
  }, []);

  useEffect(() => {
    const container = parallaxRef.current;
    if (!container) return;

    // Setter rápido para no re-renderizar React en cada tick
    const setBgStop = gsap.quickSetter(container, '--bgStop', '%') as (v: number) => void;

    // Esperar a que todas las imágenes tengan dimensiones; luego ScrollTrigger.refresh y store (loader)
    const imgs = layerRefs.current.filter(Boolean) as HTMLImageElement[];
    const setParallaxLoaded = useUIStore.getState().setParallaxLoaded;
    let loadedCount = imgs.filter((img) => img.complete).length;

    const refreshOnLoad = () => {
      ScrollTrigger.refresh();
      loadedCount += 1;
      if (loadedCount >= imgs.length) setParallaxLoaded(true);
    };

    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', refreshOnLoad, { once: true });
    });

    if (imgs.length === 0 || loadedCount >= imgs.length) setParallaxLoaded(true);

    const ctx = gsap.context(() => {
      // Limpieza por si hay hot reload / rehidratación
      ScrollTrigger.getAll().forEach((t) => {
        // Evita matar triggers ajenos si reutilizas GSAP en la página:
        // solo mataremos los que cuelgan del contenedor mediante contexto, así que no es necesario aquí.
      });

      // Usa timeline con ScrollTrigger “amable” en móvil
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${pinDuration}`, // más fiable que `${pinDuration} bottom`
          scrub: 0.6, // numérico suele ir más suave en móvil que true
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          onUpdate: (self) => {
            // 20%..120% aprox (tu lógica original)
            const v = Math.ceil(self.progress * 100 + 20);
            setBgStop(v);
            setBackground(Math.ceil(self.progress * 100 + 5))
          },
        },
      });

      // Asegurar que todo anima con transform (GPU friendly)
      gsap.set(
        [backgroundRef.current, textRef.current, ...layerRefs.current.filter(Boolean)],
        { willChange: 'transform', force3D: true },
      );

      layerRefs.current.forEach((layerEl, index) => {
        if (!layerEl) return;
        const layerData = layers[index];
        const movementAmount = layerData.movementAmount ?? 0;
        const isStars = layerData.id === 'stars';
        const isFrontLayer = index === 0 || layerData.zIndex === 1;

        if (isStars) {
          // estrellas: bajan para “entrar”
          tl.to(layerEl, { y: `+=550` }, 0);
          return;
        }

        if (!movementAmount) return;

        if (isFrontLayer) {
          tl.to(layerEl, { y: `-=${movementAmount}` }, 0);
        } else {
          tl.to(layerEl, { y: `+=${movementAmount}` }, 0);
        }
      });

      if (backgroundRef.current) {
        tl.to(backgroundRef.current, { y: `-=80` }, 0);
      }

      if (textRef.current) {
        tl.to(textRef.current, { y: `+=350` }, 0);
      }
    }, container);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    // Primer refresh (por si Astro hidrata cuando ya hay layout)
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      imgs.forEach((img) => img.removeEventListener('load', refreshOnLoad));
      ctx.revert();
    };
  }, [pinDuration]);

  return (
    <div className="overflow-hidden">
      <section
        ref={parallaxRef}
        className="
          relative w-full overflow-hidden
          min-h-svh h-[110svh]
        "
        style={{
          background: `linear-gradient(#00292b ${background}%, #d1fdff )`,
        }}
      >
        {layers.map((layer, index) => {
          const isStars = layer.id === 'stars';
          const zIndex = cssZById.get(layer.id) ?? 1;

          return (
            <img
              key={layer.id}
              ref={(el) => {
                layerRefs.current[index] = el;
              }}
              src={layer.src}
              alt={layer.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              className="
                absolute inset-0 w-full h-full
                select-none pointer-events-none
              "
              style={{
                zIndex,
                // Importante para móvil: SIEMPRE “cover” y con posición controlada
                objectFit: 'cover',
                objectPosition: layer.objectPosition ?? 'center bottom',
                // Stars: queremos que empiecen “arriba” para luego bajar
                ...(isStars ? { transform: 'translate3d(0,-550px,0)' } : null),
              }}
            />
          );
        })}

        {/* Texto: ajusta tamaños en móvil y evita overflow */}
        <h1
          ref={textRef}
          className="
            text-nav-background
            font-title
            flex items-center justify-center
            text-6xl lg:text-9xl
            gap-6
            my-18
          "
          style={{
            // Entre cielo y montaña (manteniendo tu intención)
            zIndex: (() => {
              const mountainZIndex = layers.find((l) => l.id === 'mountain')?.zIndex ?? 5;
              return maxZ - mountainZIndex;
            })(),
          }}
        >
          <span>Nerea</span>
          <span className="text-4xl sm:text-6xl">&</span>
          <span>Iker</span>
        </h1>

        {/* Capa de color del suelo */}
        <div
          ref={backgroundRef}
          className="absolute left-0 w-full"
          style={{
            backgroundColor: '#e1eacd',
            zIndex: (() => {
              const firstLayerZIndex = layers[0].zIndex ?? 1;
              return maxZ - firstLayerZIndex + 1;
            })(),
            top: '100%',
            height: '200vh',
          }}
        />
      </section>
    </div>
  );
};
