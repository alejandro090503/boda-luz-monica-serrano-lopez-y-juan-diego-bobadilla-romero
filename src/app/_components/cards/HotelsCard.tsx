"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import AnimatedCard, { Stagger } from "../AnimatedCard";
import { useLang } from "../../_data/idioma";
import { Palabras } from "../Vida";

/**
 * Hospedaje lista + mapa (referencia valeyandres.love/#hospedaje).
 * Selector tipo pildora; al cambiar, la tarjeta gira en 3D: de un lado la
 * lista y del otro un mapa MapLibre con tiles de OpenFreeMap recoloreado a la
 * paleta. Coordenadas sacadas de los links de Google Maps del cliente; minutos
 * y km en auto calculados una vez con OSRM.
 */
const RECEPCION = { nombre: "Palapa Don Naty", lng: -103.2908167, lat: 21.7816266 };
const CEREMONIA = { nombre: "Parroquia de Nuestra Señora de Guadalupe", lng: -103.3062887, lat: 21.7821296 };

const HOTELES = [
  {
    nombre: "Hotel Plaza",
    tipo: "HOTEL",
    dir: "Pje. Libertad 12, Centro",
    lng: -103.3061547,
    lat: 21.7831284,
    recep: { min: 4, km: 2.3 },
    cere: { min: 1, km: 0.2 },
    maps: "https://maps.app.goo.gl/T33Tz415UAbhjAkT7",
  },
  {
    nombre: "Hotel Carlos",
    tipo: "HOTEL",
    dir: "Álvaro Obregón 331, Col. Veracruz",
    lng: -103.3070897,
    lat: 21.7767389,
    recep: { min: 5, km: 2.9 },
    cere: { min: 1, km: 0.7 },
    maps: "https://maps.app.goo.gl/pVsSEupSmTuDrMFm9",
  },
];

const MAPLIBRE_JS = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js";
const MAPLIBRE_CSS = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    maplibregl?: any;
  }
}

function cargarMapLibre(): Promise<any> {
  if (window.maplibregl) return Promise.resolve(window.maplibregl);
  return new Promise((res, rej) => {
    if (!document.querySelector(`link[href="${MAPLIBRE_CSS}"]`)) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = MAPLIBRE_CSS;
      document.head.appendChild(l);
    }
    const prev = document.querySelector(`script[src="${MAPLIBRE_JS}"]`) as HTMLScriptElement | null;
    const s = prev ?? document.createElement("script");
    s.addEventListener("load", () => res(window.maplibregl));
    s.addEventListener("error", rej);
    if (!prev) {
      s.src = MAPLIBRE_JS;
      s.async = true;
      document.head.appendChild(s);
    }
  });
}

/* Recolorea el estilo positron a marfil / cobalto */
function recolorear(map: any) {
  const layers = map.getStyle().layers as any[];
  for (const l of layers) {
    try {
      if (l.type === "background") map.setPaintProperty(l.id, "background-color", "#FBF8E6");
      else if (l.type === "fill") {
        if (/water/.test(l.id)) map.setPaintProperty(l.id, "fill-color", "#C9D6EE");
        else if (/park|wood|grass|landcover|landuse/.test(l.id)) map.setPaintProperty(l.id, "fill-color", "#EEF0DA");
        else if (/building/.test(l.id)) map.setPaintProperty(l.id, "fill-color", "#ECE6CF");
      } else if (l.type === "line") {
        if (/water|river/.test(l.id)) map.setPaintProperty(l.id, "line-color", "#B5C6E8");
        else if (/highway|road|street|path|bridge|tunnel/.test(l.id)) map.setPaintProperty(l.id, "line-color", /minor|service|path|track/.test(l.id) ? "#E7E1C6" : "#FFFFFF");
        else if (/boundary/.test(l.id)) map.setPaintProperty(l.id, "line-color", "#9fb2d8");
      } else if (l.type === "symbol") {
        map.setPaintProperty(l.id, "text-color", "#2B4C93");
        map.setPaintProperty(l.id, "text-halo-color", "#FBF8E6");
      }
    } catch {
      /* capa sin esa propiedad */
    }
  }
}

