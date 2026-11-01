// Aceita só inteiros positivos que cabem na coluna INTEGER do PostgreSQL
export function isValidId(valor: unknown): boolean {
  return typeof valor === "number" && Number.isInteger(valor) && valor > 0 && valor <= 2147483647;
}