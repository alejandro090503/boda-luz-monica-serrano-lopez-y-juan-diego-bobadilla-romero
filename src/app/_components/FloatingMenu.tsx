"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Menu flotante de secciones (referencia valeyandres.love).
 * Escritorio: pildora de vidrio arriba con indicador que se desliza.
 * Celular: pildora abajo con "Menú" que abre una hoja a pantalla completa
 * revelada con un circulo que crece desde el boton.
 */
const SECCIONES = [
  { id: "inicio", label: "Inicio" },
  { id: "familia", label: "Familia" },
  { id: "cuenta", label: "Cuenta regresiva" },
  { id: "padrinos", label: "Padrinos" },
  { id: "ubicaciones", label: "Ubicaciones" },
  { id: "itinerario", label: "Itinerario" },
  { id: "galeria", label: "Galería" },
  { id: "vestimenta", label: "Vestimenta" },
  { id: "hospedaje", label: "Hospedaje" },
  { id: "regalos", label: "Regalos" },
  { id: "album", label: "Álbum" },
  { id: "confirmar", label: "Confirmar" },
];
/* En la pildora de escritorio no caben todas: solo las principales */
const ESCRITORIO = ["inicio", "ubicaciones", "itinerario", "galeria", "vestimenta", "hospedaje", "regalos", "confirmar"];

const EASE = [0.22, 0.61, 0.36, 1] as const;

function Monograma({ size = 22 }: { size?: number }) {
  return (
    <span className="font-script" style={{ fontSize: size, lineHeight: 1, whiteSpace: "nowrap", color: "#002878" }}>
      M&amp;D
    </span>
  );
}

function IconoCompartir() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v13" />
    </svg>
  );
}

export default function FloatingMenu() {
  const [activa, setActiva] = useState("inicio");
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const els = SECCIONES.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const visibles = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visibles.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        let mejor = "";
        let ratio = 0;
        visibles.forEach((r, id) => {
          if (r > ratio) {
            ratio = r;
            mejor = id;
          }
        });
        if (mejor) setActiva(mejor);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.01, 0.1, 0.3] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", esc);
    };
  }, [abierto]);

  const ir = useCallback((id: string) => {
    setAbierto(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), abierto ? 380 : 0);
  }, [abierto]);

  const compartir = useCallback(async () => {
    const url = window.location.origin;
    const data = { title: "Luz Mónica & Juan Diego", text: "Nuestra boda · 9 de enero de 2027", url };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(url);
    } catch {
      /* cancelado */
    }
  }, []);

  return (
    <>
      {/* ── Escritorio ── */}
      <motion.nav
        className="fm-desk"
        aria-label="Secciones"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
      >
        <button type="button" className="fm-mono" onClick={() => ir("inicio")} aria-label="Ir al inicio">
          <Monograma />
        </button>
        <ul className="fm-links">
          {SECCIONES.filter((s) => ESCRITORIO.includes(s.id)).map((s) => (
            <li key={s.id}>
              <button type="button" onClick={() => ir(s.id)} className={activa === s.id ? "on" : ""}>
                {activa === s.id && (
                  <motion.span layoutId="fm-pill" className="fm-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <span className="fm-txt">{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <span className="fm-sep" aria-hidden="true" />
        <button type="button" className="fm-icon" onClick={compartir} aria-label="Compartir invitación">
          <IconoCompartir />
        </button>
      </motion.nav>

      {/* ── Celular ── */}
      <motion.nav
        className="fm-mob"
        aria-label="Secciones"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
      >
        <button type="button" className="fm-mono" onClick={() => ir("inicio")} aria-label="Ir al inicio">
          <Monograma size={24} />
        </button>
        <button type="button" className="fm-icon" onClick={compartir} aria-label="Compartir invitación">
          <IconoCompartir />
        </button>
        <button type="button" className="fm-menu-btn" onClick={() => setAbierto(true)} aria-expanded={abierto}>
          <span aria-hidden="true">&#9776;</span> Menú
        </button>
      </motion.nav>

      <AnimatePresence>
        {abierto && (
          <motion.div
            className="fm-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de secciones"
            initial={{ clipPath: "circle(0% at 85% 95%)" }}
            animate={{ clipPath: "circle(150% at 85% 95%)" }}
            exit={{ clipPath: "circle(0% at 85% 95%)" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="fm-sheet-top">
              <Monograma size={34} />
              <button type="button" className="fm-close" onClick={() => setAbierto(false)} aria-label="Cerrar menú">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <ol className="fm-list">
              {SECCIONES.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + i * 0.07, duration: 0.45, ease: EASE }}
                >
                  <button type="button" onClick={() => ir(s.id)} className={activa === s.id ? "on" : ""}>
                    <span className="fm-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="fm-name">{s.label}</span>
                  </button>
                </motion.li>
              ))}
            </ol>
            <p className="fm-pie">9 · ENERO · 2027 &nbsp;·&nbsp; TLALTENANGO, ZAC.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