function etiqueta(texto: string) {
  const el = document.createElement("div");
  el.className = "hm-lugar";
  el.innerHTML =
    `<span class="hm-lugar-pill"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>${texto}</span>` +
    `<span class="hm-lugar-pico"></span>`;
  return el;
}

function Mapa({ visible, sel, onSel }: { visible: boolean; sel: number | null; onSel: (i: number) => void }) {
  const caja = useRef<HTMLDivElement>(null);
  const mapa = useRef<any>(null);
  const marcas = useRef<HTMLElement[]>([]);
  const encuadrar = useRef<(() => void) | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!visible || mapa.current || !caja.current) return;
    let vivo = true;
    cargarMapLibre()
      .then((ml) => {
        if (!vivo || !caja.current) return;
        const map = new ml.Map({
          container: caja.current,
          style: "https://tiles.openfreemap.org/styles/positron",
          center: [RECEPCION.lng, RECEPCION.lat],
          zoom: 13,
          attributionControl: { compact: true },
          cooperativeGestures: true,
        });
        mapa.current = map;
        map.addControl(new ml.NavigationControl({ showCompass: false }), "top-right");
        map.on("load", () => {
          recolorear(map);
          new ml.Marker({ element: etiqueta("RECEPCIÓN"), anchor: "bottom" }).setLngLat([RECEPCION.lng, RECEPCION.lat]).addTo(map);
          new ml.Marker({ element: etiqueta("CEREMONIA"), anchor: "bottom" }).setLngLat([CEREMONIA.lng, CEREMONIA.lat]).addTo(map);
          marcas.current = HOTELES.map((h, i) => {
            const el = document.createElement("button");
            el.type = "button";
            el.className = "hm-num";
            el.setAttribute("aria-label", h.nombre);
            el.innerHTML = `<span>${i + 1}</span><em>${h.nombre} · ${h.recep.min} min a la recepción</em>`;
            el.addEventListener("click", (e) => {
              e.stopPropagation();
              onSel(i);
            });
            new ml.Marker({ element: el }).setLngLat([h.lng, h.lat]).addTo(map);
            return el;
          });
          const b = new ml.LngLatBounds();
          [RECEPCION, CEREMONIA, ...HOTELES].forEach((p) => b.extend([p.lng, p.lat]));
          encuadrar.current = () => {
            map.resize();
            map.fitBounds(b, { padding: { top: 70, bottom: 40, left: 50, right: 70 }, duration: 0, maxZoom: 15 });
          };
          encuadrar.current();
          setTimeout(() => encuadrar.current?.(), 800);
          caja.current?.querySelector(".maplibregl-ctrl-attrib")?.classList.remove("maplibregl-compact-show");
        });
      })
      .catch(() => setError(true));
    return () => {
      vivo = false;
    };
  }, [visible, onSel]);

  useEffect(() => {
    if (mapa.current && visible) setTimeout(() => encuadrar.current?.(), 750);
  }, [visible]);

  useEffect(() => {
    marcas.current.forEach((el, i) => el.classList.toggle("on", i === sel));
    if (sel !== null && mapa.current) {
      const h = HOTELES[sel];
      mapa.current.flyTo({ center: [h.lng, h.lat], zoom: 15.5, duration: 1200 });
    }
  }, [sel]);

  return (
    <div className="hm-mapa">
      <div ref={caja} className="hm-canvas" />
      {error && <p className="hm-error font-serif">No se pudo cargar el mapa. Usa los botones “Ver en Maps”.</p>}
    </div>
  );
}

