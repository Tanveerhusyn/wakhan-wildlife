import { drizzle } from "drizzle-orm/vercel-postgres"
import { createPool, sql } from "@vercel/postgres"
import * as schema from "./schema"

/**
 * Vercel Postgres (Neon) through @vercel/postgres.
 *
 * The client is a real VercelPool (createPool), not the lazy `sql` proxy: drizzle only checks
 * out one dedicated connection for db.transaction() when the client is a VercelPool instance.
 * With the proxy, BEGIN, the statements and COMMIT could each run on a different pooled
 * connection, so a "transaction" was not atomic at all.
 *
 * createPool() throws without a connection string, so fall back to the lazy proxy then
 * (e.g. a build step that never touches the database).
 */
export const db = drizzle(process.env.POSTGRES_URL ? createPool() : sql, { schema })
export * from "./schema"
