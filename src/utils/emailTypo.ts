// "Did you mean gmail.com?" for the newsletter form. The API runs the same
// check and is the one that actually decides; keep the list and the rules in
// step with BookmarkoBackend/src/newsletter/email-check.ts.
const COMMON_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'hotmail.com',
  'hotmail.co.il',
  'live.com',
  'msn.com',
  'yahoo.com',
  'yahoo.co.uk',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'gmx.com',
  'gmx.de',
  'mail.com',
  'walla.co.il',
  'walla.com',
  'zahav.net.il',
  'bezeqint.net',
  'netvision.net.il',
  'yandex.com',
]

const COM_TYPOS = new Set(['con', 'cmo', 'ocm', 'vom', 'xom', 'cpm', 'clm', 'comm', 'coom', 'om'])

/** Edits, plus swapping two neighbours ("gmial") as one. */
function editDistance(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...new Array<number>(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
      }
    }
  }
  return d[a.length][b.length]
}

/** The address with its domain fixed, or null when it looks intended. */
export function suggestEmail(email: string): string | null {
  const at = email.lastIndexOf('@')
  if (at < 1) return null
  const local = email.slice(0, at)
  const domain = email.slice(at + 1).toLowerCase()
  // Wait until the domain looks finished, so the hint doesn't flicker while typing.
  if (!domain.includes('.') || domain.endsWith('.') || COMMON_DOMAINS.includes(domain)) return null

  let best: string | null = null
  let bestDistance = Infinity
  for (const known of COMMON_DOMAINS) {
    const limit = known.length <= 7 ? 1 : 2
    const distance = editDistance(domain, known)
    if (distance <= limit && distance < bestDistance) {
      best = known
      bestDistance = distance
    }
  }
  if (best) return `${local}@${best}`

  const dot = domain.lastIndexOf('.')
  if (COM_TYPOS.has(domain.slice(dot + 1))) return `${local}@${domain.slice(0, dot)}.com`
  return null
}
