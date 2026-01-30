import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ParallaxLayer {
  id: string;
  src: string;
  alt: string;
  zIndex?: number;
  movementAmount?: number;
}

const layers: ParallaxLayer[] = [
  {
    id: 'front',
    src: '/parallax/front.webp',
    alt: 'Front',
    zIndex: 1,
    movementAmount: 80,
  },
  {
    id: 'birds',
    src: '/parallax/birds.webp',
    alt: 'Birds',
    zIndex: 2,
    movementAmount: 580,
  },
  {
    id: 'water',
    src: '/parallax/water.webp',
    alt: 'Water',
    zIndex: 3,
    movementAmount: 280,
  },
  {
    id: 'camp',
    src: '/parallax/camp.webp',
    alt: 'Camp',
    zIndex: 4,
    movementAmount: 280,
  },
  {
    id: 'mountain',
    src: '/parallax/montain.webp',
    alt: 'Mountain',
    zIndex: 5,
    movementAmount: 380,
  },
  {
    id: 'sun',
    src: '/parallax/sun.webp',
    alt: 'Sun',
    zIndex: 6,
    movementAmount: 780,
  },
  {
    id: 'stars',
    src: '/parallax/stars.webp',
    alt: 'Stars',
    zIndex: 7,
    movementAmount: 0, // Stars stay in place or move very little
  },
];

interface ParallaxStackProps {
  pinDuration?: number; // Duration in pixels for pinning
}

export const ParallaxStack = ({
  pinDuration = 5000, // Default: 5000px of scroll (like in example)
}: ParallaxStackProps) => {
  const parallaxRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<(HTMLImageElement | null)[]>([]);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [background, setBackground] = useState(20);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      const container = parallaxRef.current;
      if (!container) return;

      // Create timeline for the entire parallax sequence
      const tl = gsap.timeline({
        defaults: { duration: 1 },
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `${pinDuration} bottom`,
          scrub: true,
          pin: true,
        },
        onUpdate: (self) => {
          setBackground(Math.ceil(self.progress * 100 + 20));
        },
      });
      // Animate all layers - front layer (first) moves up, others move down
      layerRefs.current.forEach((layer, index) => {
        if (!layer) return;

        const layerData = layers[index];
        const movementAmount = layerData.movementAmount;
        const isStars = layerData.id === 'stars';
        const layerZIndex = layers[index].zIndex ?? index + 1;
        const maxZIndex = Math.max(...layers.map((l, i) => l.zIndex ?? i + 1));
        const isFrontLayer = index === 0 || layerZIndex === 1; // First layer or zIndex 1

        if (isStars) {
          // Stars layer - moves down slowly to reveal
          tl.to(
            layer,
            {
              y: `+=${550}`, // Move down from -550px to visible
            },
            0, // Start at the beginning
          );
        } else if (isFrontLayer) {
          // Front layer moves up
          if (movementAmount) {
            tl.to(
              layer,
              {
                y: `-=${movementAmount}`,
              },
              0,
            );
          }
        } else {
          // Other layers move down
          if (movementAmount) {
            tl.to(
              layer,
              {
                y: `+=${movementAmount}`,
              },
              0,
            );
          }
        }
      });

      // Animate background color layer - moves up with first layer
      if (backgroundRef.current) {
        tl.to(
          backgroundRef.current,
          {
            y: `-=${80}`, // Move up with first layer
          },
          0,
        );
      }

      // Animate text layer - moves down with other layers
      if (textRef.current) {
        tl.to(
          textRef.current,
          {
            y: `+=${980}`, // Move down to reveal
          },
          0,
        );
      }
    });

    return () => ctx.revert();
  }, [layers, pinDuration]);

  return (
    <div className='overflow-hidden'>
      <section
        ref={parallaxRef}
        className='relative w-full'
        style={{
          height: '110vh',
          position: 'relative',
          background: `linear-gradient(#a5dfe4, #a5dfe4 ${background}%, #a5dfe4, #a5dfe4 )`, // Sky gradient background
        }}
      >
        {layers.map((layer, index) => {
          // Invert zIndex: in CSS, higher zIndex = front (visually on top)
          // But in our data, lower zIndex = front layer, so we need to invert
          const maxZIndex = Math.max(...layers.map((l) => l.zIndex ?? layers.length - layers.indexOf(l)));
          const layerZIndex = layer.zIndex ?? layers.length - index;
          const calculatedZIndex = maxZIndex - layerZIndex + 1; // Invert: front (zIndex 1) becomes highest CSS zIndex
          const isStars = layer.id === 'stars';

          return (
            <img
              key={layer.id}
              ref={(el) => {
                layerRefs.current[index] = el;
              }}
              src={layer.src}
              alt={layer.alt}
              className='absolute w-full'
              style={{
                position: 'absolute',
                ...(isStars
                  ? {
                      top: '-550px', // Position stars at the top like in example
                      left: 0,
                      bottom: 'auto',
                    }
                  : {
                      bottom: 0,
                    }),
                zIndex: calculatedZIndex,
                height: isStars ? 'auto' : '100%',
                width: '100%',
                objectFit: 'cover',
              }}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          );
        })}
        {/* Text layer - "Nerea & Iker" between sky and mountain */}
        <h1
          ref={textRef}
          className='left-10 top-20 text-outline text-8xl flex flex-col items-start'
          style={{
            zIndex: (() => {
              const maxZIndex = Math.max(...layers.map((l) => l.zIndex ?? layers.length - layers.indexOf(l)));
              const mountainZIndex = layers.find((l) => l.id === 'mountain')?.zIndex ?? 5;
              // Position text between sky (background) and mountain
              // Mountain has zIndex 5, so text should be slightly behind it
              return maxZIndex - mountainZIndex;
            })(),
            position: 'absolute',
            whiteSpace: 'pre-line',
          }}
        >
          <span>Nerea</span>
          <span className='text-6xl'>&</span>
          <span>Iker</span>
        </h1>
        {/* Background color layer for first layer - moves with it */}
        {layers.length > 0 && (
          <div
            ref={backgroundRef}
            className='absolute w-full'
            style={{
              backgroundColor: '#6b7716',
              zIndex: (() => {
                const maxZIndex = Math.max(...layers.map((l) => l.zIndex ?? layers.length - layers.indexOf(l)));
                const firstLayerZIndex = layers[0].zIndex ?? layers.length;
                return maxZIndex - firstLayerZIndex + 1; // Invert to match CSS zIndex
              })(),
              top: '100%',
              height: '200vh',
              position: 'absolute',
            }}
          />
        )}
      </section>
    </div>
  );
};
