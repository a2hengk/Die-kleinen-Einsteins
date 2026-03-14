import { DEMO_DEFAULT_SETTINGS } from "../data/demoData";
import type { AppSettings } from "../types/settings";
import { createManagedModal } from "./modalUtils";

export interface SettingsModalOptions {
  mount?: HTMLElement;
  onOpenStateChange?: (isOpen: boolean) => void;
}

export interface SettingsModalController {
  open: () => void;
  close: () => void;
  getSettings: () => AppSettings;
  subscribe: (listener: (settings: AppSettings) => void) => () => void;
  destroy: () => void;
}

type TextField = {
  wrap: HTMLDivElement;
  inputWrap: HTMLDivElement;
  input: HTMLInputElement;
  error: HTMLParagraphElement;
};

type ToggleField = {
  wrap: HTMLLabelElement;
  input: HTMLInputElement;
};

const THEME_QUERY = "(prefers-color-scheme: dark)";
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clone = (settings: AppSettings): AppSettings => ({
  account: { ...settings.account },
  ui: { ...settings.ui },
  trainer: { ...settings.trainer },
  accessibility: { ...settings.accessibility }
});

const preferredTheme = (): "light" | "dark" =>
  window.matchMedia(THEME_QUERY).matches ? "dark" : "light";

const preferredReducedMotion = (): boolean =>
  window.matchMedia(MOTION_QUERY).matches;

const applyPreferences = (settings: AppSettings): void => {
  const root = document.documentElement;
  root.setAttribute("data-theme", settings.ui.theme);
  root.setAttribute("data-large-text", String(settings.accessibility.largeText));
  root.setAttribute(
    "data-high-contrast",
    String(settings.accessibility.highContrast)
  );
  root.setAttribute(
    "data-reduced-motion",
    String(settings.accessibility.reducedMotion || preferredReducedMotion())
  );
};

const read = (): AppSettings => {
  const base = clone(DEMO_DEFAULT_SETTINGS);
  base.ui.theme = preferredTheme();
  base.accessibility.reducedMotion = preferredReducedMotion();
  return base;
};

