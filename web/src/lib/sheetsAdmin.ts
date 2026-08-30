import { JWT } from "google-auth-library";
import { SHEET_HEADERS } from "./sheets";

/**
 * One-time setup: writes the header row so the team's sheet has real column
 * names instead of A/B/C. Safe to re-run — it overwrites row 1 only.
 */
export async function writeHeaderRow(): Promise<void> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const tab = process.env.GOOGLE_SHEET_TAB || "Bookings";

  if (!email || !key || !sheetId) {
    throw new Error(
      "Google Sheets is not configured (GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID)"
    );
  }

  const auth = new JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const { token } = await auth.getAccessToken();
  if (!token) throw new Error("Could not obtain a Google access token");

  const range = encodeURIComponent(`${tab}!A1:M1`);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [SHEET_HEADERS] }),
    }
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Header write failed (${res.status}): ${detail.slice(0, 300)}`);
  }
}
