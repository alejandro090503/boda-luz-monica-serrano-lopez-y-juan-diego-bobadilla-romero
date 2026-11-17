"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedCard, { Stagger } from "../AnimatedCard";
import { OliveBranch } from "../Ornaments";
import { FECHA_BODA } from "../../_data/fecha";
import { useLang } from "../../_data/idioma";
import { Palabras } from "../Vida";

/**
 * Contador que pidieron los novios: la fecha en una hoja de calendario y las
 * horas, minutos y segundos en relojes de bolsillo dorados.
 */

/** La ceremonia es a las 5:00 de la tarde. */
const HORA_CEREMONIA = 17;

const DIAS_SEMANA = ["D", "L", "M", "M", "J", "V", "S"];
const MESES = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];

type Resto = { dias: number; horas: number; minutos: number; segundos: number };

function calcular(fecha: Date): Resto {
  const objetivo = new Date(fecha);
  objetivo.setHours(HORA_CEREMONIA, 0, 0, 0);
  const ms = Math.max(objetivo.getTime() - Date.now(), 0);
  return {
    dias: Math.floor(ms / 86400000),
    horas: Math.floor((ms % 86400000) / 3600000),
    minutos: Math.floor((ms % 3600000) / 60000),
    segundos: Math.floor((ms % 60000) / 1000),
  };
}

