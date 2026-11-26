export type IslamicEventType = "magal" | "ramadan" | "evenement";

export type IslamicEvent = {
  id: string;
  title: string;
  arabicTitle: string;
  type: IslamicEventType;
  /** Date grégorienne de début, au format AAAA-MM-JJ. */
  date: string;
  /** Libellé hégirien complet, ex. « 18 Safar 1449 ». */
  hijri: string;
  location: string;
  description: string;
  /** Vrai tant que la date n'est pas officiellement confirmée. */
  provisional: boolean;
};

export const eventTypeLabels: Record<IslamicEventType, string> = {
  magal: "Magal",
  ramadan: "Ramadan",
  evenement: "Événement",
};

type EventBase = Omit<IslamicEvent, "date" | "hijri"> & {
  /** Première occurrence grégorienne connue (AAAA-MM-JJ). */
  date: string;
  hijriDay: number;
  hijriMonth: string;
  hijriYear: number;
};

/**
 * Grands rendez-vous de l'année religieuse sénégalaise.
 * Les dates grégoriennes sont les prévisions officielles connues à ce jour ;
 * elles restent soumises à l'observation lunaire (CONACOC).
 */
const EVENT_BASES: EventBase[] = [
  {
    id: "ramadan",
    title: "Début du Ramadan",
    arabicTitle: "غرة رمضان",
    type: "ramadan",
    date: "2027-02-08",
    hijriDay: 1,
    hijriMonth: "Ramadan",
    hijriYear: 1448,
    location: "Sénégal",
    description:
      "Premier jour de jeûne du mois béni de Ramadan, confirmé par l'observation du croissant lunaire.",
    provisional: true,
  },
  {
    id: "laylatul-qadr",
    title: "Nuit du Destin",
    arabicTitle: "ليلة القدر",
    type: "ramadan",
    date: "2027-03-06",
    hijriDay: 27,
    hijriMonth: "Ramadan",
    hijriYear: 1448,
    location: "Sénégal",
    description:
      "La Nuit du Destin, meilleure que mille mois, attendue dans la nuit du 26 au 27 Ramadan.",
    provisional: true,
  },
  {
    id: "korite",
    title: "Korité — Aïd el-Fitr",
    arabicTitle: "عيد الفطر",
    type: "ramadan",
    date: "2027-03-09",
    hijriDay: 1,
    hijriMonth: "Chawwal",
    hijriYear: 1448,
    location: "Sénégal",
    description:
      "Fête de la rupture du jeûne, célébrée le premier jour de Chawwal après l'annonce du croissant.",
    provisional: true,
  },
  {
    id: "tabaski",
    title: "Tabaski — Aïd el-Adha",
    arabicTitle: "عيد الأضحى",
    type: "evenement",
    date: "2027-05-17",
    hijriDay: 10,
    hijriMonth: "Dhou al-Hijja",
    hijriYear: 1448,
    location: "Sénégal",
    description:
      "Fête du sacrifice, célébrée le 10 Dhou al-Hijja en mémoire du sacrifice d'Ibrahim (PSL).",
    provisional: true,
  },
  {
    id: "tamkharit",
    title: "Tamkharit — Achoura",
    arabicTitle: "عاشوراء",
    type: "evenement",
    date: "2027-06-15",
    hijriDay: 10,
    hijriMonth: "Muharram",
    hijriYear: 1449,
    location: "Sénégal",
    description:
      "Jour d'Achoura, dixième jour de Muharram, marqué par le jeûne et les invocations.",
    provisional: true,
  },
  {
    id: "magal",
    title: "Grand Magal de Touba",
    arabicTitle: "المغال الكبير",
    type: "magal",
    date: "2027-07-23",
    hijriDay: 18,
    hijriMonth: "Safar",
    hijriYear: 1449,
    location: "Touba",
    description:
      "Commémoration du départ en exil de Cheikh Ahmadou Bamba en 1895. Le 18 Safar, des millions de fidèles se rendent à Touba.",
    provisional: true,
  },
  {
    id: "gamou",
    title: "Gamou — Mawlid an-Nabi",
    arabicTitle: "المولد النبوي",
    type: "evenement",
    date: "2027-08-14",
    hijriDay: 12,
    hijriMonth: "Rabi al-Awwal",
    hijriYear: 1449,
    location: "Tivaouane · Touba",
    description:
      "Premier jour de Gâmmu : célébration de la naissance du Prophète Muhammad (PSL), rythmée par les récitations de khassaïdes.",
    provisional: true,
  },
];

const DAY_MS = 86_400_000;

function addDays(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function startOfDay(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Nombre de jours (positif ou négatif) entre aujourd'hui et une date ISO. */
export function daysUntil(iso: string, from: Date = new Date()): number {
  const [year, month, day] = iso.split("-").map(Number);
  return Math.round((Date.UTC(year, month - 1, day) - startOfDay(from)) / DAY_MS);
}

export function formatEventDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatEventDateShort(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

/** Date hégirienne du jour (calendrier Umm al-Qura, en français). */
export function hijriToday(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("fr-FR-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(date)
    .replace(" AH", " H");
}

/**
 * Occurrences à venir : chaque date de base est projetée d'une année lunaire
 * (354 jours) pour garder l'agenda vivant les années suivantes.
 */
export function upcomingEvents(from: Date = new Date(), horizon = 2): IslamicEvent[] {
  const events: IslamicEvent[] = [];

  for (const base of EVENT_BASES) {
    for (let offset = 0; offset <= horizon; offset += 1) {
      const date = addDays(base.date, offset * 354);
      if (daysUntil(date, from) < 0) continue;
      events.push({
        ...base,
        id: `${base.id}-${base.hijriYear + offset}`,
        date,
        hijri: `${base.hijriDay} ${base.hijriMonth} ${base.hijriYear + offset}`,
      });
    }
  }

  return events.sort((a, b) => a.date.localeCompare(b.date));
}

/** Prochain événement d'un type donné (Ramadan par défaut). */
export function nextEvent(
  type: IslamicEventType = "ramadan",
  from: Date = new Date()
): IslamicEvent | null {
  return upcomingEvents(from).find((event) => event.type === type) ?? null;
}
