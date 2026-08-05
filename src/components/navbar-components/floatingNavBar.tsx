import {
  fetchCurrentUser,
  logout,
  type AuthUser
} from "@/lib/api/auth";

export interface MountFloatingNavBarOptions {
  mount: HTMLElement;
  onNavigate: (itemId: string) => void;
  onOpenInfo: () => void;
  onOpenSettings: () => void;
}

export interface FloatingNavBarController {
  destroy: () => void;
  getInfoButton: () => HTMLButtonElement;
  getSettingsButton: () => HTMLButtonElement;
}

const AUTH_EVENT_NAME = "vocab-auth-change";

const NAV_ITEMS = [
  { id: "info", label: "i", ariaLabel: "Info" },
  { id: "karteikasten", label: "Karteikasten", ariaLabel: "Karteikasten" },
  { id: "selbstlernen", label: "Selbstlernen", ariaLabel: "Selbstlernen" },
  { id: "abfragen", label: "Abfragen", ariaLabel: "Abfragen" }
] as const;

const getCurrentNavId = (): string => {
  const path = window.location.pathname;

  if (path.startsWith("/selfstudy")) return "selbstlernen";
  if (path.startsWith("/abfrage")) return "abfragen";
  if (path.startsWith("/anmeldung")) return "anmeldung";
  if (path === "/") return "anmeldung";
  return "karteikasten";
};

// Zahnrad wurde mit Hilfe von KI hergestellt
const createGearIcon = (): SVGSVGElement => {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("vocab-nav__icon");

  const path = document.createElementNS(ns, "path");
  path.setAttribute(
    "d",
    "M19.14 12.94a7.44 7.44 0 0 0 .05-.94 7.44 7.44 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.18 7.18 0 0 0-1.63-.94l-.36-2.54A.49.49 0 0 0 13.9 2h-3.8a.49.49 0 0 0-.49.42l-.36 2.54c-.58.23-1.12.54-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.48a.5.5 0 0 0 .12.64l2.03 1.58c-.03.31-.05.63-.05.94s.02.63.05.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.13.23.4.32.6.22l2.39-.96c.51.4 1.05.71 1.63.94l.36 2.54c.04.24.24.42.49.42h3.8c.25 0 .45-.18.49-.42l.36-2.54c.58-.23 1.12-.54 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z"
  );

  svg.append(path);
  return svg;
};

export const mountFloatingNavBar = (
  options: MountFloatingNavBarOptions
): FloatingNavBarController => {
  const { mount, onNavigate, onOpenInfo, onOpenSettings } = options;
  let currentUser: AuthUser | null = null;

  const nav = document.createElement("nav");
  nav.className = "vocab-nav";
  nav.setAttribute("aria-label", "Hauptnavigation");

  const list = document.createElement("ul");
  list.className = "vocab-nav__list";

  const buttons = new Map<string, HTMLButtonElement>();

  const setActiveButton = (itemId: string): void => {
    buttons.forEach((button, id) => {
      const isActive = id === itemId;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });
  };

  NAV_ITEMS.forEach((item) => {
    const li = document.createElement("li");
    li.className = "vocab-nav__item";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "vocab-nav__button";
    button.textContent = item.label;
    button.dataset.navId = item.id;
    button.setAttribute("aria-label", item.ariaLabel);

    button.addEventListener("click", async () => {
      if (item.id === "info") {
        onOpenInfo();
        return;
      }

      currentUser = await fetchCurrentUser().catch(() => null);
      if (!currentUser) {
        setActiveButton("anmeldung");
        window.location.assign("/anmeldung");
        return;
      }

      setActiveButton(item.id);
      onNavigate(item.id);
    });

    li.append(button);
    list.append(li);
    buttons.set(item.id, button);
  });

  const authLi = document.createElement("li");
  authLi.className = "vocab-nav__item vocab-nav__item--auth";

  const authButton = document.createElement("button");
  authButton.type = "button";
  authButton.className = "vocab-nav__button vocab-nav__button--auth";
  authButton.dataset.navId = "anmeldung";

  const updateAuthButton = (): void => {
    const isLoggedIn = currentUser !== null;

    authButton.textContent = isLoggedIn ? "Logout" : "Login";
    authButton.setAttribute(
      "aria-label",
      currentUser ? `Abmelden von ${currentUser.username}` : "Zur Anmeldung"
    );
    authButton.classList.toggle("is-logout", isLoggedIn);
  };

  const handleAuthChange = async (): Promise<void> => {
    currentUser = await fetchCurrentUser().catch(() => null);
    updateAuthButton();
  };

  authButton.addEventListener("click", async () => {
    if (currentUser) {
      await logout().catch(() => {});
      currentUser = null;
      window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME));
    }

    setActiveButton("anmeldung");
    window.location.assign("/anmeldung");
  });

  updateAuthButton();
  handleAuthChange();
  window.addEventListener(AUTH_EVENT_NAME, handleAuthChange);

  authLi.append(authButton);
  list.append(authLi);
  buttons.set("anmeldung", authButton);

  const settingsLi = document.createElement("li");
  settingsLi.className = "vocab-nav__item";

  const settingsButton = document.createElement("button");
  settingsButton.type = "button";
  settingsButton.className = "vocab-nav__button vocab-nav__button--icon";
  settingsButton.setAttribute("aria-label", "Einstellungen öffnen");
  settingsButton.append(createGearIcon());
  settingsButton.addEventListener("click", onOpenSettings);

  settingsLi.append(settingsButton);
  list.append(settingsLi);

  nav.append(list);
  mount.append(nav);
  setActiveButton(getCurrentNavId());

  return {
    destroy: () => {
      window.removeEventListener(AUTH_EVENT_NAME, handleAuthChange);
      nav.remove();
    },
    getInfoButton: () => buttons.get("info") as HTMLButtonElement,
    getSettingsButton: () => settingsButton
  };
};
