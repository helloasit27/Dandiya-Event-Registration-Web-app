import { NextResponse } from "next/server";
import { claimDaysToFlush, markFlushed, readDay, recordView } from "@/lib/stats";
import { appendStatsRow } from "@/lib/statsSheet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Page-view beacon.
 *
 * Answers 204 with no body — it is called by sendBeacon, which ignores the
 * response, and a page view must never wait on analytics.
 *
 * This is also where the previous day's rollup gets written to the Sheet. Doing
 * it on the first visit after midnight avoids a scheduled function entirely:
 * one fewer moving part, and nothing to misconfigure. The trade is that a day
 * with no visitors at all is written late, when someone next arrives — which
 * for a site being actively promoted is not a real gap.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      v?: unknown;
      p?: unknown;
    };

    // The visitor id is generated in the browser and only ever added to a set
    // to be counted. Anything not shaped like our id is ignored rather than
    // stored, so this cannot be used to write arbitrary keys.
    const visitorId =
      typeof body.v === "string" && /^[a-z0-9]{8,40}$/.test(body.v)
        ? body.v
        : null;
    if (!visitorId) return new NextResponse(null, { status: 204 });

    await recordView(visitorId, body.p === "book");

    for (const day of await claimDaysToFlush()) {
      try {
        await appendStatsRow(await readDay(day));
        await markFlushed(day);
      } catch (error) {
        // Leave lastFlushed alone so the day is retried on a later view.
        console.error(`[stats] could not write ${day} to Sheets:`, error);
        break;
      }
    }
  } catch (error) {
    // Analytics must never surface to a visitor.
    console.error("[track] failed:", error);
  }
  return new NextResponse(null, { status: 204 });
}
