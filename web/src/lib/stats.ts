import { getRedis } from "./store";

/**
 * Daily traffic and booking counters, rolled up into one Sheet row per day.
 *
 * Deliberately aggregate. Writing a row per page view would make the sheet
 * unreadable within a week and blow past Sheets' write quota; what the team
 * actually needs is "how many people came, how many booked" per day, next to
 * the bookings themselves — which is the one thing an analytics tool cannot
 * show, because the bookings live in this spreadsheet.
 *
 * Counters live in Redis under IST day keys so a "day" matches the business
 * day, not UTC. They expire after 45 days: long enough to survive a missed
 * flush across the whole campaign, short enough not to accumulate.
 */

const TTL_SECONDS = 45 * 24 * 3600;

export type DayStats = {
  date: string;
  views: number;
  uniques: number;
  bookViews: number;
  bookings: number;
  passes: number;
  amount: number;
};

/** YYYY-MM-DD in IST, so the day rolls over at midnight in Rourkela. */
export function istDay(at: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD, which sorts correctly as a string.
  return at.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export function previousDay(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

const k = (day: string, field: string) => `stats:d:${day}:${field}`;

/** One page view. `visitorId` is a random client-side id, only ever hashed into a set. */
export async function recordView(
  visitorId: string,
  isBookingPage: boolean
): Promise<void> {
  const r = getRedis();
  if (!r) return;
  const day = istDay();

  await r.incr(k(day, "views"));
  await r.expire(k(day, "views"), TTL_SECONDS);
  await r.sadd(k(day, "uniques"), visitorId);
  await r.expire(k(day, "uniques"), TTL_SECONDS);
  if (isBookingPage) {
    await r.incr(k(day, "bookViews"));
    await r.expire(k(day, "bookViews"), TTL_SECONDS);
  }
}

/** One completed reservation. Called from the booking route, never fails it. */
export async function recordBooking(
  passes: number,
  amount: number
): Promise<void> {
  const r = getRedis();
  if (!r) return;
  const day = istDay();
  await r.incr(k(day, "bookings"));
  await r.expire(k(day, "bookings"), TTL_SECONDS);
  await r.incrby(k(day, "passes"), passes);
  await r.expire(k(day, "passes"), TTL_SECONDS);
  await r.incrby(k(day, "amount"), amount);
  await r.expire(k(day, "amount"), TTL_SECONDS);
}

export async function readDay(day: string): Promise<DayStats> {
  const r = getRedis();
  if (!r) {
    return { date: day, views: 0, uniques: 0, bookViews: 0, bookings: 0, passes: 0, amount: 0 };
  }
  const [views, uniques, bookViews, bookings, passes, amount] = await Promise.all([
    r.get<number>(k(day, "views")),
    r.scard(k(day, "uniques")),
    r.get<number>(k(day, "bookViews")),
    r.get<number>(k(day, "bookings")),
    r.get<number>(k(day, "passes")),
    r.get<number>(k(day, "amount")),
  ]);
  return {
    date: day,
    views: Number(views ?? 0),
    uniques: Number(uniques ?? 0),
    bookViews: Number(bookViews ?? 0),
    bookings: Number(bookings ?? 0),
    passes: Number(passes ?? 0),
    amount: Number(amount ?? 0),
  };
}

const LAST_FLUSHED = "stats:lastFlushed";
const FLUSH_LOCK = "stats:flushLock";

/**
 * Which completed days still need writing to the Sheet.
 *
 * Only whole days are written, so a row is never revised after the fact. The
 * lock stops concurrent visitors all flushing the same day — it is short-lived,
 * so a crashed flush simply retries on the next page view rather than wedging.
 */
export async function claimDaysToFlush(): Promise<string[]> {
  const r = getRedis();
  if (!r) return [];

  const yesterday = previousDay(istDay());
  const last = await r.get<string>(LAST_FLUSHED);

  // First ever run: start the record from today, don't backfill empty history.
  if (!last) {
    await r.set(LAST_FLUSHED, yesterday);
    return [];
  }
  if (last >= yesterday) return [];

  const gotLock = await r.set(FLUSH_LOCK, "1", { nx: true, ex: 120 });
  if (!gotLock) return [];

  const days: string[] = [];
  let cursor = yesterday;
  // Cap the walk so a long-dormant site cannot produce an unbounded write.
  while (cursor > last && days.length < 14) {
    days.push(cursor);
    cursor = previousDay(cursor);
  }
  return days.reverse();
}

export async function markFlushed(day: string): Promise<void> {
  const r = getRedis();
  if (!r) return;
  await r.set(LAST_FLUSHED, day);
}
