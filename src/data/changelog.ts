export type ChangelogTag = 'feature' | 'improvement' | 'fix' | 'chore'

export interface ChangelogChange {
  tag: ChangelogTag
  text: string
}

export interface ChangelogEntry {
  version: string
  date: string
  title?: string
  summary?: string
  changes: ChangelogChange[]
}

export const changelog: ChangelogEntry[] = [
  {
    version: 'Client',
    date: '2026-05-22',
    title: 'Cross-source descriptions + safer release builds',
    summary: 'Client-side changes only — bundles into the next app release. Hebrew books missing a description in their primary provider now get one from NLI automatically, and archive builds can no longer accidentally point at sandbox.',
    changes: [
      { tag: 'improvement', text: 'Book details now ask the backend to cross-source a description by title — e.g. a Google entry with no synopsis can pick up its Hebrew abstract from NLI.' },
      { tag: 'fix', text: 'Release/Archive builds now always point at production, even when a stale local dart-define is left over in the iOS build config from a recent development run.' },
      { tag: 'improvement', text: 'Debug and profile builds default to sandbox without needing an explicit dart-define flag — matches what developers actually want when running from VS Code or Xcode.' },
    ],
  },
  {
    version: 'Backend',
    date: '2026-05-22',
    title: 'Hebrew-language book search via NLI',
    summary: 'Backend changes only — no app update required. Hebrew searches now lead with results from the National Library of Israel, and missing book descriptions are repaired automatically from NLI when other providers don\'t have one.',
    changes: [
      { tag: 'feature', text: 'Hebrew searches now query the National Library of Israel (NLI) alongside Google Books and Open Library, with NLI results ranked first.' },
      { tag: 'feature', text: 'Book details fall back to an NLI lookup-by-title when the primary provider returns no description, so Hebrew books no longer show up blank.' },
      { tag: 'improvement', text: 'NLI cover thumbnails and Hebrew abstracts (from MARC 520) flow through to the app for matching books.' },
      { tag: 'improvement', text: 'Non-Hebrew searches are unchanged — NLI is only consulted when it can actually help.' },
    ],
  },
  {
    version: '0.1.2+9',
    date: '2026-05-21',
    title: 'Ginnie chat keyboard polish',
    summary: 'Fixed the floating navigation bar overlapping the Ginnie chat input when the keyboard opens.',
    changes: [
      { tag: 'fix', text: 'Floating nav no longer slides up and covers the Ginnie chat input when the keyboard appears.' },
      { tag: 'improvement', text: 'Chat input now sits cleanly above the keyboard and returns to its normal position when dismissed.' },
    ],
  },
  {
    version: '0.1.2+8',
    date: '2026-05-21',
    title: 'Sign-in hardening',
    summary: 'Tightened the IAP flow, switched App Attest to production, and surfaced clearer sign-in errors.',
    changes: [
      { tag: 'feature', text: 'Detailed error descriptions on sign-in failures.' },
      { tag: 'improvement', text: 'Hardened in-app purchase flow on iOS.' },
      { tag: 'chore', text: 'Bumped Android build for Play Store release.' },
    ],
  },
]
