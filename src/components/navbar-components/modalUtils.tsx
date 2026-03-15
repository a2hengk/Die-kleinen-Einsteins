const FOCUSABLE =
  'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';

interface ManagedModalOptions {
  mount: HTMLElement;
  dialogId: string;
  titleId: string;
  titleText: string;
  closeLabel: string;
  onOpenStateChange?: (isOpen: boolean) => void;
}

export interface ManagedModalController {
  overlay: HTMLDivElement;
  dialog: HTMLElement;
  title: HTMLHeadingElement;
  closeButton: HTMLButtonElement;
  open: () => void;
  close: () => void;
  destroy: () => void;
}

export const getFocusableElements = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => !element.hasAttribute("disabled") && element.tabIndex !== -1
  );

export const setModalVisibility = (
  overlay: HTMLElement,
  isVisible: boolean
): void => {
  overlay.hidden = !isVisible;
  overlay.setAttribute("aria-hidden", isVisible ? "false" : "true");
  document.body.classList.toggle("vocab-settings--open", isVisible);
};

export const handleFocusTrap = (
  event: KeyboardEvent,
  dialog: HTMLElement
): void => {
  if (event.key !== "Tab") return;
  const all = getFocusableElements(dialog);
  const first = all[0];
  const last = all[all.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  }
  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

export const configureDialogTrigger = (
  button: HTMLButtonElement,
  controlsId: string
): void => {
  button.setAttribute("aria-haspopup", "dialog");
  button.setAttribute("aria-controls", controlsId);
  button.setAttribute("aria-expanded", "false");
};

export const createManagedModal = (
  options: ManagedModalOptions
): ManagedModalController => {
  const overlay = document.createElement("div");
  overlay.className = "vocab-settings__overlay";
  setModalVisibility(overlay, false);

  const dialog = document.createElement("section");
  dialog.id = options.dialogId;
  dialog.className = "vocab-settings__dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", options.titleId);
  dialog.tabIndex = -1;

  const header = document.createElement("header");
  header.className = "vocab-settings__header";

  const title = document.createElement("h2");
  title.className = "vocab-settings__title";
  title.id = options.titleId;
  title.textContent = options.titleText;

  const closeButton = document.createElement("button");
  closeButton.className = "vocab-settings__close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", options.closeLabel);
  closeButton.textContent = "x";

  header.append(title, closeButton);
  dialog.append(header);
  overlay.append(dialog);
  options.mount.append(overlay);

  let isOpen = false;
  let previousFocus: HTMLElement | null = null;

  const close = (): void => {
    if (!isOpen) return;
    setModalVisibility(overlay, false);
    isOpen = false;
    document.removeEventListener("keydown", onKeydown);
    options.onOpenStateChange?.(false);
    previousFocus?.focus();
  };

  const onKeydown = (event: KeyboardEvent): void => {
    if (!isOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    handleFocusTrap(event, dialog);
  };

  const open = (): void => {
    if (isOpen) return;
    previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setModalVisibility(overlay, true);
    isOpen = true;
    document.addEventListener("keydown", onKeydown);
    options.onOpenStateChange?.(true);
    title.tabIndex = -1;
    title.focus();
  };

  closeButton.addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });

  return {
    overlay,
    dialog,
    title,
    closeButton,
    open,
    close,
    destroy: () => {
      close();
      overlay.remove();
    }
  };
};
