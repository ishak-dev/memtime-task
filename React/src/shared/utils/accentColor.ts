const ACCENTS = ['#2ea44f', '#f5a623', '#e91e8c', '#9b59b6', '#3b82f6'] as const

export function getAccentColor(id: number): string {
  return ACCENTS[Math.abs(id) % ACCENTS.length]
}