/* Numero que cambia con un giro (tick) */
function Giro({ valor, style, className }: { valor: string; style?: React.CSSProperties; className?: string }) {
  return (
    <span className={className} style={{ display: "inline-block", perspective: 300, ...style }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={valor}
          style={{ display: "inline-block" }}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {valor}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Calendario({ fecha, dias }: { fecha: Date; dias: number | null }) {
  const y = fecha.getFullYear();
  const m = fecha.getMonth();
  const primero = new Date(y, m, 1).getDay();
  const total = new Date(y, m + 1, 0).getDate();
  const celdas: (number | null)[] = [
    ...Array.from({ length: primero }, () => null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];
  while (celdas.length % 7) celdas.push(null);

  return (
    <div className="cal">
      <div className="cal-anillas" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} />
        ))}
      </div>
      <div className="cal-head">
        <span className="font-sans-label">{MESES[m]}</span>
        <span className="font-serif cal-anio">{y}</span>
      </div>
      <div className="cal-grid" role="grid" aria-label={`${MESES[m]} ${y}`}>
        {DIAS_SEMANA.map((d, i) => (
          <span key={`h${i}`} className="cal-dow font-sans-label">
            {d}
          </span>
        ))}
        {celdas.map((d, i) => {
          const es = d === fecha.getDate();
          return (
            <span key={i} className={`cal-dia font-serif${es ? " cal-hoy" : ""}`}>
              {d ?? ""}
              {es && (
                <svg className="cal-circulo" viewBox="0 0 60 60" aria-hidden="true">
                  <motion.path
                    d="M30 6 C46 5 55 17 54 30 C53 45 41 55 28 54 C14 53 5 42 6 28 C7 15 18 7 33 8"
                    fill="none"
                    stroke="url(#oroCal)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.4, ease: "easeInOut" }}
                  />
                  <defs>
                    <linearGradient id="oroCal" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#ead47e" />
                      <stop offset=".5" stopColor="#D4AF37" />
                      <stop offset="1" stopColor="#8a6a14" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
            </span>
          );
        })}
      </div>
      <div className="cal-pie">
        <Giro
          className="font-serif cal-num"
          valor={dias === null ? "––" : String(dias)}
        />
        <span className="font-sans-label cal-lbl">{dias === 1 ? "Día" : "Días"}</span>
      </div>
    </div>
  );
}

/* Reloj de bolsillo dorado: la manecilla marca la fraccion (valor/max). */
function Reloj({ valor, max, etiqueta, id }: { valor: number | null; max: number; etiqueta: string; id: string }) {
  const ang = valor === null ? 0 : (valor / max) * 360;
  const v = valor === null ? "––" : String(valor).padStart(2, "0");
  return (
    <div className="reloj">
      <svg viewBox="0 0 120 150" className="reloj-svg" aria-hidden="true">
        <defs>
          <linearGradient id={`caja-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbf0bf" />
            <stop offset=".28" stopColor="#d4af37" />
            <stop offset=".55" stopColor="#9a7b22" />
            <stop offset=".78" stopColor="#e3c768" />
            <stop offset="1" stopColor="#6f520e" />
          </linearGradient>
          <radialGradient id={`esfera-${id}`} cx=".42" cy=".38" r=".7">
            <stop offset="0" stopColor="#FFFFF4" />
            <stop offset=".75" stopColor="#FBF6DC" />
            <stop offset="1" stopColor="#EDE3BD" />
          </radialGradient>
        </defs>
        {/* argolla y corona */}
        <circle cx="60" cy="13" r="9.5" fill="none" stroke={`url(#caja-${id})`} strokeWidth="3.4" />
        <rect x="53" y="20" width="14" height="11" rx="2.5" fill={`url(#caja-${id})`} />
        <rect x="55.5" y="17.5" width="9" height="4" rx="1.5" fill={`url(#caja-${id})`} />
        {/* caja */}
        <circle cx="60" cy="88" r="56" fill={`url(#caja-${id})`} />
        <circle cx="60" cy="88" r="50.5" fill="none" stroke="#6f520e" strokeOpacity=".45" strokeWidth="1" />
        <circle cx="60" cy="88" r="48" fill={`url(#esfera-${id})`} />
        <circle cx="60" cy="88" r="43.5" fill="none" stroke="#002878" strokeOpacity=".35" strokeWidth=".8" />
        {/* marcas */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const r1 = i % 3 === 0 ? 36 : 39.5;
          return (
            <line
              key={i}
              x1={60 + Math.sin(a) * r1}
              y1={88 - Math.cos(a) * r1}
              x2={60 + Math.sin(a) * 43}
              y2={88 - Math.cos(a) * 43}
              stroke="#002878"
              strokeWidth={i % 3 === 0 ? 2.2 : 1.1}
              strokeLinecap="round"
            />
          );
        })}
        {/* manecilla */}
        <g
          style={{
            transform: `rotate(${ang}deg)`,
            transformOrigin: "60px 88px",
            transition: "transform .55s cubic-bezier(.34,1.56,.64,1)",
          }}
        >
          <path d="M60 52 L62.4 86 L60 92 L57.6 86 Z" fill="#002878" />
          <circle cx="60" cy="56" r="2.2" fill="#D4AF37" />
        </g>
        <circle cx="60" cy="88" r="3.6" fill="#D4AF37" stroke="#6f520e" strokeWidth=".8" />
        {/* reflejo del cristal */}
        <path d="M24 70 A40 40 0 0 1 52 44" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div className="reloj-num">
        <Giro className="font-serif" valor={v} />
      </div>
      <p className="font-sans-label reloj-lbl">{etiqueta}</p>
    </div>
  );
}

export default function CountdownCard() {
  const { t } = useLang();
  const [resto, setResto] = useState<Resto | null>(null);

  useEffect(() => {
    const fecha = FECHA_BODA;
    if (!fecha) return;
    const tick = () => setResto(calcular(fecha));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!FECHA_BODA) return null;

  return (
    <AnimatedCard className="tex-count text-center py-9" anim="zoom">
      <Stagger>
        <div className="flex justify-center mb-2">
          <OliveBranch width={100} color="var(--green-line)" />
        </div>
      </Stagger>

      <Stagger>
        <p className="font-script" style={{ color: "var(--olive-primary)", fontSize: "2.9rem", lineHeight: 1.1 }}>
          <Palabras texto={t.faltan} />
        </p>
      </Stagger>

      <Stagger>
        <Calendario fecha={FECHA_BODA} dias={resto ? resto.dias : null} />
      </Stagger>

      <Stagger>
        <div className="relojes">
          <svg className="relojes-cadena" viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true">
            <path d="M40 8 Q95 40 150 8 Q205 40 260 8" fill="none" stroke="#B8962E" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />
          </svg>
          <Reloj id="h" valor={resto ? resto.horas : null} max={24} etiqueta={t.horas} />
          <Reloj id="m" valor={resto ? resto.minutos : null} max={60} etiqueta={t.minutos} />
          <Reloj id="s" valor={resto ? resto.segundos : null} max={60} etiqueta={t.segundos} />
        </div>
      </Stagger>

      <Stagger>
        <p className="font-serif italic mt-5" style={{ color: "var(--ink-dark)", fontSize: "1.3rem" }}>
          {t.granDia}
        </p>
      </Stagger>
    </AnimatedCard>
  );
}
