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

.env aus der Vorlage anlegen: cp .env.example .env (Variablen siehe unten).
Datenbank starten: docker compose up -d db
Migration ausführen: npm run db:migrate
App starten: npm run dev (oder docker compose up für den kompletten Stack inkl. App-Container)

Weitere Drizzle-Kit-Befehle: npm run db:generate (neue Migration aus Schema-Änderungen erzeugen), npm run db:studio (DB im Browser inspizieren).

Benötigte .env-Variablen
DATABASE_URL — Postgres-Connection-String, muss zu docker-compose.yml passen (Default: postgres://postgres:postgres@localhost:5432/die_kleinen_einsteins).
AUTH_SECRET — Secret zum Signieren des Session-Cookies. In Produktion ein langer, zufälliger Wert; lokal fällt der Code außerhalb von production auf einen Dev-Default zurück, sodass die Variable für die lokale Entwicklung nicht zwingend gesetzt sein muss.
AUTH_COOKIE_SECURE — false für lokales HTTP, true wenn die App über HTTPS ausgeliefert wird. Default false.
SITE_NAME, BASE_PATH — bestehende App-Settings, unverändert.

Login und Registrierung sind bereits umgesetzt (src/app/api/auth/login, src/app/api/auth/register). Die aktuelle User-ID wird über getCurrentUserId() (src/lib/current-user.ts) bereitgestellt, das die ID aus dem signierten Session-Cookie via getSessionUserId() (src/lib/auth-session.ts) liest. Alle Queries und API-Routen nutzen ausschließlich diese Funktion und müssen bei Änderungen an der Auth-Logik nicht angefasst werden.
