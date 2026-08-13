// Tiny classnames helper — joins truthy class values, filters falsy ones.
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Turns "aditya.verma@example.com" into "Aditya Verma" — used to derive a
// display name on the mock login flow, which only collects an email.
export function nameFromEmail(email) {
  const local = String(email).split('@')[0] || 'Account'
  return local
    .split(/[.\-_+]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default cn
