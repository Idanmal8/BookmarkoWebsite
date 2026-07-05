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
    version: 'Client 0.1.12+22',
    date: '2026-07-05',
    title: 'Add a profile photo — and put a face to every post',
    summary: 'Make your profile yours with a real photo, and see who\'s behind each post. Pick a picture from your library or snap a new one; it shows on your profile, in the home welcome header, and next to your posts. Author photos now appear across the feed and fade in smoothly as they load.',
    changes: [
      { tag: 'feature', text: 'Upload a profile photo: tap your avatar and choose a picture from your gallery or take a new one with the camera. Prefer a preset? The emoji avatars are still there, and you can remove your photo any time to switch back.' },
      { tag: 'feature', text: 'Your photo now appears on your profile, in the home welcome header, and next to your posts in the feed.' },
      { tag: 'improvement', text: 'Post authors show their profile photo (or their initial when they haven\'t set one), so it\'s easy to see who shared what.' },
      { tag: 'improvement', text: 'Avatars fade in with a shimmer placeholder instead of popping in, and the loading state now appears the instant you start an upload.' },
      { tag: 'fix', text: 'Fixed a visual glitch on the "pick a book" sheet when composing a post.' },
    ],
  },
  {
    version: 'Client 0.1.10+20',
    date: '2026-06-20',
    title: 'A friendlier book status & reading-progress experience',
    summary: 'Client-side changes only — bundles into the next app release. On a book\'s page, changing your reading status and updating your progress both got a refresh: the status picker now expands inline instead of popping up a menu, and you can type your exact page instead of fighting the slider.',
    changes: [
      { tag: 'improvement', text: 'The reading-status control now expands inline on the book page — tap it to reveal Want to Read, Reading, Finished, and Did not finish, with your current choice marked, instead of a floating popup menu.' },
      { tag: 'feature', text: 'Set your exact page: tap the page number on the progress card to type the precise page you\'re on — handy when the slider won\'t land on the right page.' },
      { tag: 'improvement', text: 'Redesigned reading-progress card with a clearer percentage, a tappable page count, and the familiar slider kept for quick adjustments.' },
    ],
  },
  {
    version: 'Client 0.1.10+19',
    date: '2026-06-19',
    title: 'A calmer, more polished EPUB reader',
    summary: 'Client-side changes only — bundles into the next app release. The reader\'s visuals were refactored for a more immersive, modern feel: the controls now float as frosted-glass panels over the page, and opening a book reveals an already-settled page instead of the load jump.',
    changes: [
      { tag: 'improvement', text: 'The top and bottom controls are now floating, frosted-glass panels that detach from the screen edges, round their corners, and tint themselves to match your reader theme (Light, Sepia, or Dark).' },
      { tag: 'improvement', text: 'Opening a book now holds a themed loading veil over the reader until the page has rendered and settled on where you left off, then cross-fades away — so you no longer see the page jump or re-flow as it loads.' },
      { tag: 'improvement', text: 'Slightly larger page margins leave a clean gap between the text and the floating bars, so the first and last lines are never tucked behind them.' },
    ],
  },
  {
    version: 'Client 0.1.9+17',
    date: '2026-06-15',
    title: 'Smoother loading — skeleton screens everywhere',
    summary: 'Client-side changes only — bundles into the next app release. Spinners are replaced with shimmer skeletons shaped like the real content, so screens feel faster and no longer jump around as data arrives. Each part of a screen now loads on its own — the pieces that are ready show immediately instead of waiting for the slowest one.',
    changes: [
      { tag: 'improvement', text: 'Posts feed: shimmer post-card placeholders (avatar, cover, caption, actions) while the feed loads, instead of a single spinner.' },
      { tag: 'improvement', text: 'Library: a book-grid skeleton when you open a collection, and a currently-reading placeholder while your library loads.' },
      { tag: 'improvement', text: 'Leaderboard: shimmer row placeholders while the rankings load.' },
      { tag: 'improvement', text: 'Profile loads each section independently — your avatar and background appear the moment they\'re ready without waiting on your reading goal, stats, or EXP, each with its own placeholder.' },
      { tag: 'improvement', text: 'A single reusable shimmer effect shared across the app for a consistent loading look.' },
    ],
  },
  {
    version: 'Client 0.1.8+16',
    date: '2026-06-13',
    title: 'A reader built for focus — with translate, highlights, and read-aloud',
    summary: 'Client-side changes only — bundles into the next app release. The EPUB reader was rebuilt around reading: an immersive, distraction-free page with the controls tucked away until you want them. Tap to turn pages or reveal the bar, change the font, theme, and spacing, highlight passages, translate any selection on-device, ask Ginnie about a passage, or have the book read aloud to you.',
    changes: [
      { tag: 'feature', text: 'Immersive reading mode: tap the center of the page to hide the bars and give the text the whole screen, tap again to bring them back. Turn pages by swiping, tapping the page edges, or the new arrow buttons.' },
      { tag: 'feature', text: 'Display settings sheet: adjust font size, line spacing, font family (Book / Serif / Sans), and switch between Light, Sepia, and Dark themes — your choices are remembered across books.' },
      { tag: 'feature', text: 'Highlighter: select any text and pick one of four colors. Highlights are saved per book, listed in their own sheet (tap to jump back, swipe to delete), and tapping a highlight lets you remove it.' },
      { tag: 'feature', text: 'Translate any passage on-device: select text, choose from ten languages, and get an instant translation that works offline and for free — no data leaves your phone.' },
      { tag: 'feature', text: 'Ask Ginnie about what you\'re reading: select a passage, type a question, and get a streamed answer in context (premium feature).' },
      { tag: 'feature', text: 'Read aloud: have the book narrated to you, with a choice of just the current page or the whole book from where you are, plus an adjustable speech rate.' },
      { tag: 'feature', text: 'Chapters sheet for jumping straight to any chapter, and a progress scrubber to move anywhere in the book.' },
      { tag: 'improvement', text: 'The reader resumes exactly where you left off, and the progress bar now shows your real position the moment the book opens.' },
      { tag: 'improvement', text: 'Backing out of the reader is instant again — progress now syncs in the background instead of holding up the screen.' },
      { tag: 'improvement', text: 'Generous page margins so the first and last lines are never tucked behind the bars.' },
      { tag: 'fix', text: 'Fixed a freeze where swiping stopped working after jumping pages with the scrubber, chapters, or a font change.' },
      { tag: 'improvement', text: 'Full Hebrew and English copy throughout the new reader.' },
    ],
  },
  {
    version: 'Client 0.1.4+11',
    date: '2026-05-25',
    title: 'Import your Goodreads library in one tap',
    summary: 'Client-side changes only — bundles into the next app release. Bring your whole Goodreads history into Bookmarko without leaving the app: sign in to Goodreads, press Export Library, and we sync everything automatically. CSV upload is kept as a manual fallback.',
    changes: [
      { tag: 'feature', text: 'New "Import from Goodreads" entry in the profile settings sheet opens a dedicated screen with a step-by-step guide.' },
      { tag: 'feature', text: 'In-app Goodreads sign-in via WebView: we detect the CSV download the moment you tap Export Library and pipe it straight into your library — no copy/paste, no email round-trip, and your Goodreads cookies never leave the device.' },
      { tag: 'feature', text: 'Manual CSV upload fallback for users who already exported their library — only accepts files named goodreads_* so you can\'t pick the wrong CSV by mistake.' },
      { tag: 'feature', text: 'Import summary card breaks down what landed: rows in file, imported, skipped, failed, reviews created, and lists created — plus any rows that couldn\'t be matched.' },
      { tag: 'improvement', text: 'Library refreshes automatically the moment an import completes, so books appear without a restart.' },
      { tag: 'improvement', text: 'Goodreads shelves are rebuilt as Bookmarko collections, ratings become reviews, and reading status (Read / Currently Reading / Want to Read) maps to the right Bookmarko state.' },
      { tag: 'improvement', text: 'Hebrew + English copy throughout the import flow, with a polished step-based "How it works" intro and pill-shaped CTAs.' },
    ],
  },
  {
    version: 'Backend',
    date: '2026-05-25',
    title: 'Goodreads CSV import endpoint',
    summary: 'Backend changes only — no app update required. Powers the new in-app Goodreads import: a single multipart endpoint that parses a Goodreads export, resolves each row to a Bookmarko book, and rebuilds your library, reviews, and collections in one shot.',
    changes: [
      { tag: 'feature', text: 'New POST /library/import/goodreads accepts a Goodreads CSV and imports the user\'s full library, ratings, reviews, and shelves in a single call.' },
      { tag: 'improvement', text: 'Smart book resolution: tries existing-by-ISBN first, then Google Books ISBN lookup, then title + author search, and only falls back to a synthetic Goodreads record if nothing else matches — so imported books re-use the same canonical entries already in the database.' },
      { tag: 'improvement', text: 'Custom RFC4180 CSV parser handles Goodreads quirks (HTML in reviews, Excel-formula ISBN cells like ="0063433087", embedded newlines) without pulling in a third-party CSV library.' },
      { tag: 'improvement', text: 'Goodreads bookshelves are deduplicated against existing user_list rows by name, so re-importing won\'t create duplicate collections.' },
    ],
  },
  {
    version: 'Client 0.1.3+10',
    date: '2026-05-23',
    title: 'Easier way to add books and collections',
    summary: 'Client-side changes only — bundles into the next app release. Many users tapped the (+) in the library header expecting to search for a book; that button only created collections. The library now has a single floating (+) menu that makes both actions obvious.',
    changes: [
      { tag: 'feature', text: 'New expandable (+) floating button in the library opens a menu with two clear pill actions: "Add Book" (opens search) and "Collection" (opens the create-collection sheet).' },
      { tag: 'improvement', text: 'Removed the small (+) icon from the library header that previously only created collections and was being mistaken for a book-search shortcut.' },
    ],
  },
  {
    version: 'Client 0.1.3+9',
    date: '2026-05-22',
    title: 'Safer book deletion from status lists',
    summary: 'Client-side changes only — bundles into the next app release. Deleting a book while inside a system status list (Reading, Finished, etc.) now prompts a confirmation that explains the action removes the book from your entire library, with an opt-out for users who clean up in bulk.',
    changes: [
      { tag: 'fix', text: 'Tapping delete on a book inside a status list (Reading, Finished, Want to Read, DNF) no longer fails silently with a confusing "cannot manually remove" message.' },
      { tag: 'feature', text: 'New destructive confirmation dialog explains that status lists are filters, not folders — confirming deletes the book from the whole library along with its progress and notes.' },
      { tag: 'improvement', text: 'Added a "Don\'t show this again" option, persisted locally, so power users deleting many books in a row aren\'t re-prompted.' },
    ],
  },
  {
    version: 'Client 0.1.3+9',
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
    version: '0.1.3+9',
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
