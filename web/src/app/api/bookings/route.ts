import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import {
  bookingInput,
  priceBooking,
  toPublicBooking,
  type BookingRecord,
} from "@/lib/booking";
import { appendBookingRow } from "@/lib/sheets";
import { claimBookingId, markUnsynced, saveBooking } from "@/lib/store";

// google-auth-library signs a JWT with node:crypto, so this must not run on edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = bookingInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "invalid_booking",
        // Field-keyed so the form can highlight exactly what to fix.
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  const input = parsed.data;

  try {
    const claim = await claimBookingId(input.requestId);

    // A double-tap or a network retry returns the original booking rather
    // than reserving a second set of passes for the same person.
    if (claim.kind === "duplicate") {
      return NextResponse.json(
        {
          booking: toPublicBooking(claim.booking),
          token: claim.booking.accessToken,
          duplicate: true,
        },
        { status: 200 }
      );
    }

    const { totalQty, amountDue } = priceBooking(input.day1, input.day2);

    const booking: BookingRecord = {
      bookingId: claim.bookingId,
      createdAt: new Date().toISOString(),
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      email: input.email,
      day1: input.day1,
      day2: input.day2,
      totalQty,
      amountDue,
      status: "reserved",
      accessToken: randomBytes(16).toString("hex"),
    };

    await saveBooking(input.requestId, booking);

    // The reservation is already durable at this point. Sheets is a mirror for
    // the phone team, so a failure there must not fail the customer's booking —
    // it gets queued for replay instead.
    try {
      await appendBookingRow(booking);
    } catch (error) {
      console.error(
        `[bookings] Sheets mirror failed for ${booking.bookingId}:`,
        error
      );
      await markUnsynced(booking.bookingId).catch(() => {});
    }

    return NextResponse.json(
      { booking: toPublicBooking(booking), token: booking.accessToken },
      { status: 201 }
    );
  } catch (error) {
    console.error("[bookings] reservation failed:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
