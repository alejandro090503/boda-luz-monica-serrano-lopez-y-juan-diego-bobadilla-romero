"use client";

import { useEffect, useRef } from "react";

/**
 * Fondo de estilo mexicano que pidieron los novios (talavera, hortensias,
 * loteria y papel picado) en lugar del marmol de la plantilla.
 *
 * Son cuatro "escenas" en capas fijas detras de las tarjetas. Conforme se hace
 * scroll, cada escena se difumina hacia la siguiente (opacidad + un leve
 * desenfoque y parallax), tal como lo pidieron: "ir difuminando las imagenes
 * conforme hagas scroll".
 *
 * Todo se mueve con transform/opacity escritos directo al estilo (sin
 * re-render de React) dentro de un requestAnimationFrame.
 */

type Escena = { centro: number; ancho: number };

/* Donde vive cada escena en el recorrido (0 = arriba, 1 = final). */
const ESCENAS: Escena[] = [
  { centro: 0.0, ancho: 0.3 },   // talavera
  { centro: 0.33, ancho: 0.24 }, // hortensias
  { centro: 0.62, ancho: 0.24 }, // loteria
  { centro: 1.0, ancho: 0.32 },  // papel picado + talavera
];

function peso(p: number, e: Escena) {
  const d = Math.abs(p - e.centro);
  if (d >= e.ancho) return 0;
  const x = 1 - d / e.ancho;
  return x * x * (3 - 2 * x); // smoothstep
}

/* Cartas de loteria propias de la boda (dibujos del itinerario en marco). */
const CARTAS = [
  { n: 1, nombre: "LA PARROQUIA", icon: "/iconos/iglesia.png", x: 4, y: 10, r: -9 },
  { n: 9, nombre: "LOS ANILLOS", icon: "/iconos/anillos.png", x: 74, y: 6, r: 8 },
  { n: 14, nombre: "LOS NOVIOS", icon: "/iconos/novios.png", x: 70, y: 40, r: -6 },
  { n: 27, nombre: "EL BRINDIS", icon: "/iconos/copas.png", x: 2, y: 47, r: 7 },
  { n: 33, nombre: "EL PASTEL", icon: "/iconos/pastel.png", x: 8, y: 78, r: -5 },
  { n: 54, nombre: "LA FIESTA", icon: "/iconos/fiesta.png", x: 72, y: 76, r: 10 },
];

export default function MexBackground() {
  const capas = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pedido = 0;
    const pintar = () => {
      pedido = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      ESCENAS.forEach((e, i) => {
        const el = capas.current[i];
        if (!el) return;
        const w = peso(p, e);
        el.style.opacity = String(w);
        el.style.visibility = w < 0.01 ? "hidden" : "visible";
        if (!reducido) {
          const desfase = (p - e.centro) * -120; // parallax suave
          el.style.transform = `translate3d(0, ${desfase.toFixed(1)}px, 0) scale(${(1 + (1 - w) * 0.06).toFixed(3)})`;
        }
      });
    };
    const alScroll = () => {
      if (!pedido) pedido = requestAnimationFrame(pintar);
    };
    pintar();
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);
    return () => {
      if (pedido) cancelAnimationFrame(pedido);
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alScroll);
    };
  }, []);

  const set = (i: number) => (el: HTMLDivElement | null) => {
    capas.current[i] = el;
  };

  return (
    <div className="mx-bg" aria-hidden="true">
      {/* 1 · Talavera */}
      <div ref={set(0)} className="mx-capa mx-talavera" />

      {/* 2 · Hortensias */}
      <div ref={set(1)} className="mx-capa mx-hortensias">
        <img src="/mx/hortensia-4.webp" alt="" className="mx-flor" style={{ top: "2%", left: "-16%", width: "min(56vw, 380px)", transform: "rotate(-8deg)" }} />
        <img src="/mx/hortensia-1.webp" alt="" className="mx-flor" style={{ top: "22%", right: "-20%", width: "min(62vw, 420px)", transform: "rotate(10deg)" }} />
        <img src="/mx/hortensia-3.webp" alt="" className="mx-flor" style={{ top: "52%", left: "-22%", width: "min(80vw, 520px)", transform: "rotate(18deg)" }} />
        <img src="/mx/hortensia-2.webp" alt="" className="mx-flor" style={{ bottom: "2%", right: "-18%", width: "min(66vw, 440px)", transform: "rotate(-6deg)" }} />
        <img src="/mx/hortensia-corona.webp" alt="" className="mx-flor mx-solo-ancho" style={{ top: "30%", left: "50%", width: "560px", transform: "translateX(-50%)", opacity: 0.5 }} />
      </div>

      {/* 3 · Loteria */}
      <div ref={set(2)} className="mx-capa mx-loteria">
        {CARTAS.map((c) => (
          <div
            key={c.n}
            className="mx-carta"
            style={{ left: `${c.x}%`, top: `${c.y}%`, transform: `rotate(${c.r}deg)` }}
          >
            <span className="mx-carta-num">{c.n}</span>
            <img src={c.icon} alt="" />
            <span className="mx-carta-nombre">{c.nombre}</span>
          </div>
        ))}
      </div>

      {/* 4 · Papel picado sobre talavera */}
      <div ref={set(3)} className="mx-capa mx-picado">
        <div className="mx-talavera mx-talavera-patron" />
        <div className="mx-tira" style={{ top: "2%" }} />
        <div className="mx-tira mx-tira-b" style={{ top: "38%" }} />
        <div className="mx-tira" style={{ top: "72%" }} />
      </div>

      {/* Velo marfil: baja el ruido para que las tarjetas sigan leyendose */}
      <div className="mx-velo" />
    </div>
  );
}
