/** Formata um valor em kwanzas: 3500 → "3 500 Kz". */
export function formatKz(value: number): string {
  return `${Math.round(value).toLocaleString('pt-PT')} Kz`
}
