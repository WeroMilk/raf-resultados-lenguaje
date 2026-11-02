/**
 * Concentrado de los cuatro subsistemas.
 * El filtro por zona no aplica: cada subsistema tiene su propio mapa.
 */
const ESCUELA_A_ZONA: Record<number, number> = {};

export function getNumeroEscuela(cct: string): number | null {
  const match = cct.match(/26(?:DST|EES|DES|ETV)(\d{4})/i);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  return num > 0 ? num : null;
}

export function getZonaFromCct(_cct: string): number | null {
  return null;
}

export const ZONAS_DISPONIBLES = [...new Set(Object.values(ESCUELA_A_ZONA))].sort((a, b) => a - b);
