import { useEffect, useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { locales } from '@/i18n/config';

function isHomePage(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, '') || '/';
  if (normalized === '/') return true;
  const segments = pathname.split('/').filter(Boolean);
  return segments.length === 1 && locales.includes(segments[0] as (typeof locales)[number]);
}

type LoaderPhase = 'visible' | 'exiting' | 'gone';

const FADE_DURATION_MS = 550;
const UNMOUNT_DELAY_MS = FADE_DURATION_MS + 150;

export function PageLoader() {
  const { fontsLoaded, parallaxLoaded } = useUIStore();
  const [phase, setPhase] = useState<LoaderPhase>('visible');

  const ready = fontsLoaded && parallaxLoaded;

  useEffect(() => {
    document.fonts.ready.then(() => {
      useUIStore.getState().setFontsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const pathname = window.location.pathname;
    if (!isHomePage(pathname)) {
      useUIStore.getState().setParallaxLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    // Esperar 2 frames para que el navegador pinte el loader con opacity 1
    // y la transición CSS pueda animar de 1 → 0
    let raf2Id: number | undefined;
    const raf1Id = requestAnimationFrame(() => {
      raf2Id = requestAnimationFrame(() => setPhase('exiting'));
    });
    const t = setTimeout(() => setPhase('gone'), UNMOUNT_DELAY_MS);
    return () => {
      cancelAnimationFrame(raf1Id);
      if (raf2Id != null) cancelAnimationFrame(raf2Id);
      clearTimeout(t);
    };
  }, [ready]);

  if (phase === 'gone') return null;

  const isExiting = phase === 'exiting';

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-background ease-out"
      style={{
        opacity: isExiting ? 0 : 1,
        pointerEvents: isExiting ? 'none' : 'auto',
        transition: `opacity ${FADE_DURATION_MS}ms ease-out`,
      }}
      aria-hidden="true"
      aria-busy={!ready}
    >
      <div
        className="ease-out"
        style={{
          transform: isExiting ? 'scale(0.92)' : 'scale(1)',
          opacity: isExiting ? 0 : 1,
          transition: `transform ${FADE_DURATION_MS}ms ease-out, opacity ${FADE_DURATION_MS}ms ease-out`,
        }}
      >
        <div
          className="h-10 w-10 rounded-full border-2 border-page-text-primary border-t-transparent animate-spin"
          role="status"
          aria-label="Cargando"
        >
          <span className="sr-only">Cargando</span>
        </div>
      </div>
    </div>
  );
}
