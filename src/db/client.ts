import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
    // eslint-disable-next-line no-var
    var __dbClient: postgres.Sql | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}

// Reuse the connection across hot-reloads / module re-imports in dev
// instead of opening a new pool on every request.
const client = global.__dbClient ?? postgres(connectionString);
if (process.env.NODE_ENV !== "production") {
    global.__dbClient = client;
}

export const db = drizzle(client, { schema });