function Distancia({ min, km, a }: { min: number; km: number; a: string }) {
  return (
    <p className="font-serif hl-dist">
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <path d="M5 17h14M6 17l1.5-5h9l1.5 5M8 12l1-3h6l1 3" />
        <circle cx="8" cy="18" r="1.4" />
        <circle cx="16" cy="18" r="1.4" />
      </svg>
      {min} min · {km} km {a}
    </p>
  );
}

export default function HotelsCard() {
  const { t } = useLang();
  const [vista, setVista] = useState<"lista" | "mapa">("lista");
  const [sel, setSel] = useState<number | null>(null);
  const [mapaListo, setMapaListo] = useState(false);
  const esMapa = vista === "mapa";

  useEffect(() => {
    if (esMapa) setMapaListo(true);
  }, [esMapa]);

  return (
    <AnimatedCard className="tex-emboss text-center py-9" anim="slideRight">
      <Stagger>
        <p className="font-script mb-1" style={{ color: "var(--olive-primary)", fontSize: "3rem", lineHeight: 1 }}>
          <Palabras texto={t.hospedaje} />
        </p>
      </Stagger>

      <Stagger>
        <p className="font-serif italic text-lg px-2" style={{ color: "var(--ink-dark)", lineHeight: 1.6 }}>
          {t.hospedajeSub1}
          <br />
          {t.hospedajeSub2}
        </p>
      </Stagger>

      <Stagger>
        <div className="hs-toggle" role="tablist" aria-label="Vista de hospedaje">
          <motion.span
            className="hs-toggle-bg"
            animate={{ x: esMapa ? "100%" : "0%" }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
          <button type="button" role="tab" aria-selected={!esMapa} className={!esMapa ? "on" : ""} onClick={() => setVista("lista")}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" /></svg>
            {t.lista}
          </button>
          <button type="button" role="tab" aria-selected={esMapa} className={esMapa ? "on" : ""} onClick={() => setVista("mapa")}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" /></svg>
            {t.mapa}
          </button>
        </div>
      </Stagger>

      <Stagger>
        <div className="hs-flip">
          <div className={`hs-inner${esMapa ? " volteado" : ""}`}>
            {/* Cara A · lista */}
            <div className="hs-cara hs-lista" aria-hidden={esMapa}>
              {HOTELES.map((h, i) => (
                <motion.div
                  key={h.nombre}
                  className="hl-card"
                  initial={{ opacity: 0, x: i % 2 ? 50 : -50, rotate: i % 2 ? 3 : -3 }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.75, delay: i * 0.12, ease: [0.22, 0.61, 0.36, 1] }}
                >
                  <span className="hl-n font-serif">{String(i + 1).padStart(2, "0")}</span>
                  <div className="hl-body">
                    <p className="font-sans-label hl-tipo">{h.tipo}</p>
                    <p className="font-serif hl-nombre">{h.nombre}</p>
                    <p className="font-serif hl-dir">{h.dir}</p>
                    <Distancia min={h.recep.min} km={h.recep.km} a={t.aLaRecepcion} />
                    <Distancia min={h.cere.min} km={h.cere.km} a={t.aLaCeremonia} />
                    <a href={h.maps} target="_blank" rel="noopener noreferrer" className="btn-map" style={{ marginTop: "0.75rem" }}>
                      <svg className="pin-late" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                      </svg>
                      {t.verMaps}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cara B · mapa */}
            <div className="hs-cara hs-cara-b" aria-hidden={!esMapa}>
              {mapaListo && <Mapa visible={esMapa} sel={sel} onSel={setSel} />}
              <p className="font-serif italic hm-leyenda">{t.mapaLeyenda}</p>
              <div className="hm-chips">
                {HOTELES.map((h, i) => (
                  <button key={h.nombre} type="button" className={`hm-chip${sel === i ? " on" : ""}`} onClick={() => setSel(i)}>
                    <span className="hm-chip-n">{i + 1}</span>
                    <span>
                      <strong>{h.nombre}</strong>
                      <small>{h.recep.min} min {t.aLaRecepcion}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Stagger>
    </AnimatedCard>
  );
}
