"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

/**
 * Piezas de la "capa de vida": reveal de titulos por palabra, divisor que se
 * dibuja entre secciones, destello (sheen) y confeti del RSVP.
 */

const EASE = [0.22, 0.61, 0.36, 1] as const;

/** Titulo que entra palabra por palabra (sube y se enfoca). */
export function Palabras({ texto }: { texto: string }) {
  const palabras = texto.split(" ");
  return (
    <motion.span
      style={{ display: "inline" }}
      initial="h"
      whileInView="v"
      viewport={{ once: true, margin: "-8%" }}
      variants={{ h: {}, v: { transition: { staggerChildren: 0.12 } } }}
    >
      {palabras.map((p, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", whiteSpace: "pre", padding: "0 .08em" }}
          variants={{
            h: { opacity: 0, y: 18, rotateX: -40 },
            v: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: EASE } },
          }}
        >
          {p}
          {i < palabras.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}

/** Divisor de talavera que se dibuja al pasar entre secciones. */
export function SecDiv() {
  const trazo = {
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: "-5%" },
  };
  return (
    <div className="sec-div" aria-hidden="true">
      <svg viewBox="0 0 150 26">
        <motion.path d="M2 13 H58" stroke="#9A7B22" strokeWidth="1.2" fill="none" {...trazo} transition={{ duration: 0.9, ease: EASE }} />
        <motion.path d="M148 13 H92" stroke="#9A7B22" strokeWidth="1.2" fill="none" {...trazo} transition={{ duration: 0.9, ease: EASE }} />
        <motion.path
          d="M75 2 C80 8 86 10 92 13 C86 16 80 18 75 24 C70 18 64 16 58 13 C64 10 70 8 75 2 Z"
          stroke="#002878"
          strokeWidth="1.4"
          fill="none"
          {...trazo}
          transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
        />
        <motion.circle
          cx="75"
          cy="13"
          r="3"
          fill="#D4AF37"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1, type: "spring", stiffness: 300, damping: 14 }}
        />
      </svg>
    </div>
  );
}

/** Destello que cruza la tarjeta una vez al entrar. */
export function Sheen() {
  return (
    <span className="sheen-clip" aria-hidden="true">
      <motion.span
        className="sheen-barra"
        initial={{ x: "0%" }}
        whileInView={{ x: "520%" }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
      />
    </span>
  );
}

/** Confeti con los colores de la invitacion (sin librerias). */
export function lanzarConfeti(origen?: HTMLElement | null) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = origen?.getBoundingClientRect();
  const cx = r ? r.left + r.width / 2 : window.innerWidth / 2;
  const cy = r ? r.top + r.height / 2 : window.innerHeight / 2;
  const capa = document.createElement("div");
  capa.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:200;overflow:hidden";
  document.body.appendChild(capa);
  const colores = ["#002878", "#D4AF37", "#4A7BB7", "#FFFFE2", "#1E3A8A", "#ead47e"];
  const N = 70;
  for (let i = 0; i < N; i++) {
    const p = document.createElement("span");
    const w = 6 + Math.random() * 6;
    p.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:${w}px;height:${w * 0.45}px;background:${colores[i % colores.length]};border-radius:1px;box-shadow:0 0 0 .5px rgba(0,0,0,.08)`;
    capa.appendChild(p);
    const ang = Math.random() * Math.PI * 2;
    const vel = 120 + Math.random() * 220;
    const dx = Math.cos(ang) * vel;
    const dy = Math.sin(ang) * vel - 160;
    p.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: 0.45 },
        { transform: `translate(${dx * 1.3}px, ${dy + 420}px) rotate(${Math.random() * 720}deg)`, opacity: 0 },
      ],
      { duration: 1800 + Math.random() * 900, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" }
    );
  }
  setTimeout(() => capa.remove(), 3000);
}

/** La tarjeta que va saliendo por arriba se desenfoca y se aclara; la que entra queda nitida. */
export function SalidaBlur() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const pintar = () => {
      raf = 0;
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>(".sec-anchor > *").forEach((el) => {
        const r = el.getBoundingClientRect();
        const t = Math.min(Math.max((vh * 0.32 - r.bottom) / (vh * 0.32), 0), 1);
        if (t <= 0) {
          if (el.style.filter) { el.style.filter = ""; el.style.opacity = ""; }
          return;
        }
        el.style.filter = `blur(${(t * 6).toFixed(1)}px)`;
        el.style.opacity = String(1 - t * 0.6);
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(pintar); };
    window.addEventListener("scroll", on, { passive: true });
    pintar();
    return () => { window.removeEventListener("scroll", on); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return null;
}
