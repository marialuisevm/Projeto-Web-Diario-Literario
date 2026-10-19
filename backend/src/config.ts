export interface AppConfig {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
}

export function loadConfig(): AppConfig {
  const databaseUrl = process.env.DATABASE_URL;
  const jwtSecret = process.env.JWT_SECRET;

  if (!databaseUrl) {
    throw new Error("Falha na inicialização: DATABASE_URL não está definida no .env");
  }

  if (!jwtSecret) {
    throw new Error("Falha na inicialização: JWT_SECRET não está definida no .env");
  }

  return {
    port: parseInt(process.env.PORT ?? "3000", 10),
    databaseUrl,
    jwtSecret,
  };
}
