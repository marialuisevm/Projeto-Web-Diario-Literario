import fs from "fs";
import path from "path";
import { pool } from "./src/db";

async function runMigrations() {
  try {
    console.log("A iniciar migrações...");

    const migrationsDir = path.join(__dirname, "migrations");
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      if (file.endsWith(".sql")) {
        console.log(`A aplicar migração: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
        await pool.query(sql);
      }
    }

    console.log("Todas as tabelas foram criadas com sucesso!");
  } catch (error) {
    console.error("Erro ao executar as migrações:", error);
  } finally {
    await pool.end();
  }
}

runMigrations();
