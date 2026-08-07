# Die kleinen Einsteins

Eine Karteikarten-Web-App zum Anlegen, Lernen und Abfragen von eigenen Lernkarten – gebaut mit Next.js, TypeScript und Postgres/Drizzle.

![Build Frontend](https://github.com/a2hengk/Die-kleinen-Einsteins/actions/workflows/build-frontend.yml/badge.svg)
![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)


## Features

- **Karteikasten** (`/overview`) – eigene Karten als Grid anlegen, bearbeiten und löschen
- **Selbstlernen** (`/selfstudy`) – Lernmodus mit Flip-Animation, Fortschritt wird pro Karte in der Datenbank gespeichert
- **Abfragen** (`/abfrage`) – Wissen aktiv abfragen
- **Anmeldung & Registrierung** – eigener Account pro Nutzer:in, Karten und Fortschritt bleiben geräteübergreifend erhalten

## Tech-Stack

- [Next.js](https://nextjs.org/) 16 (App Router) mit [React](https://react.dev/) 19 und TypeScript
- [Drizzle ORM](https://orm.drizzle.team/) mit PostgreSQL
- [Zod](https://zod.dev/) zur Validierung
- Docker & Docker Compose für lokale Entwicklung und Deployment

## Voraussetzungen

- [Node.js](https://nodejs.org/) (empfohlen über [nvm](https://github.com/nvm-sh/nvm))
- [Docker](https://www.docker.com/) & Docker Compose (für die lokale Datenbank)
- Ein Code-Editor, z. B. [Visual Studio Code](https://code.visualstudio.com/)

## Schnellstart

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die App ist danach unter [http://localhost:3000](http://localhost:3000) erreichbar.

> Für die vollen App-Funktionen (Karten, Login, Fortschritt) wird zusätzlich eine laufende Datenbank benötigt – siehe [Backend & Datenbank](#backend--datenbank).

## Backend & Datenbank

Karten und Self-Study-Fortschritt werden über Postgres/Drizzle persistiert.

1. `.env` aus der Vorlage anlegen:
   ```bash
   cp .env.example .env
   ```
2. Datenbank starten:
   ```bash
   docker compose up -d db
   ```
3. Migration ausführen:
   ```bash
   npm run db:migrate
   ```
4. App starten:
   ```bash
   npm run dev
   ```
   Alternativ startet `docker compose up` den kompletten Stack inklusive App-Container.

### Umgebungsvariablen

| Variable | Beschreibung |
|---|---|
| `DATABASE_URL` | Postgres-Connection-String, muss zu `docker-compose.yml` passen (Default: `postgres://postgres:postgres@localhost:5432/die_kleinen_einsteins`) |
| `AUTH_SECRET` | Secret zum Signieren des Session-Cookies. In Produktion ein langer, zufälliger Wert; lokal fällt der Code außerhalb von `production` auf einen Dev-Default zurück, die Variable muss also für die lokale Entwicklung nicht zwingend gesetzt sein |
| `AUTH_COOKIE_SECURE` | `false` für lokales HTTP, `true` wenn die App über HTTPS ausgeliefert wird (Default: `false`) |
| `SITE_NAME` | Name der App, wird u. a. im Seitentitel verwendet |
| `BASE_PATH` | Bestehende App-Einstellung, unverändert |

### Drizzle-Kit-Befehle

| Befehl | Beschreibung |
|---|---|
| `npm run db:generate` | Neue Migration aus Schema-Änderungen erzeugen |
| `npm run db:migrate` | Migrationen auf die Datenbank anwenden |
| `npm run db:studio` | Datenbank im Browser inspizieren |

## Mit Docker starten

```bash
docker compose up
```

Startet App und Postgres-Datenbank zusammen. Die App ist danach unter [http://localhost:3000](http://localhost:3000) erreichbar.

> Hinweis: `docker compose up` migriert die Datenbank nicht automatisch mit. Bei einer frischen Datenbank vorher bzw. zusätzlich `npm run db:migrate` ausführen, sonst schlagen die Card- und Progress-Endpoints fehl.

## Authentifizierung

Login und Registrierung sind unter `src/app/api/auth/login` bzw. `src/app/api/auth/register` umgesetzt. Die aktuelle User-ID wird über `getCurrentUserId()` (`src/lib/current-user.ts`) bereitgestellt, das die ID aus dem signierten Session-Cookie via `getSessionUserId()` (`src/lib/auth-session.ts`) liest. Alle Queries und API-Routen nutzen ausschließlich diese Funktion und müssen bei Änderungen an der Auth-Logik nicht angefasst werden.

## Lizenz

Dieses Projekt steht unter der [Apache License 2.0](LICENSE).
