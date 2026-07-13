## Requirements

- install Node JS(using nvm)
- VS Studio Code

## Getting Started

First, run the development server:

```bash
npm install
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend & Datenbank (lokal)

Cards und Self-Study-Fortschritt werden über Postgres/Drizzle persistiert.

1. `.env` aus der Vorlage anlegen: `cp .env.example .env` (Variablen siehe unten).
2. Datenbank starten: `docker compose up -d db`
3. Migration ausführen: `npm run db:migrate`
4. App starten: `npm run dev` (oder `docker compose up` für den kompletten Stack inkl. App-Container)

Weitere Drizzle-Kit-Befehle: `npm run db:generate` (neue Migration aus Schema-Änderungen erzeugen), `npm run db:studio` (DB im Browser inspizieren).

### Benötigte .env-Variablen

- `DATABASE_URL` — Postgres-Connection-String, muss zu `docker-compose.yml` passen (Default: `postgres://postgres:postgres@localhost:5432/die_kleinen_einsteins`).
- `DEV_USER_ID` — optional, Fallback-User-ID für `getCurrentUserId()` (`src/lib/current-user.ts`), solange es kein echtes Login gibt. Default `dev-user`.
- `SITE_NAME`, `BASE_PATH` — bestehende App-Settings, unverändert.

Sobald echtes Login existiert: nur `src/lib/current-user.ts` anpassen (echte Session-/Auth-Abfrage statt Env-Fallback) — alle Queries und API-Routen nutzen ausschließlich diese Funktion und müssen nicht angefasst werden.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.