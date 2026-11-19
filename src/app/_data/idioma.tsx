"use client";

/**
 * Textos de la invitacion de Luz Mónica & Juan Diego.
 *
 * La plantilla base era bilingue (selector de idioma al entrar); esta boda es
 * solo en español, asi que se quedo un unico idioma y sin pantalla de idioma.
 * Se conserva el hook `useLang()` para que los componentes no cambien.
 *
 * Los textos que escribio el cliente (lluvia de sobres, transferencia,
 * itinerario) van literales.
 */
import { createContext, useContext, type ReactNode } from "react";

export type Lang = "es";

export const T = {
  es: {
    mes: (_m: number, esMes: string) => esMes,
    fechaLarga: "9 de enero de 2027",
    limite: "13 de diciembre de 2026",

    sobreHint: "Toca para abrir",

    portadaEyebrow: "NUESTRA BODA",
    ciudad: "Tlaltenango, Zacatecas",
    ciudadLarga: "Tlaltenango, Zacatecas, México",

    heroAmor1: "Con todo nuestro amor",
    heroAmor2: "y el de nuestras familias",
    padresNovio: "Padres del novio",
    padresNovia: "Padres de la novia",
    heroInvita: "Tenemos el honor de invitarles a",
    heroBoda: "nuestra boda",

    frase: "Te elegiría a ti una y mil veces, en esta y en todas mis vidas.",

    faltan: "Faltan",
    dias: "Días",
    horas: "Horas",
    minutos: "Minutos",
    segundos: "Segundos",
    granDia: "para el gran día",

    padrinosEyebrow: "NUESTROS PADRINOS",

    ceremonia: "Ceremonia Religiosa",
    horaCeremonia: "5:00 PM",
    zonaIglesia: "Centro · Tlaltenango, Zacatecas",
    irUbicacion: "IR A UBICACIÓN",

    recepcion: "Recepción",
    horaRecepcion: "7:00 PM",
    dirRecepcion: "P.º de los Cedros No. 62, Hacienda Real · Tlaltenango",

    itinerarioTitulo: "Así celebraremos",
    itinerario: [
      { time: "5:00 p.m.", label: "Ceremonia religiosa", desc: "Parroquia de Nuestra Señora de Guadalupe" },
      { time: "7:00 p.m.", label: "Recepción", desc: "Palapa Don Naty" },
      { time: "7:30 p.m.", label: "Cena", desc: "" },
      { time: "8:30 p.m.", label: "Brindis", desc: "" },
      { time: "9:00 p.m.", label: "Vals", desc: "" },
      { time: "11:00 p.m.", label: "Partida de pastel,\nramo y liga", desc: "" },
      { time: "1:00 a.m.", label: "Fin de la boda", desc: "" },
    ],

    galeriaTitulo: "Nuestros recuerdos",
    galeriaSub: "Toca la foto para verla en grande",
    fotoAnterior: "Foto anterior",
    fotoSiguiente: "Foto siguiente",
    cerrarFoto: "Cerrar foto",

    climaLugar: "TLALTENANGO, ZACATECAS",
    climaTitulo: "El clima",
    cielo: {
      despejado: "Despejado", casiDespejado: "Mayormente despejado", nublado: "Nublado",
      neblina: "Neblina", lluvia: "Lluvia", chubascos: "Chubascos", tormenta: "Tormenta",
    },
    climaTipico: "Tarde templada, noche fría",
    climaDia: "DE DÍA",
    climaNoche: "DE NOCHE",
    climaMax: "MÁXIMA",
    climaMin: "MÍNIMA",
    climaLluvia: "LLUVIA",
    climaEspera: "Los días previos a la boda verás aquí el pronóstico exacto para Tlaltenango.",
    climaNota:
      "En enero las noches en Tlaltenango son frías: te sugerimos traer un abrigo o chamarra para disfrutar la fiesta hasta el final.",

    vestimenta: "Vestimenta",
    etiqueta1: "VAQUERA",
    etiqueta2: "FORMAL",
    dcNota: "Acompáñanos vestido para la ocasión",
    caballeros: "Caballeros",
    damas: "Damas",
    verIdeas: "Ver ideas",
    coloresAviso: "Por favor evitar estos colores",
    colores: ["Blanco", "Rojo"],

    hospedaje: "Hospedaje",
    hospedajeSub1: "Si vienes de fuera, estas son nuestras",
    hospedajeSub2: "recomendaciones cerca de la celebración",
    verMaps: "VER EN MAPS",
    comoLlegar: "CÓMO LLEGAR",
    hotelAnterior: "Hotel anterior",
    hotelSiguiente: "Hotel siguiente",
    lista: "Lista",
    mapa: "Mapa",
    mapaLeyenda: "Toca un número para ver el hotel",
    aLaRecepcion: "a la recepción",
    aLaCeremonia: "a la ceremonia",

    conCarino: "CON CARIÑO",
    lluviaTitulo: "Lluvia de sobres",
    lluviaHint: "Toca para abrir",
    lluviaAbrir: "Sobre: toca para abrir",
    lluvia: [
      "Queremos contarles una noticia muy especial; después de nuestro gran día iniciaremos una nueva aventura juntos, ya tenemos el hogar lleno de amor y cosas lindas.",
      "Queremos que sepan que el mejor regalo para nosotros será compartir la boda con las personas que queremos, sin embargo sabemos que algunos de ustedes querrán tener un detalle con nosotros, así que si así lo desean el día de la boda encontrarán sobres disponibles para quienes deseen hacer un regalo en efectivo.",
    ],

    transfEyebrow: "SI PREFIERES TRANSFERIR",
    transfTitulo: "Un detalle",
    transfSub: "Si no puedes entregarnos tu sobre ese día, aquí te dejamos nuestros datos",
    transfCta: "Toca el detalle",
    transfAbrir: "Abrir el detalle",
    transfGraciasEyebrow: "CON TODO NUESTRO CARIÑO",
    transfGracias: "Gracias",
    cuenta: "Cuenta",
    clabe: "Cuenta CLABE",
    copiar: "COPIAR",
    copiado: "COPIADO",
    cerrar: "Cerrar",

    albumEyebrow: "COMPARTE TUS MOMENTOS",
    albumTitulo: "Álbum de fotos",
    albumSub: "Ayúdanos a guardar cada momento: sube aquí las fotos que tomes durante el evento.",
    albumQrAlt: "Código QR del álbum de fotos",
    albumBtn: "Subir mis fotos",
    albumAviso: "El álbum de fotos se habilita el día del evento. Regresa aquí y sube todas tus fotos de la noche ✨",

    rsvpTitulo: "Confirmación",
    rsvpSub: "Nos encantaría celebrar contigo",
    rsvpTienes: "Tienes",
    rsvpPase: "pase",
    rsvpPases: "pases",
    rsvpPara: "para",
    rsvpSinLink:
      "Para confirmar necesitas abrir el enlace personalizado que te enviaron por WhatsApp. Ese enlace lleva los nombres de tu invitación; si lo abres desde un reenvío o escribiendo la dirección a mano, no podemos identificarla.",
    rsvpNotaUno: "Tienes 1 pase reservado para ti.",
    rsvpNotaVarios: (n: number) =>
      `Tienes ${n} pases reservados. Aumenta el número de pases que vayas a ocupar.`,
    rsvpTodos: "Estás usando todos tus pases",
    rsvpDePases: (usa: number, total: number) => `${usa} de ${total} pases`,
    rsvpQuitarPase: "Quitar un pase",
    rsvpAgregarPase: "Agregar un pase",
    rsvpTuNombre: "Tu nombre completo",
    rsvpNombreN: (i: number) => `Nombre del invitado ${i}`,
    rsvpElige: "Por favor selecciona si asistirás o no.",
    rsvpUnNombre: "Por favor escribe al menos un nombre.",
    rsvpFaltan: (usa: number, escritos: number, faltan: number) =>
      `Elegiste ${usa} pases pero escribiste ${escritos} nombre${escritos === 1 ? "" : "s"}. ` +
      `Escribe ${faltan === 1 ? "el nombre que falta" : `los ${faltan} nombres que faltan`} ` +
      "o baja el contador a los pases que vas a utilizar.",
    rsvpSi: "Asistiré",
    rsvpAsistira: "Asistirá",
    rsvpNoAsistira: "No asistirá",
    rsvpNotaAsignados: "Confirma la asistencia de cada persona de tu invitación.",
    rsvpEligeCada: "Elige una respuesta para cada persona.",
    rsvpNo: "No asistiré",
    rsvpEnviar: "Confirmar asistencia",
    rsvpVencido: "Fecha límite alcanzada",
    rsvpModificar: "Modificar mi respuesta",
    rsvpActualizar: "Actualizar respuesta",
    rsvpEnviando: "Enviando…",
    rsvpCerradas: "Confirmaciones cerradas",
    rsvpNoDisponible: "Enlace no disponible",
    rsvpReintentar: "Reintentar",
    rsvpGraciasNo: "Gracias por avisarnos",
    rsvpGraciasNoSub: "Lamentamos que no puedan acompañarnos. Los vamos a extrañar.",
    rsvpGraciasSi: "¡Gracias por confirmar!",
    rsvpEsperamos: (n: string) => `Te esperamos, ${n}.`,
    rsvpConfirmados: (n: number, l: string) => `Confirmamos ${n} lugares: ${l}.`,
    rsvpLimite: "Confirma tu asistencia antes del",
    rsvpLimiteNota:
      "Después de esa fecha solo podremos apartar lugar para quienes ya confirmaron.",
    errLink: "Este enlace ya no está activo. Por favor pide a los novios uno nuevo.",
    errCerradas: "Las confirmaciones ya están cerradas. Por favor avísanos directamente.",
    errEnvio: "Hubo un problema al enviar. Inténtalo de nuevo.",
    errCarga: "No pudimos cargar tu invitación. Recarga la página e inténtalo de nuevo.",
    errIdent: "No pudimos identificar tu invitación. Abre el enlace personalizado que te enviaron por WhatsApp.",
    errRed: "Sin conexión. Revisa tu internet e inténtalo de nuevo.",

    pieCredito: "DISEÑADO POR",
    musicaPlay: "Reproducir música",
    musicaPause: "Pausar música",
  },
} as const;

export type Textos = (typeof T)["es"];

const Ctx = createContext<{ lang: Lang; t: Textos }>({ lang: "es", t: T.es });

export function LangProvider({ children }: { children: ReactNode }) {
  return <Ctx.Provider value={{ lang: "es", t: T.es }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}
