import type { AppSettings } from "../types/settings";

export const DEMO_DEFAULT_SETTINGS: AppSettings = {
  account: {
    username: "Lernfreund",
    email: "lernfreund@example.com"
  },
  ui: {
    theme: "light"
  },
  trainer: {
    audioOnCorrect: true,
    autoFocusInput: true
  },
  accessibility: {
    largeText: false,
    reducedMotion: false,
    highContrast: false
  }
};

export const DEMO_CARD_CONTENT = [
  {
    title: "Tagesfortschritt",
    text: "14 von 20 Vokabeln abgeschlossen."
  },
  {
    title: "Nächste Sitzung",
    text: "Geplant in 45 Minuten."
  },
  {
    title: "Hinweis",
    text: "Öffne die Einstellungen über das Zahnrad unten rechts."
  }
] as const;
