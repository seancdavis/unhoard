import { drizzle } from "drizzle-orm/netlify-db";
import * as schema from "./schema.js";

if (process.env.NETLIFY_DEV === "true") {
  process.env.NETLIFY_DB_DRIVER = "server";
}

export const db = drizzle({ schema });
export * from "./schema.js";