const formatElapsed = (startedAt: number): string => {
  const seconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${secs}`;
};

const createSection = (title: string): HTMLFieldSetElement => {
  const section = document.createElement("fieldset");
  section.className = "vocab-settings__section";

  const legend = document.createElement("legend");
  legend.textContent = title;

  section.append(legend);
  return section;
};

const textInput = (
  id: string,
  label: string,
  type: string,
  value: string,
  helpText: string
): TextField => {
  const wrap = document.createElement("div");
  wrap.className = "vocab-settings__field";

  const inputWrap = document.createElement("div");
  inputWrap.className = "vocab-settings__input-wrap";

  const labelElement = document.createElement("label");
  labelElement.className = "vocab-settings__label";
  labelElement.htmlFor = id;
  labelElement.textContent = label;

  const input = document.createElement("input");
  input.className = "vocab-settings__input";
  input.id = id;
  input.type = type;
  input.value = value;

  const help = document.createElement("p");
  help.className = "vocab-settings__help";
  help.id = `${id}-help`;
  help.textContent = helpText;

  const error = document.createElement("p");
  error.className = "vocab-settings__error";
  error.id = `${id}-error`;
  error.hidden = true;

  input.setAttribute("aria-describedby", `${help.id} ${error.id}`);
  inputWrap.append(input);
  wrap.append(labelElement, inputWrap, help, error);
  return { wrap, inputWrap, input, error };
};

const passwordInput = (
  id: string,
  label: string,
  helpText: string
): TextField => {
  const field = textInput(id, label, "password", "", helpText);
  field.inputWrap.className = "vocab-settings__input-row";

  const toggleButton = document.createElement("button");
  toggleButton.className = "vocab-settings__secondary-button";
  toggleButton.type = "button";
  toggleButton.textContent = "Anzeigen";
  toggleButton.setAttribute("aria-pressed", "false");
  toggleButton.addEventListener("click", () => {
    const reveal = field.input.type === "password";
    field.input.type = reveal ? "text" : "password";
    toggleButton.textContent = reveal ? "Verbergen" : "Anzeigen";
    toggleButton.setAttribute("aria-pressed", reveal ? "true" : "false");
  });

  field.inputWrap.append(toggleButton);
  return field;
};

const toggleInput = (
  id: string,
  label: string,
  helpText: string,
  checked: boolean
): ToggleField => {
  const wrap = document.createElement("label");
  wrap.className = "vocab-settings__toggle";
  wrap.htmlFor = id;

  const textWrap = document.createElement("span");
  textWrap.className = "vocab-settings__toggle-text";

  const labelElement = document.createElement("span");
  labelElement.className = "vocab-settings__label";
  labelElement.textContent = label;

  const help = document.createElement("span");
  help.className = "vocab-settings__help";
  help.id = `${id}-help`;
  help.textContent = helpText;

  const input = document.createElement("input");
  input.className = "vocab-settings__switch";
  input.id = id;
  input.type = "checkbox";
  input.checked = checked;
  input.setAttribute("role", "switch");
  input.setAttribute("aria-describedby", help.id);

  textWrap.append(labelElement, help);
  wrap.append(textWrap, input);
  return { wrap, input };
};

const timerField = (
  id: string,
  label: string,
  helpText: string
): { wrap: HTMLDivElement; value: HTMLParagraphElement } => {
  const wrap = document.createElement("div");
  wrap.className = "vocab-settings__field";

  const labelElement = document.createElement("p");
  labelElement.className = "vocab-settings__label";
  labelElement.id = `${id}-label`;
  labelElement.textContent = label;

  const value = document.createElement("p");
  value.className = "vocab-settings__timer";
  value.setAttribute("role", "timer");
  value.setAttribute("aria-labelledby", labelElement.id);

  const help = document.createElement("p");
  help.className = "vocab-settings__help";
  help.textContent = helpText;

  wrap.append(labelElement, value, help);
  return { wrap, value };
};

const clearFieldError = (field: TextField): void => {
  field.error.hidden = true;
  field.error.textContent = "";
  field.input.removeAttribute("aria-invalid");
};

const setFieldError = (field: TextField, message: string): void => {
  field.error.hidden = false;
  field.error.textContent = message;
  field.input.setAttribute("aria-invalid", "true");
};

export const createSettingsModal = (
  options: SettingsModalOptions
): SettingsModalController => {
  const startedAt = Date.now();
  const state = read();
  applyPreferences(state);

  const listeners = new Set<(settings: AppSettings) => void>();
  const modal = createManagedModal({
    mount: options.mount ?? document.body,
    dialogId: "vocab-settings-dialog",
    titleId: "vocab-settings-title",
    titleText: "Einstellungen",
    closeLabel: "Einstellungen schließen",
    onOpenStateChange: options.onOpenStateChange
  });

  const form = document.createElement("form");
  form.className = "vocab-settings__form";
  form.noValidate = true;

  const toast = document.createElement("p");
  toast.className = "vocab-settings__toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.hidden = true;

  const username = textInput(
    "vocab-settings-username",
    "Benutzername",
    "text",
    state.account.username,
    "Wird in der Lernübersicht angezeigt."
  );
  const email = textInput(
    "vocab-settings-email",
    "E-Mail",
    "email",
    state.account.email,
    "Für Benachrichtigungen und Wiederherstellung."
  );
  const currentPw = passwordInput(
    "vocab-settings-current-password",
    "Aktuelles Passwort",
    "Nur Demo: Keine echte Serverprüfung."
  );
  currentPw.input.autocomplete = "current-password";

  const newPw = passwordInput(
    "vocab-settings-new-password",
    "Neues Passwort",
    "Mindestens 8 Zeichen."
  );
  newPw.input.autocomplete = "new-password";

  const confirmPw = passwordInput(
    "vocab-settings-confirm-password",
    "Passwort bestätigen",
    "Muss dem neuen Passwort entsprechen."
  );
  confirmPw.input.autocomplete = "new-password";

  const darkMode = toggleInput(
    "vocab-settings-theme",
    "Dark Mode",
    "Schaltet zwischen hellem und dunklem Design um.",
    state.ui.theme === "dark"
  );
  const sessionTimer = timerField(
    "vocab-settings-session-timer",
    "Sitzungslänge",
    "Zeigt die Zeit seit dem Start der App."
  );
  const audio = toggleInput(
    "vocab-settings-audio-correct",
    "Audio bei richtiger Antwort",
    "Spielt ein Signal bei korrekter Antwort.",
    state.trainer.audioOnCorrect
  );
  const autoFocus = toggleInput(
    "vocab-settings-auto-focus",
    "Auto-Fokus auf Eingabefeld in Übungen",
    "Setzt den Cursor automatisch in das Eingabefeld.",
    state.trainer.autoFocusInput
  );
  const largeText = toggleInput(
    "vocab-settings-large-text",
    "Große Schrift",
    "Erhöht die Grundschriftgröße.",
    state.accessibility.largeText
  );
  const reducedMotion = toggleInput(
    "vocab-settings-reduced-motion",
    "Reduzierte Animationen",
    "Reduziert Übergänge und Animationen.",
    state.accessibility.reducedMotion
  );
  const highContrast = toggleInput(
    "vocab-settings-high-contrast",
    "Hoher Kontrast",
    "Verstärkt den Kontrast für bessere Lesbarkeit.",
    state.accessibility.highContrast
  );

  const accountSection = createSection("Account und Profil");
  accountSection.append(
    username.wrap,
    email.wrap,
    currentPw.wrap,
    newPw.wrap,
    confirmPw.wrap
  );

  const uiSection = createSection("Benutzeroberfläche");
  uiSection.append(darkMode.wrap);

  const trainerSection = createSection("Vokabeltraining");
  trainerSection.append(sessionTimer.wrap, audio.wrap, autoFocus.wrap);

  const accessibilitySection = createSection("Barrierefreiheit");
  accessibilitySection.append(
    largeText.wrap,
    reducedMotion.wrap,
    highContrast.wrap
  );

  const actions = document.createElement("div");
  actions.className = "vocab-settings__actions";

  const save = document.createElement("button");
  save.className = "vocab-settings__save";
  save.type = "submit";
  save.textContent = "Speichern";
  actions.append(save);

  form.append(
    accountSection,
    uiSection,
    trainerSection,
    accessibilitySection,
    actions,
    toast
  );
  modal.dialog.append(form);

  const passwordFields = [currentPw, newPw, confirmPw] as const;
  const previewInputs = [
    darkMode.input,
    largeText.input,
    reducedMotion.input,
    highContrast.input
  ] as const;

  const notify = (): void => {
    listeners.forEach((listener) => listener(clone(state)));
  };

  const clearErrors = (): void => {
    [username, email, ...passwordFields].forEach(clearFieldError);
    toast.hidden = true;
    toast.textContent = "";
  };

  const clearPasswordInputs = (): void => {
    passwordFields.forEach((field) => {
      field.input.value = "";
    });
  };

  const syncFormWithState = (): void => {
    username.input.value = state.account.username;
    email.input.value = state.account.email;
    darkMode.input.checked = state.ui.theme === "dark";
    audio.input.checked = state.trainer.audioOnCorrect;
    autoFocus.input.checked = state.trainer.autoFocusInput;
    largeText.input.checked = state.accessibility.largeText;
    reducedMotion.input.checked = state.accessibility.reducedMotion;
    highContrast.input.checked = state.accessibility.highContrast;
    clearPasswordInputs();
  };

  const updateTimer = (): void => {
    sessionTimer.value.textContent = formatElapsed(startedAt);
  };

  const applyPreviewState = (): void => {
    applyPreferences({
      ...state,
      ui: {
        ...state.ui,
        theme: darkMode.input.checked ? "dark" : "light"
      },
      accessibility: {
        ...state.accessibility,
        largeText: largeText.input.checked,
        reducedMotion: reducedMotion.input.checked,
        highContrast: highContrast.input.checked
      }
    });
  };

  const resetDemoState = (): void => {
    clearErrors();
    syncFormWithState();
    applyPreferences(state);
  };

  const open = (): void => {
    resetDemoState();
    updateTimer();
    modal.open();
  };

  updateTimer();
  const timerId = window.setInterval(updateTimer, 1000);

  previewInputs.forEach((input) => {
    input.addEventListener("change", applyPreviewState);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();

    const usernameValue = username.input.value.trim();
    const emailValue = email.input.value.trim();
    const hasPasswordInput = passwordFields.some((field) => field.input.value);

    let valid = true;
    if (!usernameValue) {
      valid = false;
      setFieldError(username, "Benutzername darf nicht leer sein.");
    }
    if (!EMAIL_PATTERN.test(emailValue)) {
      valid = false;
      setFieldError(email, "Bitte gib eine gültige E-Mail-Adresse ein.");
    }
    if (hasPasswordInput && newPw.input.value.length < 8) {
      valid = false;
      setFieldError(newPw, "Neues Passwort muss mindestens 8 Zeichen lang sein.");
    }
    if (hasPasswordInput && newPw.input.value !== confirmPw.input.value) {
      valid = false;
      setFieldError(confirmPw, "Passwort-Bestätigung stimmt nicht überein.");
    }

    if (!valid) {
      form.querySelector<HTMLInputElement>("[aria-invalid='true']")?.focus();
      return;
    }

    toast.hidden = false;
    toast.textContent = "Demo-Modus: Es wird nichts gespeichert.";
    notify();
  });

  const themeMedia = window.matchMedia(THEME_QUERY);
  const handleThemeChange = (): void => {
    state.ui.theme = themeMedia.matches ? "dark" : "light";
    darkMode.input.checked = state.ui.theme === "dark";
    applyPreferences(state);
  };
  themeMedia.addEventListener("change", handleThemeChange);

  const motionMedia = window.matchMedia(MOTION_QUERY);
  const handleMotionChange = (): void => {
    if (!state.accessibility.reducedMotion) applyPreferences(state);
  };
  motionMedia.addEventListener("change", handleMotionChange);

  return {
    open,
    close: () => {
      resetDemoState();
      modal.close();
    },
    getSettings: () => clone(state),
    subscribe: (listener) => {
      listeners.add(listener);
      listener(clone(state));
      return () => {
        listeners.delete(listener);
      };
    },
    destroy: () => {
      if (timerId !== null) window.clearInterval(timerId);
      themeMedia.removeEventListener("change", handleThemeChange);
      motionMedia.removeEventListener("change", handleMotionChange);
      listeners.clear();
      modal.destroy();
    }
  };
};
