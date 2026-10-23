// Backend enums come back as SCREAMING_SNAKE_CASE (e.g. "MARUTI_SUZUKI",
// "MERCEDES_BENZ"). This renders them the way the rest of the UI expects —
// "Maruti Suzuki" — while keeping well-known abbreviations uppercase.
const KEEP_UPPERCASE = new Set(['CNG', 'LPG', 'AMT', 'CVT', 'DCT', 'IMT', 'SUV', 'MG'])

export function titleCaseEnum(value) {
  if (!value) return ''
  return value
    .split('_')
    .map((word) => (KEEP_UPPERCASE.has(word) ? word : word.charAt(0) + word.slice(1).toLowerCase()))
    .join(' ')
}

// Used whenever a listing has no uploaded photos yet.
export const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'
