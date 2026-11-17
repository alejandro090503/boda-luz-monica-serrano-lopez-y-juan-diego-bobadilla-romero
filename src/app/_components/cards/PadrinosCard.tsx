"use client";

import { motion } from "framer-motion";
import AnimatedCard, { Stagger } from "../AnimatedCard";
import { OliveBranch } from "../Ornaments";
import { useLang } from "../../_data/idioma";

// Padrinos tal como los entrego el cliente.
const GRUPOS: { titulo: string; nombres: string[] }[] = [
  { titulo: "Velación", nombres: ["Guadalupe Bobadilla", "Gustavo González"] },
  { titulo: "Anillos", nombres: ["Virginia López", "Ramón Godina"] },
  { titulo: "Arras", nombres: ["Jazmin Vázquez", "Alejandro Sánchez"] },
  { titulo: "Biblia y rosario", nombres: ["Ana Díaz", "Mauricio Serrano"] },
  { titulo: "Ramo", nombres: ["Andrea Serrano"] },
];

const EASE = [0.22, 0.61, 0.36, 1] as const;

export default function PadrinosCard() {
  const { t } = useLang();
  return (
    <AnimatedCard className="tex-beige text-center py-8" anim="slideLeft">
      <Stagger>
        <p
          className="font-sans-label"
          style={{ color: "var(--olive-soft)", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.4rem" }}
        >
          {t.padrinosEyebrow}
        </p>
      </Stagger>

      <Stagger>
        <div className="flex justify-center my-3">
          <OliveBranch width={96} color="var(--green-line)" />
        </div>
      </Stagger>

      {GRUPOS.map((g, gi) => (
        <div
          key={g.titulo}
          className={gi > 0 ? "mt-6 pt-6" : ""}
          style={gi > 0 ? { borderTop: "1px solid var(--beige)" } : {}}
        >
          <motion.p
            className="font-script"
            style={{ color: "var(--olive-primary)", fontSize: "2.5rem", lineHeight: 1.1 }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {g.titulo}
          </motion.p>

          <div className="mt-2">
            {g.nombres.map((n, i) => (
              <div key={n}>
                {i > 0 && (
                  <p className="font-script my-0.5" style={{ color: "var(--gold-antique)", fontSize: "1.6rem", lineHeight: 1 }}>
                    &amp;
                  </p>
                )}
                {/* stagger nombre por nombre */}
                <motion.p
                  className="font-serif font-semibold"
                  style={{ color: "var(--ink-dark)", fontSize: "1.4rem", lineHeight: 1.45 }}
                  initial={{ opacity: 0, x: i % 2 ? 18 : -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ delay: 0.12 + i * 0.14, duration: 0.6, ease: EASE }}
                >
                  {n}
                </motion.p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </AnimatedCard>
  );
}
