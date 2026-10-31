/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  /** Sandbox API that hosts Idan's newsletter. Falls back to VITE_API_BASE_URL. */
  readonly VITE_NEWSLETTER_API_BASE_URL?: string
  /** GA4 measurement ID (`G-…`). Absent outside the deploy workflow. */
  readonly VITE_GA_MEASUREMENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
