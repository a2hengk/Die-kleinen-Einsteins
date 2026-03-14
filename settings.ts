export interface AccountSettings {
  username: string;
  email: string;
}

export interface UiSettings {
  theme: "light" | "dark";
}

export interface TrainerSettings {
  audioOnCorrect: boolean;
  autoFocusInput: boolean;
}

export interface AccessibilitySettings {
  largeText: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
}

export interface AppSettings {
  account: AccountSettings;
  ui: UiSettings;
  trainer: TrainerSettings;
  accessibility: AccessibilitySettings;
}
