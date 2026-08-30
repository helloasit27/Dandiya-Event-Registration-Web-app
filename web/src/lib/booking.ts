import { z } from "zod";
import { MAX_PER_NIGHT, TICKET_PRICE } from "./event";

/**
 * One schema, used by the form on the client and re-run on the server.
 * The client copy gives instant field errors; the server copy is the one
 * that actually guards the booking, since anything can POST to the API.
 */
export const bookingInput = z
  .object({
    firstName: z.string().trim().min(1).max(60),
    lastName: z.string().trim().min(1).max(60),
    // Accept the digits the user typed in any spacing; normalise to 10.
    phone: z
      .string()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => /^[6-9]\d{9}$/.test(v), {
        message: "Enter a valid 10 digit Indian mobile number",
      }),
    email: z
      .union([z.literal(""), z.string().trim().email().max(120)])
      .default(""),
    day1: z.number().int().min(0).max(MAX_PER_NIGHT),
    day2: z.number().int().min(0).max(MAX_PER_NIGHT),
    accepted: z.literal(true),
    // Client-generated; makes a double-tap or a retry return the same booking.
    requestId: z.string().uuid(),
  })
  .refine((v) => v.day1 + v.day2 >= 1, {
    message: "Add at least one pass",
    path: ["day1"],
  });

export type BookingInput = z.infer<typeof bookingInput>;

export type BookingRecord = {
  bookingId: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  day1: number;
  day2: number;
  totalQty: number;
  amountDue: number;
  status: "reserved";
  /**
   * Booking numbers are sequential (that is what makes them collision-free),
   * which also makes them guessable — so the confirmation page, which shows a
   * name and mobile number, is gated on this unguessable token instead of on
   * the id alone. Never rendered to the page; it only travels in the URL.
   */
  accessToken: string;
};

/** What is safe to render on a confirmation page. */
export type PublicBooking = Omit<BookingRecord, "accessToken">;

export function toPublicBooking(b: BookingRecord): PublicBooking {
  const { accessToken: _accessToken, ...rest } = b;
  return rest;
}

/** Amounts are computed server-side only — the client never sends a price. */
export function priceBooking(day1: number, day2: number) {
  const totalQty = day1 + day2;
  return {
    totalQty,
    day1Total: day1 * TICKET_PRICE,
    day2Total: day2 * TICKET_PRICE,
    amountDue: totalQty * TICKET_PRICE,
  };
}
