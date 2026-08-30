import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { appendBookingRow } from "@/lib/sheets";
import { writeHeaderRow } from "@/lib/sheetsAdmin";
import { getBooking, markUnsynced, takeUnsynced } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Operator endpoint, guarded by ADMIN_TOKEN:
 *
 *   ?action=init    write the sheet's header row (run once at setup)
 *   ?action=replay  push any bookings that missed the Sheets mirror
 *
 * `replay` is the drain for the queue that a Sheets outage fills. Point a cron
 * at it (Vercel Cron / Netlify Scheduled Function) and a Sheets outage becomes
 * self-healing instead of a manual reconciliation.
 */

function authorised(request: Request): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;

  const provided = request.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!provided) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!authorised(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const action = new URL(request.url).searchParams.get("action");

  try {
    if (action === "init") {
      await writeHeaderRow();
      return NextResponse.json({ ok: true, action: "init" });
    }

    if (action === "replay") {
      const ids = await takeUnsynced();
      const synced: string[] = [];
      const failed: string[] = [];

      for (const id of ids) {
        const booking = await getBooking(id);
        if (!booking) continue; // nothing to replay; drop it from the queue

        try {
          await appendBookingRow(booking);
          synced.push(id);
        } catch (error) {
          console.error(`[admin] replay failed for ${id}:`, error);
          // Put it back so the next run picks it up again.
          await markUnsynced(id).catch(() => {});
          failed.push(id);
        }
      }

      return NextResponse.json({ ok: true, action: "replay", synced, failed });
    }

    return NextResponse.json(
      { error: "unknown_action", expected: ["init", "replay"] },
      { status: 400 }
    );
  } catch (error) {
    console.error("[admin] action failed:", error);
    return NextResponse.json(
      { error: "action_failed", detail: String(error) },
      { status: 500 }
    );
  }
}
