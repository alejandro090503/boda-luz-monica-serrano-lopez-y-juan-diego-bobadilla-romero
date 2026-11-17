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

/* Reloj de bolsillo premium: caja con bisel moleteado, esfera esmaltada con
   guilloche, numeros romanos, subesfera de segundos y manecilla Breguet azul. */
const ROMANOS = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

function Reloj({ valor, max, etiqueta, id }: { valor: number | null; max: number; etiqueta: string; id: string }) {
  const ang = valor === null ? 0 : (valor / max) * 360;
  const v = valor === null ? "––" : String(valor).padStart(2, "0");
  const cx = 70, cy = 104;
  const pt = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180;
    return [cx + Math.sin(a) * r, cy - Math.cos(a) * r];
  };
  return (
    <div className="reloj">
      <svg viewBox="0 0 140 172" className="reloj-svg" aria-hidden="true">
        <defs>
          <linearGradient id={`oro-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff4c4" />
            <stop offset=".22" stopColor="#e2c25a" />
            <stop offset=".45" stopColor="#a8841f" />
            <stop offset=".62" stopColor="#f1d985" />
            <stop offset=".82" stopColor="#8a6a14" />
            <stop offset="1" stopColor="#5e450a" />
          </linearGradient>
          <linearGradient id={`oro2-${id}`} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6f520e" />
            <stop offset=".5" stopColor="#d9b94e" />
            <stop offset="1" stopColor="#fff0b8" />
          </linearGradient>
          <radialGradient id={`esm-${id}`} cx=".4" cy=".35" r=".75">
            <stop offset="0" stopColor="#FFFFFA" />
            <stop offset=".7" stopColor="#FAF4DD" />
            <stop offset="1" stopColor="#E6DAB2" />
          </radialGradient>
          <linearGradient id={`azul-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3d6fd1" />
            <stop offset=".5" stopColor="#002878" />
            <stop offset="1" stopColor="#001446" />
          </linearGradient>
        </defs>
        {/* argolla ovalada */}
        <ellipse cx="70" cy="15" rx="12" ry="10.5" fill="none" stroke={`url(#oro-${id})`} strokeWidth="4" />
        <ellipse cx="70" cy="15" rx="12" ry="10.5" fill="none" stroke="#5e450a" strokeOpacity=".35" strokeWidth=".6" />
        {/* corona moleteada */}
        <rect x="61" y="25" width="18" height="15" rx="3" fill={`url(#oro-${id})`} />
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={63.5 + i * 2.2} y1="26.5" x2={63.5 + i * 2.2} y2="38.5" stroke="#6f520e" strokeOpacity=".55" strokeWidth=".7" />
        ))}
        <rect x="65" y="39" width="10" height="9" rx="1.5" fill={`url(#oro2-${id})`} />
        {/* caja */}
        <circle cx={cx} cy={cy} r="64" fill={`url(#oro-${id})`} />
        {Array.from({ length: 90 }, (_, i) => {
          const [x1, y1] = pt(i * 4, 63.4);
          const [x2, y2] = pt(i * 4, 59.6);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5e450a" strokeOpacity=".5" strokeWidth=".7" />;
        })}
        <circle cx={cx} cy={cy} r="58.6" fill={`url(#oro2-${id})`} />
        <circle cx={cx} cy={cy} r="55" fill={`url(#oro-${id})`} />
        {/* esfera esmaltada + guilloche */}
        <circle cx={cx} cy={cy} r="51.5" fill={`url(#esm-${id})`} />
        {[14, 19, 24, 29].map((r) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="#002878" strokeOpacity=".07" strokeWidth=".6" />
        ))}
        {Array.from({ length: 48 }, (_, i) => {
          const [x1, y1] = pt(i * 7.5, 6);
          const [x2, y2] = pt(i * 7.5, 31);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#002878" strokeOpacity=".05" strokeWidth=".5" />;
        })}
        {/* pista de minutos */}
        <circle cx={cx} cy={cy} r="48" fill="none" stroke="#002878" strokeOpacity=".7" strokeWidth=".5" />
        <circle cx={cx} cy={cy} r="45" fill="none" stroke="#002878" strokeOpacity=".7" strokeWidth=".5" />
        {Array.from({ length: 60 }, (_, i) => {
          const [x1, y1] = pt(i * 6, 48);
          const [x2, y2] = pt(i * 6, i % 5 ? 45.8 : 44);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#002878" strokeWidth={i % 5 ? 0.5 : 1.3} />;
        })}
        {/* numeros romanos */}
        {ROMANOS.map((n, i) => {
          const [x, y] = pt(i * 30, 37.5);
          return (
            <text key={n} x={x} y={y + 2.6} textAnchor="middle" fontFamily="var(--font-serif), serif" fontWeight="700" fontSize={i % 3 ? 7 : 8.6} fill="#14213D">
              {n}
            </text>
          );
        })}
        {/* subesfera decorativa */}
        <circle cx={cx} cy={cy + 21} r="9" fill="#FFFDF0" stroke="#002878" strokeOpacity=".55" strokeWidth=".6" />
        <circle cx={cx} cy={cy + 21} r="1.3" fill="#002878" />
        {/* manecilla Breguet */}
        <g style={{ transform: `rotate(${ang}deg)`, transformOrigin: `${cx}px ${cy}px`, transition: "transform .6s cubic-bezier(.34,1.56,.64,1)" }}>
          <path d={`M${cx} ${cy + 13} L${cx} ${cy - 23}`} stroke={`url(#azul-${id})`} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx={cx} cy={cy - 27} r="4.3" fill="none" stroke={`url(#azul-${id})`} strokeWidth="1.6" />
          <path d={`M${cx} ${cy - 31.5} L${cx - 1.6} ${cy - 37} L${cx} ${cy - 44} L${cx + 1.6} ${cy - 37} Z`} fill={`url(#azul-${id})`} />
          <circle cx={cx} cy={cy + 14} r="2.6" fill={`url(#azul-${id})`} />
        </g>
        <circle cx={cx} cy={cy} r="4.4" fill={`url(#oro-${id})`} stroke="#5e450a" strokeWidth=".6" />
        <circle cx={cx} cy={cy} r="1.4" fill="#002878" />
        {/* cristal */}
        <path d={`M${cx - 40} ${cy - 10} A42 42 0 0 1 ${cx - 12} ${cy - 41}`} fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="3.4" strokeLinecap="round" />
        <path d={`M${cx + 34} ${cy + 26} A42 42 0 0 1 ${cx + 18} ${cy + 38}`} fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="1.8" strokeLinecap="round" />
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
