/**
 * Google Analytics 4 (gtag.js).
 *
 * The measurement ID is injected at build time via `VITE_GA_MEASUREMENT_ID`
 * (set in `.github/workflows/deploy.yml`). When it is missing — local `npm run dev`
 * and any build without the variable — nothing is loaded and no hits are sent,
 * so development traffic stays out of the production property.
 */

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export function initAnalytics(): void {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
  if (!measurementId) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // gtag.js requires the raw `arguments` object — not a rest-parameter array.
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId)
}
