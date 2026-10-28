/** Convert ISO string to value for <input type="datetime-local" /> */
export function toDateTimeLocalValue(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const pad = (value: number) => String(value).padStart(2, '0')

  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    'T',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes()),
  ].join('')
}

/** Convert datetime-local value to ISO 8601 */
export function fromDateTimeLocalValue(value: string): string {
  return new Date(value).toISOString()
}
