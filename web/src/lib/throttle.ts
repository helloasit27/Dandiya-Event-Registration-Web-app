import { getRedis } from "./store";

/**
 * Spend limiter for the public booking endpoint.
 *
 * The endpoint is unauthenticated and every call costs a serverless
 * invocation, a booking number and a Google Sheets write. A loop pointed at it
 * would burn the host plan's credits and fill the team's call sheet with junk,
 * so it is capped on two axes:
 *
 *  - per IP, to stop one script hammering it;
 *  - globally, as a circuit breaker, because per-IP limits do nothing against
 *    a request spread over many addresses.
 *
 * The per-IP limit is deliberately loose. Indian mobile carriers put large
 * numbers of subscribers behind a handful of CGNAT addresses, so a tight
 * per-IP cap would lock out real customers sharing an operator with whoever
 * booked before them. It only needs to be low enough to make a script
 * pointless, not low enough to model one person's behaviour.
 *
 * The global cap sits far above any plausible real booking rate — an event
 * this size will not see 300 genuine bookings inside an hour — so in practice
 * it only ever trips on abuse.
 */

const PER_IP_LIMIT = 20;
const PER_IP_WINDOW_S = 600; // 10 minutes
const GLOBAL_LIMIT = 300;
const GLOBAL_WINDOW_S = 3600; // 1 hour

export type ThrottleResult =
  | { ok: true }
  | { ok: false; scope: "ip" | "global"; retryAfter: number };

/**
 * Netlify sets x-nf-client-connection-ip; other hosts use x-forwarded-for,
 * whose first entry is the client. Unknown addresses share one bucket, which
 * is the safe direction: an attacker cannot escape the limit by hiding, and a
 * genuine customer whose IP we cannot read still gets 20 attempts.
 */
export function clientIp(request: Request): string {
  const direct = request.headers.get("x-nf-client-connection-ip");
  if (direct) return direct;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

async function bump(
  key: string,
  windowSeconds: number
): Promise<number | null> {
  const r = getRedis();
  if (!r) return null; // dev fallback: nothing to meter against
  const count = await r.incr(key);
  // Only the first request in a window sets the TTL, so the window is fixed
  // rather than sliding forward with every hit.
  if (count === 1) await r.expire(key, windowSeconds);
  return count;
}

export async function checkBookingThrottle(
  request: Request
): Promise<ThrottleResult> {
  try {
    const now = Date.now();
    const ipBucket = Math.floor(now / (PER_IP_WINDOW_S * 1000));
    const globalBucket = Math.floor(now / (GLOBAL_WINDOW_S * 1000));

    const ipCount = await bump(
      `dandiya:rl:ip:${clientIp(request)}:${ipBucket}`,
      PER_IP_WINDOW_S
    );
    if (ipCount !== null && ipCount > PER_IP_LIMIT) {
      return { ok: false, scope: "ip", retryAfter: PER_IP_WINDOW_S };
    }

    const globalCount = await bump(
      `dandiya:rl:all:${globalBucket}`,
      GLOBAL_WINDOW_S
    );
    if (globalCount !== null && globalCount > GLOBAL_LIMIT) {
      return { ok: false, scope: "global", retryAfter: 300 };
    }

    return { ok: true };
  } catch (error) {
    // Fail open. A customer must never lose a booking because the rate
    // limiter itself was unavailable — the cost of letting a few extra
    // requests through is far smaller than the cost of a refused sale.
    console.error("[throttle] check failed, allowing request:", error);
    return { ok: true };
  }
}
