import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import confetti from "canvas-confetti";
import { useTranslation } from "@/utils/useTranslation";
import type { Locale } from "@/i18n/config";

gsap.registerPlugin(ScrollTrigger);

interface PhraseRevealProps {
  locale: Locale;
}

type Token = { type: "word" | "space"; value: string };

function tokenizeByWords(text: string): Token[] {
  const parts = text.split(/(\s+)/);
  return parts
    .filter((p) => p.length > 0)
    .map((p) =>
      p.trim().length === 0
        ? { type: "space", value: p }
        : { type: "word", value: p }
    );
}

function splitByDot(phrase: string): { head: string; last: string } {
  const raw = phrase
    .split(".")
    .map((s) => s.trim())
    .filter(Boolean);

  if (raw.length <= 1) {
    return { head: "", last: raw[0] ?? phrase.trim() };
  }

  const last = raw[raw.length - 1];
  const head = raw.slice(0, -1).join(". ") + ".";
  return { head, last };
}

// 🔹 Genera variantes rgba con diferentes opacidades
function hexToRgb(hex: string) {
  const cleaned = hex.replace("#", "").trim();
  const full = cleaned.length === 3
    ? cleaned.split("").map((c) => c + c).join("")
    : cleaned;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return { r, g, b };
}

function colorToRgbaVariants(
  color: string,
  alphas = [1, 0.8, 0.6, 0.4, 0.25]
) {
  const c = color.trim();

  // rgb/rgba(...)
  const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (m) {
    const r = Number(m[1]);
    const g = Number(m[2]);
    const b = Number(m[3]);
    return alphas.map((a) => `rgba(${r},${g},${b},${a})`);
  }

  // #RRGGBB / #RGB
  if (c.startsWith("#")) {
    const rgb = hexToRgb(c);
    if (!rgb) return ["rgba(0,0,0,1)"];
    return alphas.map((a) => `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`);
  }

  // fallback
  return ["rgba(0,0,0,1)"];
}

function fireForegroundConfetti(color: string) {
  const colors = ["#00292b"];

  const c = confetti.create(undefined, { resize: true, useWorker: true });

  c({
    particleCount: 80,
    spread: 70,
    startVelocity: 35,
    gravity: 1.1,
    scalar: 1,
    ticks: 160,
    colors,
    origin: { x: 0.5, y: 0.65 },
  });

  c({
    particleCount: 45,
    spread: 110,
    startVelocity: 22,
    gravity: 1.2,
    scalar: 0.9,
    ticks: 170,
    colors,
    origin: { x: 0.5, y: 0.65 },
  });
}

export function PhraseReveal({ locale }: PhraseRevealProps) {
  const { t } = useTranslation(locale);

  const containerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLParagraphElement>(null);
  const lastRef = useRef<HTMLParagraphElement>(null);

  const headWordRefs = useRef<HTMLSpanElement[]>([]);
  headWordRefs.current = [];

  const confettiFiredRef = useRef(false);

  const phrase = t("phrase");

  const { head, last } = useMemo(() => splitByDot(phrase), [phrase]);
  const headTokens = useMemo(() => tokenizeByWords(head), [head]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const headEl = headRef.current;
      const lastEl = lastRef.current;
      if (!headEl || !lastEl) return;

      // Estado inicial
      gsap.set(headWordRefs.current, { opacity: 0.2 });
      gsap.set(lastEl, { opacity: 0, scale: 0.98 });

      // 1) Reveal palabras del bloque superior
      gsap.to(headWordRefs.current, {
        opacity: 1,
        stagger: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 100%",
          scrub: 1,
        },
      });

      // 2) Transición a última frase
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 0%",
          end: "top 10%",
          scrub: 1,
        },
      });

      tl.to(
        headEl,
        {
          opacity: 0,
          y: -16,
          ease: "none",
        },
        0
      ).to(
        lastEl,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "none",
          onUpdate: () => {
            if (confettiFiredRef.current) return;

            const currentOpacity = Number(
              gsap.getProperty(lastEl, "opacity")
            );

            if (currentOpacity >= 0.25) {
              confettiFiredRef.current = true;

              const fg = getComputedStyle(document.documentElement)
                .getPropertyValue("--color-foreground")
                .trim();
              console.log(fg);


              if (typeof window !== "undefined") {
                // fireForegroundConfetti(fg);
              }
            }
          },
        },
        0
      );

      tl.to(
        lastEl,
        {
          letterSpacing: "0.01em",
          ease: "none",
        },
        0
      );

      tl.eventCallback("onReverseComplete", () => {
        confettiFiredRef.current = false;
      });
    }, containerRef);

    return () => ctx.revert();
  }, [phrase]);

  return (
    <section
      ref={containerRef}
      className="
        relative min-h-screen w-full bg-background
        flex items-center justify-center
        px-6 py-16
        sm:px-10 sm:py-20
        lg:px-16 lg:py-28
      "
    >
      <div className="relative w-full max-w-[70rem]">
        {head && (
          <p
            ref={headRef}
            className="
              text-center font-family-montserrat font-semibold text-foreground
              text-2xl leading-tight
              sm:text-3xl
              md:text-4xl
              lg:text-6xl lg:leading-[1.1]
              mx-auto
            "
          >
            {headTokens.map((token, i) => {
              if (token.type === "space")
                return <span key={`hs-${i}`}>{" "}</span>;

              return (
                <span
                  key={`hw-${i}-${token.value}`}
                  ref={(el) => {
                    if (el) headWordRefs.current.push(el);
                  }}
                  className="inline-block whitespace-nowrap"
                  style={{ opacity: 0.2 }}
                >
                  {token.value}
                </span>
              );
            })}
          </p>
        )}

        <p
          ref={lastRef}
          className="
            mt-8
            inset-0
            flex items-center justify-center
            text-center font-family-montserrat font-semibold text-foreground
            px-2
            text-3xl leading-tight
            sm:text-4xl
            md:text-6xl
            lg:text-7xl lg:leading-[1.05]
          "
          style={{ transform: "translate3d(0,0,0)" }}
        >
          {last}
        </p>
      </div>
    </section>
  );
}
