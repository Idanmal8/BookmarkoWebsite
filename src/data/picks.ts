/**
 * Idan's Amazon picks, rendered at `/idan/picks` (`PicksPage.vue`).
 *
 * To add a pick: find the product's ASIN (the 10 characters after `/dp/` in any
 * Amazon URL), drop a cover into `public/links/covers/`, and add an entry below.
 * The affiliate tag is added for you by `amazonUrl()`.
 *
 * Amazon's Operating Agreement: do NOT hardcode prices or Amazon-hosted images
 * here. Covers come from Open Library (free to reuse) and are self-hosted.
 */

export const AMAZON_TAG = 'bookmarkostor-20'

export function amazonUrl(asin: string) {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`
}

export interface Pick {
  asin: string
  title: string
  author: string
  /** File in `public/links/covers/`. */
  cover: string
  /** One line under the title. TODO(Idan): swap these for your own take; "why I love it" sells. */
  note: string
  /** Small chip on the cover, e.g. Kindle / Audible. */
  format?: string
}

export interface Shelf {
  id: string
  title: string
  subtitle?: string
  picks: Pick[]
}

export const shelves: Shelf[] = [
  {
    id: 'red-rising',
    title: 'The Red Rising saga',
    subtitle: 'Pierce Brown. Start here, thank me later.',
    picks: [
      { asin: '034553980X', title: 'Red Rising', author: 'Pierce Brown', cover: 'red-rising.jpg', note: 'Book 1. A miner on Mars infiltrates the ruling Golds.' },
      { asin: 'B00R6OOUV8', title: 'Golden Son', author: 'Pierce Brown', cover: 'golden-son.jpg', note: 'Book 2. The war gets bigger.', format: 'Audible' },
      { asin: '0345539869', title: 'Morning Star', author: 'Pierce Brown', cover: 'morning-star.jpg', note: "Book 3. The trilogy's finale." },
      { asin: '0593871529', title: 'Red Rising: Deluxe Edition', author: 'Pierce Brown', cover: 'red-rising.jpg', note: 'The collector’s edition of book 1, in a slipcase.', format: 'Deluxe' },
    ],
  },
  {
    id: 'murakami',
    title: 'The Murakami corner',
    subtitle: 'Strange, quiet, impossible to forget.',
    picks: [
      { asin: 'B000FC2ROU', title: 'Kafka on the Shore', author: 'Haruki Murakami', cover: 'kafka-on-the-shore.jpg', note: 'A runaway teen and an old man who talks to cats.', format: 'Kindle' },
      { asin: 'B003XT603Q', title: 'Norwegian Wood', author: 'Haruki Murakami', cover: 'norwegian-wood.jpg', note: 'His most grounded love story.', format: 'Kindle' },
      { asin: 'B0CW1FLGJV', title: 'The City and Its Uncertain Walls', author: 'Haruki Murakami', cover: 'city-uncertain-walls.jpg', note: 'His newest: a walled town and a lost first love.', format: 'Kindle' },
    ],
  },
  {
    id: 'thrillers',
    title: "Can't-put-down thrillers",
    subtitle: 'Clear your evening first.',
    picks: [
      { asin: '125030170X', title: 'The Silent Patient', author: 'Alex Michaelides', cover: 'silent-patient.jpg', note: 'She shot her husband, then never spoke again.' },
      { asin: '059318324X', title: 'The Only One Left', author: 'Riley Sager', cover: 'only-one-left.jpg', note: 'A caretaker, an old murder case, a house on a cliff.' },
    ],
  },
  {
    id: 'fun',
    title: 'Pure fun',
    subtitle: 'For when you need to laugh out loud.',
    picks: [
      { asin: 'B08BKGYQXW', title: 'Dungeon Crawler Carl', author: 'Matt Dinniman', cover: 'dungeon-crawler-carl.jpg', note: "Earth's gone. Survive the dungeon, live on TV.", format: 'Kindle' },
    ],
  },
]
