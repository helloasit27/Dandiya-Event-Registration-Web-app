import { JWT } from "google-auth-library";
import type { BookingRecord } from "./booking";
import { NIGHTS } from "./event";

/**
 * Appends each reservation to the team's Google Sheet as it happens, so the
 * callers working the phones see new rows without anyone exporting anything.
 *
 * Uses the Sheets REST endpoint directly (rather than the full `googleapis`
 * bundle) to keep serverless cold starts small. `append` is server-side
 * atomic — concurrent appends get their own rows, never the same one.
 */

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

export const SHEET_HEADERS = [
  "Booking ID",
  "Reserved at (IST)",
  "First name",
  "Last name",
  "Mobile",
  "Email",
  `${NIGHTS[0].name} (17 Oct) qty`,
  `${NIGHTS[1].name} (18 Oct) qty`,
  "Total passes",
  "Amount due",
  "Status",
  "Payment collected",
  "Notes",
];

let client: JWT | null = null;

function getClient(): JWT | null {
  if (client) return client;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Vercel/Netlify env vars store the key with literal \n sequences.
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !key) return null;

  client = new JWT({ email, key, scopes: SCOPES });
  return client;
}

export function sheetsConfigured(): boolean {
  return Boolean(getClient() && process.env.GOOGLE_SHEET_ID);
}

function istTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function toRow(b: BookingRecord): (string | number)[] {
  return [
    b.bookingId,
    istTimestamp(b.createdAt),
    b.firstName,
    b.lastName,
    // Leading apostrophe keeps Sheets from eating the number's formatting.
    `'${b.phone}`,
    b.email || "—",
    b.day1,
    b.day2,
    b.totalQty,
    b.amountDue,
    "Reserved · payment pending",
    "", // filled in by the team after the call
    "",
  ];
}

export async function appendBookingRow(booking: BookingRecord): Promise<void> {
  const auth = getClient();
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const tab = process.env.GOOGLE_SHEET_TAB || "Bookings";

  if (!auth || !sheetId) {
    console.warn(
      `[sheets] not configured — booking ${booking.bookingId} was not mirrored to Sheets`
    );
    return;
  }

  const { token } = await auth.getAccessToken();
  if (!token) throw new Error("Could not obtain a Google access token");

  const range = encodeURIComponent(`${tab}!A:M`);
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append` +
    `?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [toRow(booking)] }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Sheets append failed (${res.status}): ${detail.slice(0, 300)}`);
  }
}
