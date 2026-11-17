"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import EnvelopeLoader from "./EnvelopeLoader";
import AudioPlayer, { type AudioAPI } from "./AudioPlayer";
import Petals from "./Petals";
import MexBackground from "./MexBackground";
import FloatingMenu from "./FloatingMenu";
import { SecDiv, SalidaBlur } from "./Vida";
import CoverCard from "./cards/CoverCard";
import HeroCard from "./cards/HeroCard";
import VerseCard from "./cards/VerseCard";
import CountdownCard from "./cards/CountdownCard";
import PadrinosCard from "./cards/PadrinosCard";
import CeremonyCard from "./cards/CeremonyCard";
import ReceptionCard from "./cards/ReceptionCard";
import ItineraryCard from "./cards/ItineraryCard";
import GalleryCard from "./cards/GalleryCard";
import WeatherCard from "./cards/WeatherCard";
import DressCodeCard from "./cards/DressCodeCard";
import HotelsCard from "./cards/HotelsCard";
import GiftsCard from "./cards/GiftsCard";
import GiftBoxCard from "./cards/GiftBoxCard";
import AlbumCard from "./cards/AlbumCard";
import RSVPCard from "./cards/RSVPCard";
import { DIA, MES, ANIO } from "../_data/fecha";
import { LangProvider, T } from "../_data/idioma";

function Pie() {
  const t = T.es;
  return (
    <footer className="text-center mt-4 mb-28 lg:mb-10 pie-placa">
      <div className="divider" />
      <p className="font-script mt-4 foil" style={{ fontSize: "2.2rem" }}>
        Luz M&oacute;nica &amp; Juan Diego
      </p>
      <p className="font-sans-label mt-2" style={{ color: "var(--ink-dark)", fontSize: "0.8rem", fontWeight: 600 }}>
        {DIA} &middot; {MES} &middot; {ANIO}
      </p>
      <p className="font-sans-label mt-4" style={{ color: "var(--ink-dark)", fontSize: "0.7rem", fontWeight: 600 }}>
        {t.pieCredito}{" "}
        <a
          href="https://instagram.com/elysium.invitaciones"
          target="_blank"
          rel="noopener noreferrer"
          className="credito-link"
          style={{ color: "var(--olive-soft)", textDecoration: "none" }}
        >
          @ELYSIUM.INVITACIONES
        </a>
      </p>
    </footer>
  );
}

/** Ancla de seccion para el menu flotante (scroll-margin para que no quede pegada arriba). */
function Sec({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div id={id} data-sec={id} className="w-full sec-anchor">
      {children}
    </div>
  );
}

export default function InvitationClient() {
  const [phase, setPhase] = useState<"envelope" | "cards">("envelope");
  const audio = useRef<AudioAPI>(null);

  return (
    <LangProvider>
      <AudioPlayer ref={audio} />

      <AnimatePresence>
        {phase === "envelope" && (
          <EnvelopeLoader
            key="env"
            onOpen={() => setPhase("cards")}
            /* el play va dentro del gesto de abrir el sobre: si se llama
               despues, el navegador lo bloquea por autoplay */
            onTap={() => audio.current?.play()}
          />
        )}
      </AnimatePresence>

      {phase === "cards" && <MexBackground />}
      {phase === "cards" && <Petals />}
      {phase === "cards" && <FloatingMenu />}
      {phase === "cards" && <SalidaBlur />}

      {phase === "cards" && (
        <Sec id="inicio">
          <CoverCard />
        </Sec>
      )}

      {phase === "cards" && (
        <main className="relative z-10 flex flex-col items-center py-8 px-4 max-w-[500px] mx-auto">
          <Sec id="familia">
            <HeroCard />
            <VerseCard />
          </Sec>
          <SecDiv />
          <Sec id="cuenta">
            <CountdownCard />
          </Sec>
          <SecDiv />
          <Sec id="padrinos">
            <PadrinosCard />
          </Sec>
          <SecDiv />
          <Sec id="ubicaciones">
            <CeremonyCard />
            <ReceptionCard />
          </Sec>
          <SecDiv />
          <Sec id="itinerario">
            <ItineraryCard />
          </Sec>
          <SecDiv />
          <Sec id="galeria">
            <GalleryCard />
          </Sec>
          <SecDiv />
          <Sec id="vestimenta">
            <WeatherCard />
            <DressCodeCard />
          </Sec>
          <SecDiv />
          <Sec id="hospedaje">
            <HotelsCard />
          </Sec>
          <SecDiv />
          <Sec id="regalos">
            <GiftsCard />
            <GiftBoxCard />
          </Sec>
          <SecDiv />
          <Sec id="album">
            <AlbumCard />
          </Sec>
          <SecDiv />
          <Sec id="confirmar">
            <RSVPCard />
          </Sec>
          <Pie />
        </main>
      )}
    </LangProvider>
  );
}
