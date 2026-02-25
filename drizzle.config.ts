import { defineConfig } from "drizzle-kit";

const url = process.env.DB_URL;
if (!url) throw new Error("DB_URL is not set");


export default defineConfig({
  schema: "src/db/schema.ts",
  out: "src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: url,
  },
});