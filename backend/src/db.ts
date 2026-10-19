import { Pool } from "pg";
import { loadConfig } from "./config";

const config = loadConfig();

export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});
