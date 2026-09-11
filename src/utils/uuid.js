/**
 * Helper utility to ensure a string is a valid UUID string format for Spring Boot controllers.
 */
export function toUuid(id) {
  if (!id) return '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id))
  if (isUuid) return String(id)

  // Create a deterministic valid UUID from non-UUID string inputs
  let hash1 = 5381
  let hash2 = 0
  const s = String(id)
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i)
    hash1 = (hash1 * 33) ^ char
    hash2 = (hash2 * 31) + char
  }
  const hex1 = Math.abs(hash1).toString(16).padStart(8, '0').slice(-8)
  const hex2 = Math.abs(hash2).toString(16).padStart(12, '0').slice(-12)
  return `${hex1}-0000-4000-8000-${hex2}`
}
