# Persönlicher Beitrag – Kevin

> Dieses Dokument beschreibt **ausschließlich meinen eigenen Beitrag** zum Projekt "Die kleinen Einsteins" (Karteikarten-Web-App). Andere Teile (z. B. die Abfrage-Seite, gemeinsam genutzte UI-Komponenten wie `Button`, `Input`, `StatusBar`, `Result`, `DonutChart` und die Navbar-Komponenten) wurden von Teamkolleg:innen gebaut oder gemeinsam bearbeitet und werden hier nur erwähnt, soweit meine Seiten sie *verwenden* — nicht als eigener Beitrag beansprucht.
>
> Alle Datei- und Zeilenangaben beziehen sich auf den Stand des Repos zum Zeitpunkt der Erstellung (14.07.2026, Branch `test`). 🔲-Markierungen zeigen, wo noch etwas von mir ergänzt werden muss (Screenshots, persönliche Begründungen, offene Rückfragen).

## Inhaltsverzeichnis

1. [Frontend: Overview-Page & Self-Study-Page](#1-frontend-overview-page--self-study-page)
2. [API-Dokumentation](#2-api-dokumentation)
3. [Datenbank-Schicht](#3-datenbank-schicht)
4. [Docker-Setup](#4-docker-setup)
5. [Webdesign](#5-webdesign)
6. [Übergabe-Hinweise](#6-übergabe-hinweise)

---

## 1. Frontend: Overview-Page & Self-Study-Page

### 1.1 Overview-Page (`/overview`)

**Datei:** [`src/app/overview/page.tsx`](../src/app/overview/page.tsx) (269 Zeilen, Client-Component, `export default function Overview`)
**Styles:** [`src/app/styles/overview-styles/container.module.css`](../src/app/styles/overview-styles/container.module.css) (243 Zeilen, CSS Module)

#### Was die Seite tut / Bedienung

Die Overview-Page ist der "Karteikasten" — die zentrale Übersicht aller eigenen Karteikarten. Sie zeigt die Karten als Grid von Kacheln (`cardContainer` / `cardItem`), jede Kachel mit Vorderseite (`front`) und Rückseite (`back`, ausgeblendet in der Kachel-Vorschau). Über eine leere "Add"-Kachel (`addPlaceholder` / `addIcon`) öffnet sich ein Modal zum Anlegen einer neuen Karte; ein Klick auf eine bestehende Karte öffnet ein Detail-/Bearbeiten-Modal (`detailModal`) mit Editier- und Löschfunktion.

🔲 **TODO (du):** Screenshot der Grid-Ansicht (leer + mit Karten) und des Anlege-/Bearbeiten-Modals hier einfügen, z. B. unter `docs/screenshots/overview-grid.png` und `docs/screenshots/overview-modal.png`, dann hier verlinken.

#### Einbindung ins Gesamtprojekt

- Next.js App Router: `src/app/overview/page.tsx` wird automatisch unter der Route **`/overview`** ausgeliefert.
- Navigation erfolgt über die von Kolleg:innen gebaute Floating-Navbar, die auf der Seite gemountet wird (`mountFloatingNavBar`, Zeilen 17–20, 54–63): Klick auf "selbstlernen" → `router.push("/selfstudy")`, Klick auf "abfragen" → `router.push("/abfrage")`, "karteikasten" ist die aktuelle Seite (No-op).
- Damit ist die Overview-Page der Einstiegspunkt/Hub, von dem aus die anderen beiden Hauptbereiche der App erreichbar sind.

#### Eigene Komponenten (Datei-Verweise)

Als eigene Komponente zähle ich nur die Page-Datei selbst und ihr zugehöriges CSS-Modul:

- [`src/app/overview/page.tsx`](../src/app/overview/page.tsx) — komplette Seitenlogik (State, Modals, CRUD-Aufrufe)
- [`src/app/styles/overview-styles/container.module.css`](../src/app/styles/overview-styles/container.module.css) — Layout/Optik der Seite

Genutzte, aber nicht von mir gebaute Bausteine: `Button` (`src/components/ui/button/button.tsx`), `Input` (`src/components/ui/input/input.tsx`), sowie die Navbar-Komponenten (`floatingNavBar.tsx`, `infoModal.tsx`, `modalUtils.tsx`, `settingsModal.tsx` unter `src/components/navbar-components/`) — diese sind Gemeinschaftsarbeit bzw. von Teamkolleg:innen.

#### API-Anbindung / Datenfluss

Alle Datenzugriffe laufen über [`src/lib/api/cards.ts`](../src/lib/api/cards.ts), das `fetch` gegen die REST-API kapselt (siehe Kapitel 2 für die API selbst):

| Aktion in der UI | Funktion (`lib/api/cards.ts`) | HTTP-Call | Datenfluss bis in die DB |
|---|---|---|---|
| Seite laden (`useEffect`, Z. 41–43) | `fetchCards()` | `GET /api/cards` | Route → `getCardsForUser(userId)` (`src/db/queries/cards.ts`) → Drizzle-Select auf `cards`, gefiltert nach `user_id` |
| Karte speichern, neu (`saveCard`, Z. 80–100) | `createCard(front, back)` | `POST /api/cards` | Route validiert Body mit `createCardSchema` (Zod) → `createCard(userId, front, back)` → Drizzle-Insert in `cards` |
| Karte speichern, Edit (`saveCard`, Z. 80–100) | `updateCard(id, {front?, back?})` | `PATCH /api/cards/:id` | Route validiert mit `updateCardSchema` → `updateCard(userId, id, data)` → Drizzle-Update, nach `id` **und** `user_id` gefiltert |
| Karte löschen (`removeCard`, Z. 103–107) | `deleteCard(id)` | `DELETE /api/cards/:id` | `deleteCard(userId, id)` → Drizzle-Delete, kaskadiert wegen FK auch `card_progress`-Einträge dieser Karte |

Der komplette Kreislauf ist also: **Overview-Page-State (React) → `lib/api/cards.ts` (fetch) → API-Route (`app/api/cards/...`) → Query-Modul (`db/queries/cards.ts`) → Drizzle → Postgres**.

#### Grundidee & Funktionsweise

- Karten werden nicht mehr lokal (localStorage) gehalten, sondern serverseitig persistiert und beim Laden per `GET /api/cards` in den React-State geladen — dadurch bleiben Karten über Geräte/Sessions hinweg erhalten (Voraussetzung für den späteren Fortschritts-Tracking-Ansatz in Self-Study).
- Ein einziges Modal übernimmt sowohl "Anlegen" als auch "Bearbeiten" (unterschieden über `editingId`), um Code-Duplikation zwischen beiden Flows zu vermeiden.

🔲 **TODO (du):** Hier deine eigene Begründung ergänzen, warum du dich für ein Grid-Layout statt z. B. einer Listenansicht entschieden hast, und ob es einen bewussten Grund für "ein Modal für Add+Edit" statt zwei getrennter Modals gab.

#### Entwicklungsentscheidungen

- **Optimistisches vs. server-bestätigtes UI:** Die Seite wartet auf die API-Antwort, bevor der State aktualisiert wird (kein optimistic update) — einfacher und robuster gegen inkonsistenten State bei Fehlern, kostet aber etwas gefühlte Reaktionsgeschwindigkeit.
- **Zentrale Fehlerbehandlung:** `handleResponse()` in `lib/api/cards.ts` (Z. 3–9) wirft bei Nicht-OK-Antworten einen `Error` mit der Server-Fehlermeldung, dadurch müssen einzelne Aufrufer keine Statuscode-Logik duplizieren.

🔲 **TODO (du):** Weitere persönliche Entwicklungsentscheidungen (z. B. warum CSS Modules statt einer UI-Bibliothek, warum kein globaler State-Manager wie Zustand/Redux für die Karten) — bitte in eigenen Worten ergänzen, damit die Begründung authentisch von dir stammt.

---

### 1.2 Self-Study-Page (`/selfstudy`)

**Datei:** [`src/app/selfstudy/page.tsx`](../src/app/selfstudy/page.tsx) (202 Zeilen, Client-Component, `export default function SelfStudy`)
**Styles:** [`src/app/styles/selfstudy-styles/container.module.css`](../src/app/styles/selfstudy-styles/container.module.css) (108 Zeilen)

#### Was die Seite tut / Bedienung

Self-Study ist der Lernmodus: Karten werden nacheinander angezeigt, ein Klick auf die Karte dreht sie per 3D-Flip-Animation von Vorderseite auf Rückseite (State `isFlipped`, Klick-Handler Z. 146–150). Nutzer:innen bewerten anschließend, ob sie die Karte richtig oder falsch beantwortet haben; danach erscheint automatisch die nächste Karte (Flip-Status wird zurückgesetzt, Z. 112). Eine `StatusBar`-Komponente zeigt laufend Anzahl richtiger/falscher Antworten sowie Fortschritt (`currentQuestion`/`totalQuestions`). Ist der Kartenstapel durch, erscheint ein Ergebnis-Screen (`Result`-Komponente, Z. 140) statt der Karte.

🔲 **TODO (du):** Screenshot Vorderseite, Screenshot geflippte Rückseite, Screenshot Ergebnis-Screen hier einfügen (z. B. `docs/screenshots/selfstudy-front.png`, `-back.png`, `-result.png`).

#### Einbindung ins Gesamtprojekt

- Route **`/selfstudy`** über `src/app/selfstudy/page.tsx` (App Router).
- Von der Overview-Page über die Navbar erreichbar (`router.push("/selfstudy")`).
- Nutzt dieselbe Kartenquelle wie die Overview-Page (`GET /api/cards`) — es gibt keine separate "Lern-Kartenmenge", sondern es werden alle Karten des Users abgefragt.

#### Eigene Komponenten (Datei-Verweise)

- [`src/app/selfstudy/page.tsx`](../src/app/selfstudy/page.tsx) — komplette Lern-Logik (Kartenfluss, Flip, Scoring, Sessionsteuerung)
- [`src/app/styles/selfstudy-styles/container.module.css`](../src/app/styles/selfstudy-styles/container.module.css) — Flip-Animation, Kartenlayout

Genutzt, aber nicht eigener Beitrag: `StatusBar` (`src/components/ui/statusbar/statusbar.tsx`), `Button`, `Result` inkl. `DonutChart` (`src/components/abfrage/result.tsx`, `src/components/ui/chart/donut_chart.tsx`), Navbar-Komponenten.

#### API-Anbindung / Datenfluss

Über [`src/lib/api/cards.ts`](../src/lib/api/cards.ts) und [`src/lib/api/progress.ts`](../src/lib/api/progress.ts):

| Aktion in der UI | Funktion | HTTP-Call | Datenfluss bis in die DB |
|---|---|---|---|
| Seite laden (Z. 33–35) | `fetchCards()` | `GET /api/cards` | wie Overview: `getCardsForUser` |
| Antwort bewerten (`handleAnswer`, Z. 97–117) | `recordAnswer(cardId, isCorrect)` | `POST /api/progress/:cardId` mit Body `{ correct: boolean }` | Route validiert mit `recordAnswerSchema` → prüft Karte existiert für User (`getCardForUser`) → `recordAnswer(userId, cardId, correct)` → Drizzle **Upsert** (`onConflictDoUpdate` auf `(user_id, card_id)`) erhöht `correct_count`/`wrong_count` atomar per SQL-Increment |

Wichtig: Der `recordAnswer`-Call ist "fire-and-forget" (Z. 102, Fehler werden mit `.catch(() => {})` verschluckt) — das UI blockiert nicht auf die Antwort und zeigt bei einem fehlgeschlagenen Tracking-Call keinen Fehler an.

🔲 **TODO (du):** Ist das "Verschlucken" absichtlich (z. B. weil Fortschritts-Tracking nicht kritisch für den Lernfluss ist) oder ein bekannter offener Punkt? Bitte kurz einordnen, damit es nicht wie ein übersehener Bug wirkt.

#### Rotate/Flip-Mechanik im Detail (inkl. Bugfix-Historie)

- `.card` hat `perspective: 1000px; transform-style: preserve-3d;`, `.flipover` rotiert per `transform: rotateY(180deg)`.
- **Bug & Fix** (Commit `47e8308`, "fix selfstudy card text after rotate"): Nach dem Flip war der Kartentext gespiegelt/kopfüber, weil der Text-Inhalt mit dem Eltern-Element mitrotierte. Fix: Gegenrotation des Textinhalts speziell im geflippten Zustand:
  ```css
  .flipover .cardSideLabel,
  .flipover .cardText {
      transform: rotateY(180deg);
  }
  ```
  (`container.module.css`, siehe Commit `47e8308`) — dreht Label/Text um weitere 180°, sodass sie wieder lesbar sind, obwohl die Karte insgesamt gedreht ist.

#### Grundidee & Funktionsweise

- Spaced-Repetition-artiges Grundprinzip (aktuell ohne Gewichtung/Intervall-Logik): jede Karte wird einmal pro Durchlauf gezeigt, richtig/falsch wird gezählt und persistiert, damit über mehrere Sessions hinweg sichtbar ist, welche Karten häufiger falsch beantwortet werden (`card_progress`-Tabelle, siehe Kapitel 3).
- Flip-Interaktion simuliert eine physische Karteikarte (Frage → Umdrehen → Antwort selbst prüfen → bewerten), statt z. B. Multiple-Choice — passt zum klassischen Karteikarten-/Anki-Konzept.

🔲 **TODO (du):** War eine gewichtete Wiederholung (echtes Spaced Repetition, z. B. Karten mit hoher `wrong_count` häufiger zeigen) geplant, aber nicht mehr umgesetzt? Falls ja, gehört das in Kapitel 6 (offene Punkte) statt hier als "fertige Funktion" zu stehen.

#### Entwicklungsentscheidungen

- **Upsert statt Read-then-Write** für `recordAnswer`: `onConflictDoUpdate` mit SQL-Increment (`src/db/queries/progress.ts`, Z. 12–40) vermeidet Race Conditions bei parallelen Requests und ist mit einer DB-Anfrage günstiger als erst lesen, dann schreiben.
- **Fortschritt pro (User, Karte) statt pro Antwort-Event:** Es wird ein aggregierter Zähler geführt (`correct_count`/`wrong_count`), keine Historie einzelner Antworten — einfacher zu aggregieren, verliert aber den zeitlichen Verlauf einzelner Versuche.

🔲 **TODO (du):** Deine Begründung, warum aggregiert statt Event-Log — war das eine bewusste Abwägung (Einfachheit vs. spätere Auswertbarkeit) oder Zeitdruck?

---

## 2. API-Dokumentation

Alle Routen liegen unter `src/app/api/` (Next.js App Router Route Handlers). Es gibt kein separates `pages/api`.

### 2.1 Übersicht

| Methode | Pfad | Zweck |
|---|---|---|
| `GET` | `/api/cards` | Alle Karten des aktuellen Users abrufen |
| `POST` | `/api/cards` | Neue Karte anlegen |
| `PATCH` | `/api/cards/:id` | Bestehende Karte bearbeiten |
| `DELETE` | `/api/cards/:id` | Karte löschen |
| `GET` | `/api/progress` | Fortschritt (aggregiert) aller Karten des Users abrufen |
| `POST` | `/api/progress/:cardId` | Eine Antwort (richtig/falsch) für eine Karte protokollieren |
| `GET` | `/api/health` | Health-Check (kein DB-Zugriff, für Docker-Healthcheck) |

### 2.2 Gemeinsame Konventionen

- **Auth:** Aktuell **kein echtes Auth-System**. Jede Route ermittelt den "aktuellen User" über `getCurrentUserId()` ([`src/lib/current-user.ts`](../src/lib/current-user.ts)), das schlicht `process.env.DEV_USER_ID ?? "dev-user"` zurückgibt. Es gibt keinen Auth-Header und kein Login. Der Code ist bewusst so geschrieben, dass **nur diese eine Funktion** ersetzt werden muss, sobald echtes Login existiert — alle Queries/Routen rufen ausschließlich diese Funktion auf.
- **Fehlerformat:** Einheitlich JSON `{ "error": string, "details"?: ZodIssue[] }`. `details` ist nur bei Validierungsfehlern (422) gesetzt und enthält die Zod-Issue-Liste ([`src/lib/validation/respond.ts`](../src/lib/validation/respond.ts)).
- **Statuscodes:**
  - `200` — erfolgreiches Lesen/Ändern/Löschen
  - `201` — erfolgreiches Anlegen (`POST /api/cards`)
  - `400` — ungültiger Pfad-Parameter (z. B. `:id` ist keine Ganzzahl)
  - `404` — Ressource existiert nicht **oder gehört nicht dem aktuellen User** (bewusst kein Unterschied zwischen "existiert nicht" und "gehört jemand anderem" — verhindert, dass fremde IDs erraten/ausgetestet werden können)
  - `422` — Body-Validierung (Zod) fehlgeschlagen
- **Namenskonvention:** Ressourcen-basierte, REST-typische Pfade im Plural (`/api/cards`), Sub-Ressourcen als eigener Top-Level-Pfad mit Parameter (`/api/progress/:cardId`) statt verschachtelt unter `/api/cards/:id/progress` — Fortschritt wird als eigenständige Ressource behandelt, nicht als Unter-Ressource der Karte.
- **Body-Parsing:** Alle Routen lesen den Body defensiv mit `request.json().catch(() => null)`, damit fehlerhaftes/leeres JSON nicht zu einem unbehandelten 500er führt, sondern sauber als Validierungsfehler (422) beantwortet wird.

### 2.3 `GET /api/cards`

**Datei:** [`src/app/api/cards/route.ts`](../src/app/api/cards/route.ts), Z. 7–11
**Zweck:** Alle Karten des aktuellen Users laden.
**Auth:** keine (Platzhalter-User, s. o.)
**Request:** keine Parameter, kein Body.
**Response:** `200 OK`, Body: `Card[]` — Array von `{ id: number, userId: string, front: string, back: string, createdAt: string, updatedAt: string }`.
**Fehlerfälle:** keine spezifischen (leeres Array bei keinen Karten).

### 2.4 `POST /api/cards`

**Datei:** [`src/app/api/cards/route.ts`](../src/app/api/cards/route.ts), Z. 13–23
**Zweck:** Neue Karte anlegen.
**Auth:** keine.
**Request Body** (`createCardSchema`, [`src/lib/validation/cards.ts`](../src/lib/validation/cards.ts) Z. 3–6):
```ts
{ front: string /* getrimmt, min. 1 Zeichen */, back: string /* getrimmt, min. 1 Zeichen */ }
```
**Response:** `201 Created`, Body: die neu erstellte `Card`.
**Fehlerfälle:**
- `422` — `front`/`back` fehlen, sind leer oder nur Whitespace. Body: `{ error: "Validation failed", details: [...] }`.

### 2.5 `PATCH /api/cards/:id`

**Datei:** [`src/app/api/cards/[id]/route.ts`](../src/app/api/cards/[id]/route.ts), Z. 9–29
**Zweck:** Vorder-/Rückseite einer bestehenden Karte ändern.
**Auth:** keine.
**Request Parameter:** `id` (Pfad, muss Ganzzahl sein).
**Request Body** (`updateCardSchema`, [`src/lib/validation/cards.ts`](../src/lib/validation/cards.ts) Z. 8–15): `{ front?: string, back?: string }`, mindestens eines der beiden Felder muss gesetzt sein (Zod `.refine`).
**Response:** `200 OK`, Body: die aktualisierte `Card`.
**Fehlerfälle:**
- `400` — `id` ist keine Ganzzahl: `{ error: "Invalid card id" }`
- `422` — Body ungültig (leer, keins von beiden Feldern gesetzt, oder leerer String)
- `404` — keine Karte mit dieser `id` für den aktuellen User: `{ error: "Card not found" }`

### 2.6 `DELETE /api/cards/:id`

**Datei:** [`src/app/api/cards/[id]/route.ts`](../src/app/api/cards/[id]/route.ts), Z. 31–45
**Zweck:** Karte löschen (kaskadiert auf zugehörige `card_progress`-Zeile, s. Kapitel 3).
**Auth:** keine.
**Request Parameter:** `id` (Pfad, Ganzzahl). Kein Body.
**Response:** `200 OK`, Body: die gelöschte `Card`.
**Fehlerfälle:**
- `400` — `id` keine Ganzzahl.
- `404` — keine Karte mit dieser `id` für den aktuellen User.

### 2.7 `GET /api/progress`

**Datei:** [`src/app/api/progress/route.ts`](../src/app/api/progress/route.ts), Z. 5–9
**Zweck:** Aggregierten Lernfortschritt aller Karten des Users abrufen.
**Auth:** keine.
**Request:** keine Parameter.
**Response:** `200 OK`, Body: `CardProgress[]` — `{ cardId, userId, correctCount, wrongCount, lastReviewedAt }[]`.
**Fehlerfälle:** keine spezifischen.

### 2.8 `POST /api/progress/:cardId`

**Datei:** [`src/app/api/progress/[cardId]/route.ts`](../src/app/api/progress/[cardId]/route.ts), Z. 10–31
**Zweck:** Eine Antwort (richtig/falsch) für eine Karte protokollieren; erhöht `correct_count` oder `wrong_count` und setzt `last_reviewed_at`.
**Auth:** keine.
**Request Parameter:** `cardId` (Pfad, Ganzzahl).
**Request Body** (`recordAnswerSchema`, [`src/lib/validation/progress.ts`](../src/lib/validation/progress.ts)): `{ correct: boolean }`.
**Response:** `200 OK`, Body: die aktualisierte/neu erstellte `CardProgress`-Zeile.
**Fehlerfälle:**
- `400` — `cardId` keine Ganzzahl.
- `422` — `correct` fehlt oder ist kein Boolean.
- `404` — Karte existiert nicht (oder gehört nicht dem aktuellen User) — verhindert Fortschritts-Tracking für fremde/nicht existente Karten.

### 2.9 `GET /api/health`

**Datei:** [`src/app/api/health/route.ts`](../src/app/api/health/route.ts), Z. 3–5
**Zweck:** Reiner Health-Check ohne DB-Zugriff, wird vom Docker-Healthcheck des App-Containers verwendet (`docker-compose.yml`, s. Kapitel 4).
**Auth:** keine. **Request:** keine. **Response:** `200 OK`, `{ status: "ok" }`. **Fehlerfälle:** keine.

---

## 3. Datenbank-Schicht

### 3.1 Datenmodell

**Schema-Datei:** [`src/db/schema.ts`](../src/db/schema.ts)

```mermaid
erDiagram
    CARDS ||--o{ CARD_PROGRESS : "hat Fortschritt (pro User)"
    CARDS {
        serial id PK
        text user_id
        text front
        text back
        timestamp created_at
        timestamp updated_at
    }
    CARD_PROGRESS {
        serial id PK
        text user_id
        integer card_id FK
        integer correct_count "default 0"
        integer wrong_count "default 0"
        timestamp last_reviewed_at "nullable"
    }
```

**`cards`** (Z. 10–17):

| Spalte | Typ | Constraints |
|---|---|---|
| `id` | `serial` | Primary Key |
| `user_id` | `text` | `NOT NULL` |
| `front` | `text` | `NOT NULL` |
| `back` | `text` | `NOT NULL` |
| `created_at` | `timestamp` | `NOT NULL`, Default `now()` |
| `updated_at` | `timestamp` | `NOT NULL`, Default `now()` |

**`card_progress`** (Z. 19–32):

| Spalte | Typ | Constraints |
|---|---|---|
| `id` | `serial` | Primary Key |
| `user_id` | `text` | `NOT NULL` |
| `card_id` | `integer` | `NOT NULL`, FK → `cards.id`, `ON DELETE CASCADE` |
| `correct_count` | `integer` | `NOT NULL`, Default `0` |
| `wrong_count` | `integer` | `NOT NULL`, Default `0` |
| `last_reviewed_at` | `timestamp` | nullable |
| *(Tabellen-Constraint)* | — | `UNIQUE (user_id, card_id)` — genau ein Fortschritts-Datensatz pro User+Karte, dient als Konflikt-Ziel für den Upsert in `recordAnswer` |

Es gibt **keine `users`-Tabelle** — `user_id` ist ein freier String, aktuell immer der Platzhalterwert aus `getCurrentUserId()`. Alle Queries filtern zusätzlich nach `user_id`, sodass die Datenisolation pro User bereits vorbereitet ist, sobald echte User-IDs (aus einem Login-System) verwendet werden.

### 3.2 Drizzle-Client

**Datei:** [`src/db/client.ts`](../src/db/client.ts)

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
```

- Treiber: **`postgres-js`** (npm-Paket `postgres`), **nicht** `@vercel/postgres`. Der Client verbindet sich über einen normalen Postgres-Connection-String, unabhängig davon, ob die Datenbank lokal in Docker oder als Vercel-Postgres-Instanz läuft.
- `connectionString = process.env.DATABASE_URL`, wirft beim Modul-Import einen Fehler, falls nicht gesetzt (Z. 10–13) — die App startet dann gar nicht erst mit "stillem" DB-Fehler.
- Der Client (`postgres(connectionString)`) wird außerhalb von Production über `global.__dbClient` zwischengespeichert, um bei Next.js-Hot-Reloads im Dev-Modus nicht bei jedem Modul-Reimport eine neue Connection zu öffnen (Z. 15–20).
- Verwendung im Code: `import { db } from "@/db/client"` in den Query-Modulen `src/db/queries/cards.ts` und `src/db/queries/progress.ts`, dort z. B. `db.select().from(cards).where(...)`, `db.insert(cards).values(...)`, `db.insert(cardProgress).values(...).onConflictDoUpdate(...)`.

### 3.3 Verbindungskonfiguration (lokal & Produktion)

Benötigte Env-Variable: **`DATABASE_URL`** (Postgres-Connection-String), referenziert in:
- [`src/db/client.ts:10`](../src/db/client.ts)
- [`drizzle.config.ts:3-4,12`](../drizzle.config.ts)
- `docker-compose.yml:13` (App-Container, zeigt auf den `db`-Service: `postgres://postgres:postgres@db:5432/die_kleinen_einsteins`)
- `.env.example:3` (lokaler Default: `postgres://postgres:postgres@localhost:5432/die_kleinen_einsteins`)

Zusätzlich optional: **`DEV_USER_ID`** ([`src/lib/current-user.ts`](../src/lib/current-user.ts)) — Platzhalter-User, Default `"dev-user"`, solange kein Login existiert.

**Lokal:** `.env` aus `.env.example` kopieren, Postgres-Container starten, Migration ausführen, dann App starten (Details in Kapitel 4 / README).

**Produktion (Vercel + Vercel Postgres):** `DATABASE_URL` muss in den Vercel-Projekt-Umgebungsvariablen auf den Connection-String der Vercel-Postgres-Instanz gesetzt werden.

🔲 **TODO (du):** War in eurem Projekt bereits eine Vercel-Postgres-Instanz eingerichtet? Falls ja, bitte hier ergänzen: Projekt-/Instanz-Name, wer Zugriff auf das Vercel-Dashboard hat, und ob die Connection-String-Variable dort schon hinterlegt ist oder noch fehlt — das ist einer der wichtigsten Übergabe-Punkte (siehe Kapitel 6).

### 3.4 Besonderheit: Connection-Pooling im Serverless-Kontext

Das ist ein konkreter Punkt, den ich für die Übergabe hervorheben will:

- `postgres(connectionString)` wird **ohne explizite Pool-Größe** aufgerufen → Default des `postgres`-Pakets ist ein Pool von bis zu **10 Verbindungen pro Prozess**.
- Der Dev-Only-Cache (`global.__dbClient`) sorgt zwar dafür, dass in **lokalen** Hot-Reloads keine neuen Pools entstehen, ist aber in Production deaktiviert (`if (process.env.NODE_ENV !== "production")`, Z. 18). Das ist unkritisch für eine klassische Server-Instanz (ein warmer Prozess = ein Modul-Scope = ein Pool), **aber relevant, sobald die App als Vercel Serverless/Edge Function deployed wird**: Jede parallel hochskalierte Funktionsinstanz öffnet ihren eigenen Pool von bis zu 10 Verbindungen. Bei vielen gleichzeitigen Serverless-Instanzen kann das das Verbindungslimit von Postgres (insbesondere bei kleineren Vercel-Postgres-Tarifen) erschöpfen.
- **Empfehlung für die Nachfolger:innen:** Beim Deployment auf Vercel entweder (a) den gepoolten Connection-String von Vercel Postgres verwenden (PgBouncer-Variante, meist als separate Env-Var mit `-pooler` im Hostnamen ausgeliefert), oder (b) die Pool-Größe im `postgres()`-Aufruf explizit klein halten (z. B. `postgres(connectionString, { max: 1 })`) — je nach Funktionsmodell.

🔲 **TODO (du):** Falls ihr das Deployment schon getestet habt: trat das Problem real auf, oder ist es (noch) rein theoretisch? Das würde ich hier gern ergänzen, damit klar ist, ob es ein akutes oder ein vorsorgliches Risiko ist.

### 3.5 Migrationen (Drizzle-Kit)

- **Config:** [`drizzle.config.ts`](../drizzle.config.ts) — `schema: "./src/db/schema.ts"`, `out: "./drizzle"`, `dialect: "postgresql"`, `dbCredentials.url` aus `DATABASE_URL`.
- **Migrations-Ordner:** [`drizzle/`](../drizzle) mit bisher zwei Migrationen:
  - `0000_hard_radioactive_man.sql` — legt `cards` und `card_progress` inkl. FK (`ON DELETE CASCADE`) an.
  - `0001_fair_nocturne.sql` — fügt den `UNIQUE (user_id, card_id)`-Constraint auf `card_progress` hinzu.
  - `meta/` — interne Drizzle-Kit-Journale/Snapshots, nicht von Hand bearbeiten.
- **npm-Skripte** (`package.json`):
  - `npm run db:generate` → `drizzle-kit generate` — erzeugt aus Änderungen an `src/db/schema.ts` eine neue SQL-Migration im `drizzle/`-Ordner.
  - `npm run db:migrate` → `drizzle-kit migrate` — spielt ausstehende Migrationen gegen die per `DATABASE_URL` konfigurierte DB ein.
  - `npm run db:studio` → `drizzle-kit studio` — öffnet Drizzle Studio (DB-Browser im Browser) gegen dieselbe DB.
- **Ablauf bei Schema-Änderungen:** `src/db/schema.ts` anpassen → `npm run db:generate` (erzeugt neue `.sql`-Datei in `drizzle/`) → Datei kurz prüfen (Drizzle generiert nicht immer 100% das gewünschte SQL bei komplexeren Änderungen) → `npm run db:migrate` lokal ausführen → Migration mit committen → in Produktion nach Deployment ebenfalls `npm run db:migrate` gegen die Prod-DB ausführen (kein automatischer Migrationslauf beim Deploy eingerichtet).

🔲 **TODO (du):** Läuft die Produktions-Migration aktuell manuell, oder gibt es/sollte es einen CI-Schritt geben? Falls manuell: wer führt das nach deinem Weggang aus, und hat diese Person Zugriff auf die Prod-`DATABASE_URL`?

---

## 4. Docker-Setup

### 4.1 Dockerfile

**Datei:** [`Dockerfile`](../Dockerfile)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

- Single-Stage-Build auf `node:20-alpine` (schlankes Node-20-Image).
- `npm install` (Z. 5) installiert Dependencies, danach wird der komplette Projektkontext kopiert und `npm run build` (→ `next build`) ausgeführt.
- Container lauscht auf Port `3000` (`EXPOSE 3000`, passend zu `next start`, Default-Port von Next.js).
- `CMD ["npm", "start"]` → `next start`, produktiver Next.js-Server (kein Dev-Server).

🔲 **Bekannter Verbesserungspunkt (gehört in Kapitel 6):** Es wird nur `package.json`, nicht `package-lock.json` vor `npm install` kopiert — Builds sind dadurch nicht zwingend lockfile-exakt reproduzierbar. Eine robustere Variante wäre `COPY package.json package-lock.json ./` + `RUN npm ci`.

### 4.2 docker-compose.yml

**Datei:** [`docker-compose.yml`](../docker-compose.yml)

Zwei Services:

**`die-kleinen-einsteins`** (App):
- Wird aus dem lokalen `Dockerfile` gebaut (`build.context: .`).
- Port-Mapping `3000:3000`.
- `environment.DATABASE_URL: postgres://postgres:postgres@db:5432/die_kleinen_einsteins` — zeigt auf den `db`-Service über dessen Compose-internen Hostnamen `db` (Standard-Compose-Netzwerk, kein explizites `networks:` nötig).
- `depends_on: db: condition: service_healthy` — der App-Container startet erst, wenn der Postgres-Healthcheck grün ist (verhindert Startup-Fehler durch "DB noch nicht bereit").
- Eigener Healthcheck: `curl -f http://localhost:3000/api/health` alle 10s (5s Timeout, 5 Versuche) — nutzt den in Kapitel 2.9 dokumentierten Health-Endpoint.

**`db`** (Postgres):
- Image `postgres:latest`, läuft als `user: root`.
- `POSTGRES_USER=postgres`, `POSTGRES_PASSWORD=postgres`, `POSTGRES_DB=die_kleinen_einsteins` — **das sind reine lokale Dev-Zugangsdaten**, nicht für Produktion gedacht.
- Port-Mapping `5432:5432` (Postgres von außerhalb des Containers erreichbar, z. B. für einen lokalen DB-Client).
- Healthcheck via `pg_isready -U postgres`.

**Kein `volumes:`-Eintrag:** Die Postgres-Daten liegen nur im Container-Dateisystem — bei `docker compose down` (bzw. Neuaufbau des `db`-Containers) sind alle lokalen Testdaten weg. Das ist für eine lokale Dev-DB akzeptabel, aber wichtig zu wissen (siehe Kapitel 6).

### 4.3 Ein-Befehl-Start

Vorausgesetzt: `docker`, `node`, `npm`, `bash`/PowerShell Core sind installiert (keine weiteren OS-spezifischen Tools nötig).

```bash
docker compose up
```

Das genügt für den **kompletten Stack**: Compose baut das App-Image aus dem Dockerfile, startet zuerst `db` (Postgres) und wartet auf dessen Healthcheck, startet danach den App-Container, der wiederum per eigenem Healthcheck überwacht wird. Die App ist danach unter `http://localhost:3000` erreichbar.

⚠️ **Wichtige Einschränkung, die ich hier festhalten will:** `docker compose up` allein führt **keine Drizzle-Migration aus** — das Dockerfile/Compose-Setup enthält keinen Migrationsschritt. Bei einer frisch erstellten `db` (leeres Datenverzeichnis, kein Volume) existieren die Tabellen `cards`/`card_progress` also noch nicht, und die API-Routen schlagen mit einem DB-Fehler fehl, bis einmal manuell migriert wurde:

```bash
docker compose up -d db      # nur die DB starten
npm run db:migrate           # Migration lokal gegen die (Port-3000→5432 gemappte) DB ausführen
docker compose up            # danach den vollen Stack starten (oder weiterlaufen lassen)
```

Das deckt sich mit dem in `README.md` (Z. 20–29) beschriebenen Ablauf. Der Wunsch "ein einziger Befehl" ist damit **aktuell nicht ganz erfüllt** — echte Ein-Befehl-Lösung würde einen Migrations-Schritt im Compose-Startablauf (z. B. Init-Container oder Entrypoint-Skript im App-Container) erfordern.

🔲 **TODO (du):** Soll ich das als offenen Punkt in Kapitel 6 aufnehmen ("Ein-Befehl-Start funktioniert nur bei bereits migrierter DB"), oder hattet ihr das nach der Anforderungsdefinition schon anders gelöst (z. B. Migration im Dockerfile/Compose ergänzt), das ich noch nicht im Code sehe?

### 4.4 Plattformunabhängigkeit

- Alle Befehle (`docker compose up`, `npm run db:migrate`, `npm run dev`) sind reine CLI-Befehle ohne Shell-Skripte mit OS-spezifischer Syntax — funktionieren identisch unter `bash` (Linux/macOS) und PowerShell Core (Windows), da weder Dockerfile noch `docker-compose.yml` Shell-spezifische Konstrukte enthalten.
- `.env`-Datei wird plattformunabhängig per `cp .env.example .env` (bash) bzw. `copy .env.example .env` (PowerShell/CMD) angelegt.

🔲 **TODO (du):** Hast du das Setup tatsächlich auf allen drei Plattformen (Windows/macOS/Linux) getestet, oder nur auf einer? Falls nur auf einer getestet, würde ich das hier ehrlich vermerken statt es als geprüft darzustellen.

---

## 5. Webdesign

### 5.1 Designziele (deine Angabe)

Du hast als Grundidee genannt: **minimalistisch** und **einfach nutzbar für Schüler:innen/Studierende**, mit **Blau als Leitfarbe**, weil Blau eine ruhige Wirkung ausstrahlt.

**Wichtige Einordnung, bevor ich das ausformuliere:** Das globale Farb-/Theme-System (`--primary: #1f7a8c` u. a., inkl. Dark-Mode- und Accessibility-Varianten) liegt in [`Component.css`](../Component.css) — laut Git-Historie von Kilian (Lenz-Innovation) erstellt, nicht von dir. Deine beiden Seiten *konsumieren* diese Design-Tokens (`var(--primary)`, `var(--panel)` etc. in euren `container.module.css`-Dateien), haben die Farbwahl selbst aber nicht getroffen.

🔲 **TODO (du):** Bitte klarstellen, wie das genau war — habt ihr die Blau-Entscheidung gemeinsam im Team getroffen (dann kannst du sie hier als "unsere gemeinsame Designentscheidung, die ich in meinen Seiten konsequent angewendet habe" einordnen), oder war das rein Kilians Vorgabe, die du einfach übernommen hast? Das entscheidet, ob Punkt "Farbwahl" in dieser Doku als *dein* Beitrag zählt oder nur als Kontext.

Was eindeutig **deine eigene** Gestaltungsentscheidung ist: wie du diese Tokens auf Overview und Self-Study konkret einsetzt — Kartenraster vs. Modal-Overlays, Whitespace/Abstände, Kartenschatten (`box-shadow`) zur Tiefenwirkung, Flip-Animation, Statusbar-Platzierung.

### 5.2 Analyse an Overview- und Self-Study-Page

*(Ich fülle hier die Standard-Prinzipien ein, die üblicherweise in HCI-/Webdesign-Vorlesungen behandelt werden — bitte gegen eure tatsächlichen Foliennamen abgleichen und Begriffe ggf. ersetzen, siehe TODO am Ende.)*

**Kontrast:** `--panel` (weiß/dunkles Panel) gegen `--bg`/`--bg-accent` hebt Karten-Kacheln und Modals vom Hintergrund ab (`container.module.css`, Gradient-Hintergründe Z. 9, 64 in Overview). Der `--primary`-Farbton wird gezielt für interaktive/wichtige Elemente eingesetzt (aktiver Zustand, Primärfarbe im Header), nicht flächig — reduziert visuelles Rauschen.

**Visuelle Hierarchie:** Overview: große Headline (`title`, `header`) → Kartenraster als Hauptinhalt → Add-Kachel optisch zurückhaltender (gestrichelter Rand statt gefüllter Karte, Z. 133) als bestehende Karten. Self-Study: aktuelle Karte dominiert die Fläche, `StatusBar` klein und am Rand — die Aufmerksamkeit soll auf der Lernkarte liegen, nicht auf dem Fortschritt.

**Gestaltgesetze:** Kartenraster (Overview) nutzt *Nähe* (gleichmäßiger Grid-Abstand gruppiert zusammengehörige Karten optisch) und *Ähnlichkeit* (alle Karten identisches Kachel-Design) — signalisiert "hier ist eine Menge gleichartiger, austauschbarer Elemente". Modal + `overlay` (halbtransparenter Hintergrund, Z. 148) nutzt *Figur-Grund*, um das Modal eindeutig als im Vordergrund liegend zu kennzeichnen.

**Konsistenz:** Beide Seiten teilen dieselben Design-Tokens (Farben, Radien `--radius-lg/md/sm`, Transitions) über `Component.css`, wodurch Overview und Self-Study trotz unterschiedlicher Funktion optisch als eine App wirken.

**Responsive Design:**
🔲 **TODO (du):** Ich habe im Code noch keine expliziten Media-Queries in `overview-styles/container.module.css` bzw. `selfstudy-styles/container.module.css` geprüft — bitte sag mir, ob/wie du Responsiveness umgesetzt hast (z. B. CSS Grid mit `auto-fit`/`minmax`, feste Breakpoints, oder noch offen), dann ergänze ich diesen Abschnitt korrekt statt zu raten.

**Barrierefreiheit / Accessibility (falls in eurer Vorlesung behandelt):** Das globale Token-System unterstützt Dark Mode, High-Contrast-Modus und größere Schrift (`Component.css`, `:root[data-theme="dark"]`, `[data-high-contrast="true"]`, `[data-large-text="true"]`) sowie reduzierte Bewegung (`[data-reduced-motion="true"]`). Da deine Seiten ausschließlich über CSS-Variablen gestylt sind (keine hartkodierten Farben in den `container.module.css`-Dateien), profitieren Overview und Self-Study automatisch von allen vier Modi, ohne dass du das selbst implementieren musstest — das würde ich als bewusste, positive Konsequenz eurer gemeinsamen Token-Architektur nennen, nicht als deine alleinige Leistung.

### 5.3 Offene Frage an dich

Bitte nenn mir die **tatsächlichen Begriffe aus eurer Vorlesung** (du hattest u. a. Kontrast, visuelle Hierarchie, Gestaltgesetze, Responsive Design als Beispiele genannt) — insbesondere falls dort spezifischere Modelle behandelt wurden (z. B. Fitts' Law, Nielsen's Heuristiken, Farbkreis-/Farbpsychologie-Theorie, Grid-Systeme, Typografie-Skalen). Ich passe Abschnitt 5.2 dann an die korrekten Fachbegriffe an, damit es zur Vorlesung passt statt generische HCI-Literatur zu zitieren.

---

## 6. Übergabe-Hinweise

Zusammengefasst aus den TODOs oben, plus zusätzliche Punkte:

### Nur von mir gesetzte/bekannte Werte
- **`DATABASE_URL` in Produktion** (Vercel-Projekt-Env): 🔲 TODO (du) — ist das dort schon hinterlegt, und wer außer dir hat Zugriff auf das Vercel-Dashboard/die Postgres-Zugangsdaten? Falls nur du, sollte das **vor deinem Weggang** an mind. eine weitere Person übergeben werden.
- **`DEV_USER_ID`**: Nur relevant, falls lokal vom Default `"dev-user"` abgewichen wurde — prüfen, ob irgendwo (z. B. `.env` auf einem Server) ein individueller Wert gesetzt ist, den niemand sonst kennt.
- Lokale Postgres-Zugangsdaten (`postgres`/`postgres` in `docker-compose.yml`) sind unkritisch (Dev-only), aber falls diese versehentlich 1:1 für eine echte Umgebung übernommen wurden, ist das ein Sicherheitsrisiko.

### Bekannte Stolperfallen
1. **Kein Auth-System:** `getCurrentUserId()` gibt aktuell für alle Requests dieselbe feste ID zurück (`dev-user`, sofern `DEV_USER_ID` nicht gesetzt) — **alle** Nutzer:innen der App teilen sich faktisch einen Datensatz, es gibt keine Trennung zwischen "echten" Personen. Sobald Login eingeführt wird, ist laut Code-Kommentar in `src/lib/current-user.ts` nur diese eine Funktion anzupassen — alle Queries/Routen filtern bereits korrekt nach `user_id`.
2. **`docker compose up` migriert die DB nicht automatisch** (siehe 4.3) — bei frischer DB schlagen alle Card-/Progress-Endpoints fehl, bis `npm run db:migrate` gelaufen ist.
3. **Kein Postgres-Volume** — lokale Testdaten gehen bei `docker compose down`/Neuaufbau des `db`-Containers verloren.
4. **Dockerfile kopiert `package.json` ohne Lockfile** vor `npm install` — Builds sind nicht strikt reproduzierbar.
5. **Serverless-Connection-Pooling** (siehe 3.4) — bei Deployment auf Vercel als Serverless-Funktion ohne gepoolten Connection-String oder reduzierte `max`-Pool-Größe kann das Verbindungslimit von Postgres erschöpft werden.
6. **`recordAnswer`-Fehler werden im Frontend verschluckt** (`.catch(() => {})`, `selfstudy/page.tsx` Z. 102) — falls die API mal down ist, merkt das UI davon nichts; Fortschritt wird dann still nicht gespeichert.

### Abhängigkeiten zu anderem Code
- Overview/Self-Study nutzen die gemeinsamen UI-Bausteine `Button`, `Input`, `StatusBar`, `Result`, `DonutChart` sowie alle Navbar-Komponenten und das globale Token-System (`Component.css`) — Änderungen an diesen gemeinsamen Dateien durch andere Teammitglieder können sich direkt auf meine Seiten auswirken (z. B. Farb-/Radius-Änderungen in `Component.css`, Props-Änderungen an `StatusBar`/`Result`).
- Die Navbar-Routing-Logik verlinkt fest auf `/abfrage` — falls diese Route umbenannt/entfernt wird, bricht die Navigation von meinen Seiten aus dorthin.

### Offene Punkte
- 🔲 Responsive-Verhalten der beiden Seiten noch nicht dokumentiert (s. 5.2) — bitte klären, ob/wie umgesetzt.
- 🔲 Produktions-Migrationsprozess (manuell vs. automatisiert) noch zu klären (s. 3.5).
- 🔲 Kein echtes Spaced-Repetition (gewichtete Wiederholung) — falls das ursprünglich geplant war, als offenes Feature vermerken statt stillschweigend wegzulassen.
- 🔲 Cross-Platform-Test von Docker-Setup (Windows/macOS/Linux) — Umfang der tatsächlichen Tests klären (s. 4.4).

---

*Nächster Schritt: Bitte die 🔲-markierten Stellen durchgehen (Screenshots, persönliche Begründungen, offene Rückfragen), dann kann ich das Dokument final glätten.*
a