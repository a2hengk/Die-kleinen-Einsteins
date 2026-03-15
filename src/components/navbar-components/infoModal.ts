import { createManagedModal } from "./modalUtils";

export interface InfoModalOptions {
  mount?: HTMLElement;
  onOpenStateChange?: (isOpen: boolean) => void;
}

export interface InfoModalController {
  open: () => void;
  close: () => void;
  destroy: () => void;
}

const INFO_SECTIONS = [
  {
    title: "Karteikasten",
    text: "Hier kannst du auf alle deine Vokabeln zugreifen."
  },
  {
    title: "Selbstlernen",
    text: "Hier kannst du dein Wissen selbst überprüfen."
  },
  {
    title: "Abfragen",
    text: "30 Vokabeln werden abgefragt und am Ende kannst du deinen Fortschritt mit einer Statistik überprüfen."
  }
] as const;

export const createInfoModal = (
  options: InfoModalOptions
): InfoModalController => {
  const modal = createManagedModal({
    mount: options.mount ?? document.body,
    dialogId: "vocab-info-dialog",
    titleId: "vocab-info-title",
    titleText: "Info",
    closeLabel: "Info schließen",
    onOpenStateChange: options.onOpenStateChange
  });

  const body = document.createElement("div");
  body.className = "vocab-info__body";

  INFO_SECTIONS.forEach((section) => {
    const article = document.createElement("article");
    article.className = "vocab-info__section";

    const heading = document.createElement("h3");
    heading.className = "vocab-info__heading";
    heading.textContent = `${section.title}:`;

    const text = document.createElement("p");
    text.className = "vocab-info__text";
    text.textContent = section.text;

    article.append(heading, text);
    body.append(article);
  });

  modal.dialog.append(body);

  return {
    open: modal.open,
    close: modal.close,
    destroy: modal.destroy
  };
};
