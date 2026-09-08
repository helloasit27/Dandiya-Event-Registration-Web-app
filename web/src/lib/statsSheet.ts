import { getSheetsToken } from "./sheets";
import type { DayStats } from "./stats";

/**
 * Writes the daily rollup to a second tab in the same spreadsheet as the
 * bookings, so the team sees traffic and reservations side by side and can
 * read conversion without exporting anything.
 */

export const STATS_TAB = process.env.GOOGLE_STATS_TAB || "Daily stats";

export const STATS_HEADERS = [
  "Date (IST)",
  "Page views",
  "Unique visitors",
  "Booking page views",
  "Bookings",
  "Passes reserved",
  "Amount reserved",
  "Visitor → booking",
];

function toRow(s: DayStats): (string | number)[] {
  // A computed value, not a formula. A formula would carry row references that
  // break the moment anyone sorts or filters the sheet; a number travels with
  // its own row.
  const conversion =
    s.uniques > 0 ? `${((s.bookings / s.uniques) * 100).toFixed(1)}%` : "—";
  return [
    s.date,
    s.views,
    s.uniques,
    s.bookViews,
    s.bookings,
    s.passes,
    s.amount,
    conversion,
  ];
}

export async function appendStatsRow(stats: DayStats): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const token = await getSheetsToken();
  if (!token || !sheetId) {
    console.warn(`[stats] Sheets not configured — ${stats.date} not mirrored`);
    return;
  }

  const range = encodeURIComponent(`${STATS_TAB}!A:H`);
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append` +
    `?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values: [toRow(stats)] }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Stats append failed (${res.status}): ${detail.slice(0, 300)}`);
  }
}

/** Writes the header row once. Creates the tab if it is not there yet. */
export async function initStatsTab(): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const token = await getSheetsToken();
  if (!token || !sheetId) throw new Error("Google Sheets is not configured");

  // Adding a tab that already exists returns 400; that is fine and expected on
  // a re-run, so only a genuinely different failure is surfaced.
  const addRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [{ addSheet: { properties: { title: STATS_TAB } } }],
      }),
    }
  );
  if (!addRes.ok) {
    const detail = await addRes.text().catch(() => "");
    if (!detail.includes("already exists")) {
      throw new Error(`Could not create the "${STATS_TAB}" tab (${addRes.status}): ${detail.slice(0, 300)}`);
    }
  }

  const range = encodeURIComponent(`${STATS_TAB}!A1:H1`);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values: [STATS_HEADERS] }),
    }
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Stats header write failed (${res.status}): ${detail.slice(0, 300)}`);
  }
}
