"use client";

/**
 * Fondo: papel picado que corre hacia la derecha sin fin y, detras, el patron
 * de talavera corriendo hacia la izquierda. Solo transform (GPU), sin JS.
 */
const TIRAS = [
  { top: "4%", dur: 38 },
  { top: "36%", dur: 46 },
  { top: "68%", dur: 42 },
];

export default function MexBackground() {
  return (
    <div className="mx-bg" aria-hidden="true">
      <div className="mx-fondo-mov" />
      {TIRAS.map((t, i) => (
        <div key={i} className="mx-tira-mov" style={{ top: t.top, animationDuration: `${t.dur}s` }} />
      ))}
      <div className="mx-velo" />
    </div>
  );
}
