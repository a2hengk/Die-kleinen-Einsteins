
Ich habe die **Overview-Page** (`/overview`, der Karteikasten) und die **Self-Study-Page** (`/selfstudy`, Lernmodus mit Flip-Animation) gebaut – jeweils komplette Seitenlogik plus CSS. Dazu kommt die **komplette Backend-Schicht dahinter**: die REST-API (`/api/cards` und `/api/progress`), die Datenbank-Anbindung mit Drizzle/Postgres und das Docker-Setup.

Karten werden jetzt **serverseitig gespeichert** statt im localStorage, d.h. sie bleiben über Sessions/Geräte erhalten. Beim Lernen wird richtig/falsch pro Karte gezählt und in der DB persistiert (`card_progress`-Tabelle).

**Für euch am wichtigsten – 3 Dinge, die ihr wissen solltet:**

1. **Kein echtes Login.** Alle teilen sich aktuell einen Platzhalter-User (`dev-user`). Sobald Login kommt, muss nur **eine** Funktion angepasst werden (`getCurrentUserId()`), alles andere filtert schon korrekt nach User.
2. **`docker compose up` migriert die DB nicht automatisch.** Bei frischer DB erst `npm run db:migrate` laufen lassen, sonst schlagen alle Card-/Progress-Endpoints fehl.
3. **Prod-Deployment (Vercel):** `DATABASE_URL` muss dort gesetzt sein, und beim Serverless-Betrieb den gepoolten Connection-String nutzen (sonst Verbindungslimit-Risiko).

Volle Doku mit allen Details (jede API-Route, DB-Schema, Docker, Webdesign) liegt in `docs/…` – nur bei Bedarf reinschauen.

----


**Beim Login-Einbau:**

- **`getCurrentUserId()`** (`src/lib/current-user.ts`) ist die *einzige* Stelle, die für Login angepasst werden muss – aber genau deshalb der gefährlichste Punkt. Sie gibt aktuell fest `dev-user` zurück. Wer Login baut und diese Funktion nicht ersetzt, bei dem funktioniert oberflächlich alles, aber **alle Nutzer teilen sich weiter einen Datensatz**. Das fällt erst spät auf.

- **`DEV_USER_ID` (Env-Variable):** Falls die irgendwo (z.B. auf einem Server oder in einer `.env`) gesetzt ist, überschreibt sie den Default. Nach dem Login-Einbau kann das dazu führen, dass ein Nutzer *still* auf `dev-user`-Daten landet, obwohl er eingeloggt ist. Vor dem Umbau checken, ob die Variable irgendwo gesetzt ist.

- **`user_id` ist ein freier Text-String, es gibt keine `users`-Tabelle.** Die neuen User-IDs aus dem Auth-System müssen also überall konsistent durchgereicht werden. Wichtig: Die alten `dev-user`-Karten in der DB werden nach dem Login **verwaist** – die sieht dann niemand mehr. Vor dem Go-Live einmal aufräumen oder migrieren.

- **`recordAnswer` verschluckt Fehler** (`.catch(() => {})` in `selfstudy/page.tsx`, Z. 102). Aktuell egal, aber mit echtem Login: Wenn eine Session abläuft, kommt ein 401 zurück – der wird still geschluckt, der Fortschritt wird **kommentarlos nicht gespeichert**, und der Nutzer merkt nichts. Sobald Login steht, sollte da mindestens ein Log/Hinweis rein.

- **Positiv, damit's keiner „kaputtfixt":** Die API gibt bei fremden Karten absichtlich `404` statt `403` zurück (kein Unterschied zwischen „existiert nicht" und „gehört jemand anderem"). Das ist gewollt – so kann niemand fremde IDs durchprobieren. Bitte nicht auf „richtige" 403 umbauen, das wäre ein Sicherheitsleck.


**Beim Home-Page-Einbau:**

- **Die Navbar-Routing-Logik ist fest verdrahtet** auf `/overview`, `/selfstudy`, `/abfrage`. Aktuell ist die **Overview-Page der Einstiegspunkt/Hub** der App. Sobald eine Home-Page dazukommt (und evtl. die Route `/` belegt), muss die Navbar angepasst werden – sonst zeigt die Navigation ins Leere oder umgeht die neue Startseite.

- **Beide Seiten laden immer *alle* Karten** über `GET /api/cards` (keine Pagination, keine Teilmengen). Eine Home-Page mit Dashboard/Statistik müsste zusätzlich `GET /api/progress` nutzen. Bei sehr vielen Karten pro User wird „alles auf einmal laden" irgendwann unschön – für den Anfang okay, aber im Hinterkopf behalten.
