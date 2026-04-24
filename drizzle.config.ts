import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "netlify/database/migrations",
  // @ts-expect-error — `prefix` is accepted at runtime in drizzle-kit@beta but missing from the published types.
  migrations: { prefix: "timestamp" },
});
