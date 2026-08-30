import { Redis } from "@upstash/redis";
import type { BookingRecord } from "./booking";

/**
 * Booking IDs must be unique even when several people tap "Reserve" in the
 * same second, on different serverless instances. A random number (as in the
 * prototype) collides; a "read max then +1" collides harder. So the number
 * comes from a single atomic INCR that Redis serialises for us.
 *
 * Redis is also where a booking lives if the Google Sheet write fails, so a
 * reservation is never lost just because Sheets was slow or rate-limited.
 */

const SEQ_KEY = "dandiya:booking:seq";
const SEQ_START = 100_000; // first booking reads DD100001, matching the design's DD###### shape
const IDEM_TTL = 60 * 60 * 24; // a retry of the same submit is idempotent for 24h
const PENDING = "__pending__";

let redis: Redis | null = null;
let memoryFallbackWarned = false;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

/**
 * Dev-only fallback so `npm run dev` works with no services configured.
 * It is per-process, so it does NOT give real cross-instance atomicity —
 * production must set the Upstash vars.
 *
 * It hangs off globalThis because Next.js compiles routes and pages into
 * separate server bundles: a plain module-level object would give the API
 * route and the confirmation page two different Maps, and the page would
 * never find the booking the route just wrote.
 */
type MemoryStore = {
  seq: number;
  idem: Map<string, string>;
  bookings: Map<string, BookingRecord>;
  unsynced: string[];
};

const globalForMemory = globalThis as typeof globalThis & {
  __dandiyaMemoryStore?: MemoryStore;
};

const memory: MemoryStore = (globalForMemory.__dandiyaMemoryStore ??= {
  seq: SEQ_START,
  idem: new Map(),
  bookings: new Map(),
  unsynced: [],
});

function warnMemory() {
  if (memoryFallbackWarned) return;
  memoryFallbackWarned = true;
  console.warn(
    "[store] UPSTASH_REDIS_REST_URL/TOKEN not set — using in-memory booking store. " +
      "Booking IDs are only unique within this process. Do not run production this way."
  );
}

export type ClaimResult =
  | { kind: "new"; bookingId: string }
  | { kind: "duplicate"; booking: BookingRecord };

/**
 * Reserve the idempotency key and allocate a booking number, atomically.
 * Returns `duplicate` when this requestId already produced a booking.
 */
export async function claimBookingId(requestId: string): Promise<ClaimResult> {
  const key = `dandiya:idem:${requestId}`;
  const r = getRedis();

  if (!r) {
    warnMemory();
    const existing = memory.idem.get(key);
    if (existing && existing !== PENDING) {
      const booking = memory.bookings.get(existing);
      if (booking) return { kind: "duplicate", booking };
    }
    memory.idem.set(key, PENDING);
    memory.seq += 1;
    return { kind: "new", bookingId: formatBookingId(memory.seq) };
  }

  // Win the slot, or discover someone else already has it.
  const won = await r.set(key, PENDING, { nx: true, ex: IDEM_TTL });
  if (!won) {
    const existingId = await waitForBookingId(r, key);
    if (existingId) {
      const booking = await getBooking(existingId);
      if (booking) return { kind: "duplicate", booking };
    }
    // The in-flight twin never finished (crashed mid-write). Take the slot over
    // rather than leaving the customer stuck behind a dead request.
    await r.set(key, PENDING, { ex: IDEM_TTL });
  }

  const seq = await r.incr(SEQ_KEY);
  return { kind: "new", bookingId: formatBookingId(SEQ_START + seq) };
}

/** A concurrent twin is mid-write; give it a moment to publish its booking id. */
async function waitForBookingId(r: Redis, key: string): Promise<string | null> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const value = await r.get<string>(key);
    if (value && value !== PENDING) return value;
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
  return null;
}

function formatBookingId(n: number): string {
  return `DD${n}`;
}

export async function saveBooking(
  requestId: string,
  booking: BookingRecord
): Promise<void> {
  const idemKey = `dandiya:idem:${requestId}`;
  const bookingKey = `dandiya:booking:${booking.bookingId}`;
  const r = getRedis();

  if (!r) {
    memory.bookings.set(booking.bookingId, booking);
    memory.idem.set(idemKey, booking.bookingId);
    return;
  }

  await Promise.all([
    r.set(bookingKey, JSON.stringify(booking)),
    r.set(idemKey, booking.bookingId, { ex: IDEM_TTL }),
    // A flat list makes the whole day's bookings recoverable/replayable.
    r.lpush("dandiya:bookings", booking.bookingId),
  ]);
}

export async function getBooking(
  bookingId: string
): Promise<BookingRecord | null> {
  const r = getRedis();
  if (!r) return memory.bookings.get(bookingId) ?? null;

  const raw = await r.get<string | BookingRecord>(
    `dandiya:booking:${bookingId}`
  );
  if (!raw) return null;
  return typeof raw === "string" ? (JSON.parse(raw) as BookingRecord) : raw;
}

/**
 * Sheets is a mirror, not the system of record. When a write fails the
 * booking id lands here so it can be replayed instead of silently lost.
 */
export async function markUnsynced(bookingId: string): Promise<void> {
  const r = getRedis();
  if (!r) {
    memory.unsynced.push(bookingId);
    return;
  }
  await r.lpush(UNSYNCED_KEY, bookingId);
}

const UNSYNCED_KEY = "dandiya:sheets:unsynced";

/**
 * Drains the replay queue. Anything that fails again is pushed back by the
 * caller, so a booking is never dropped from the queue without reaching Sheets.
 */
export async function takeUnsynced(): Promise<string[]> {
  const r = getRedis();
  if (!r) {
    return memory.unsynced.splice(0, memory.unsynced.length);
  }

  const ids: string[] = [];
  // Pop one at a time so a crash mid-replay loses at most the in-flight id,
  // which the caller re-queues anyway.
  for (;;) {
    const id = await r.rpop<string>(UNSYNCED_KEY);
    if (!id) break;
    ids.push(id);
  }
  return ids;
}
