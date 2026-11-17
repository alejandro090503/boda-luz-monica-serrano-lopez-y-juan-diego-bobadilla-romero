"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import AnimatedCard, { Stagger } from "../AnimatedCard";
import { Flourish } from "../Ornaments";
import { useLang } from "../../_data/idioma";
import { Palabras } from "../Vida";

/**
 * Codigo de vestimenta con la seccion de boda-fabiola-y-fernando (estandar
 * para vestimenta formal): dos botones "Ver ideas" (caballeros / damas) que
 * abren un carrusel con cada dibujo dentro de un marco. Repintado a la paleta
 * cobalto/dorado. Los dibujos salen de la foto de vestimenta que mando el
 * cliente (vaquera formal).
 */
const LOOKS = {
  caballeros: {
    head: "Caballeros",
    items: [{ src: "/looks/cab-1.png", cap: "Camisa, chaleco, jeans y botas" }],
  },
  damas: {
    head: "Damas",
    items: [{ src: "/looks/dama-1.png", cap: "Vestido midi, cinturón y botines" }],
  },
} as const;
type Clave = keyof typeof LOOKS;

// Colores a evitar que marco el cliente
const EVITAR = [
  { hex: "#FFFFFF", nombre: "Blanco" },
  { hex: "#FF3A30", nombre: "Rojo" },
];

function Visor({ clave, onClose }: { clave: Clave; onClose: () => void }) {
  const L = LOOKS[clave];
  const [idx, setIdx] = useState(0);
  const [on, setOn] = useState(false);
  const x0 = useRef<number | null>(null);
  const n = L.items.length;
  const go = useCallback((i: number) => setIdx(((i % n) + n) % n), [n]);

  useEffect(() => {
    const r = requestAnimationFrame(() => setOn(true));
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(idx - 1);
      if (e.key === "ArrowRight") go(idx + 1);
    };
    window.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(r);
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", key);
    };
  }, [go, idx, onClose]);

  return createPortal(
    <div
      className={`dc-viewer${on ? " on" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Ideas de vestimenta"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="dcv-box">
        <button className="dc-viewer-close" type="button" aria-label="Cerrar" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <p className="dcv-head">{L.head}</p>
        <div className="dcv-viewport">
          <div
            className="dcv-track"
            style={{ transform: `translateX(${-idx * 100}%)` }}
            onTouchStart={(e) => (x0.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (x0.current === null) return;
              const dx = e.changedTouches[0].clientX - x0.current;
              x0.current = null;
              if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
            }}
          >
            {L.items.map((it) => (
              <figure className="dcv-slide" key={it.src}>
                <div className="dcv-frame">
                  <div className="dcv-mat">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.src} alt={`${L.head} — ${it.cap}`} />
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>
        {n > 1 && (
          <>
            <button className="dcv-nav dcv-prev" type="button" aria-label="Anterior" onClick={() => go(idx - 1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <button className="dcv-nav dcv-next" type="button" aria-label="Siguiente" onClick={() => go(idx + 1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </>
        )}
        <p className="dcv-cap">
          {L.items[idx].cap}
          {n > 1 ? `  ·  ${idx + 1} / ${n}` : ""}
        </p>
        {n > 1 && (
          <div className="dcv-dots">
            {L.items.map((_, i) => (
              <button key={i} type="button" className={`dcv-dot${i === idx ? " on" : ""}`} aria-label={`Ver idea ${i + 1}`} onClick={() => go(i)} />
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default function DressCodeCard() {
  const { t } = useLang();

  return (
    <AnimatedCard className="tex-beige text-center py-8" anim="flip" corners={false}>
      <Stagger>
        <p className="font-sans-label" style={{ color: "var(--olive-soft)", fontSize: "0.8rem", fontWeight: 600 }}>
          Código de vestimenta
        </p>
      </Stagger>
      <Stagger>
        <p className="font-script mt-1" style={{ color: "var(--olive-primary)", fontSize: "3rem", lineHeight: 1.05 }}>
          <Palabras texto={t.vestimenta} />
        </p>
      </Stagger>

      <Stagger>
        <p
          className="font-serif font-bold"
          style={{ color: "var(--ink-dark)", fontSize: "2.3rem", letterSpacing: "0.1em", lineHeight: 1.15, marginTop: "0.3rem" }}
        >
          {t.etiqueta1}
          <br />
          {t.etiqueta2}
        </p>
      </Stagger>

      <Stagger>
        <div className="flex justify-center my-2 w-full">
          <Flourish color="var(--green-line)" width={140} />
        </div>
      </Stagger>

      <Stagger>
        <p className="font-serif italic" style={{ color: "var(--ink-dark)", fontSize: "1.2rem", lineHeight: 1.6, marginBottom: "1.2rem" }}>
          {t.dcNota}
        </p>
      </Stagger>

      <Stagger>
        <div className="dc-grid">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/looks/cab-vaquero.webp" alt="Caballeros: traje, sombrero y botas" />
            <figcaption className="font-sans-label">{t.caballeros}</figcaption>
          </figure>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/looks/dama-vaquera.webp" alt="Damas: vestido largo" />
            <figcaption className="font-sans-label">{t.damas}</figcaption>
          </figure>
        </div>
      </Stagger>

      <Stagger>
        <p className="dc-evitar" style={{ color: "var(--ink-dark)", marginTop: "0.6rem" }}>
          {t.coloresAviso}
        </p>
      </Stagger>
      <Stagger>
        <div className="flex justify-center gap-6 mt-4">
          {EVITAR.map((c) => (
            <div key={c.nombre} className="flex flex-col items-center gap-2">
              <span
                aria-hidden="true"
                style={{
                  position: "relative",
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  backgroundColor: c.hex,
                  border: "1px solid var(--gold-antique)",
                  boxShadow: "0 2px 6px rgba(20,33,61,0.18)",
                  display: "block",
                }}
              >
                <svg viewBox="0 0 46 46" width="46" height="46" style={{ position: "absolute", top: -1, left: -1, display: "block" }}>
                  <circle cx="23" cy="23" r="21.5" fill="none" stroke="#14213D" strokeWidth="2" />
                  <line x1="8" y1="38" x2="38" y2="8" stroke="#14213D" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <span className="font-sans-label" style={{ color: "var(--ink-dark)", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.12em" }}>
                {c.nombre}
              </span>
            </div>
          ))}
        </div>
      </Stagger>

    </AnimatedCard>
  );
}
