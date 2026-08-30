# Dhinchak Dandiya 2026 — booking site

Implementation of the Claude Design handoff in `../project` (`Dandiya Booking App.dc.html`
and the `Dandiya Site` component it imports).

Next.js (App Router) + TypeScript. No CSS framework — the design's palette and
spacing are reproduced with CSS custom properties and CSS Modules.

## Screens

| Route | What it is |
|---|---|
| `/` | Event page: hero, attractions ticker, highlights video, what's on, passes, last-year gallery, venue, FAQ, footer, sticky reserve bar |
| `/book` | Reservation form: per-night quantities, details, terms, live total |
| `/booking/[id]?t=…` | Confirmation: reservation ID, itemised summary, screenshot + WhatsApp guidance |
| `/about` | About Rourkela Junction Events |
| `/policies/{terms,refund,privacy}` | Legal pages |

The prototype's Web/Mobile toggle was a preview device for the designer. It is
not in the build: one responsive layout serves both, which is what the toggle
was previewing.

## How a booking works

Nothing is charged online. A reservation is recorded, the team calls the
customer, and payment happens on that call — the flow the design settled on.

1. `POST /api/bookings` re-validates everything the form validated (anything can
   POST to it) and **computes the amount server-side**; the client never sends a price.
2. A booking number is allocated with a single Redis `INCR`, so simultaneous
   bookings cannot collide.
3. The booking is written to Redis — the system of record.
4. The row is appended to Google Sheets for the phone team.
5. The confirmation page renders from Redis.

### Booking numbers under concurrency

Numbers are sequential (`DD100001`, `DD100002`, …) and come from an atomic
`INCR`. Redis serialises it, so two people tapping "Reserve" in the same
millisecond on different serverless instances always get different numbers.

Verified locally: 60 simultaneous requests produced 60 unique, contiguous ids.

Sequential numbers are also *guessable*, and the confirmation page shows a name
and mobile number. So each booking carries a random access token, and the page
opens only for `/booking/DD100001?t=<token>`. The id alone renders a
"we could not open that booking" page. The token is never displayed.

### Double taps and retries

The form generates a `requestId` once and reuses it for every retry of that
submission. The API stores it, so a double tap, an impatient refresh or a
retry over a flaky connection returns the *original* reservation instead of
booking a second set of passes. Verified: 12 simultaneous identical submits
produced exactly one reservation.

### When Google Sheets is down

Sheets is a mirror, not the system of record. If the append fails the booking
still succeeds — the customer is never made to pay for Google being slow — and
the id is queued in `dandiya:sheets:unsynced` for replay:

```bash
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
  "https://<your-site>/api/admin/sheets?action=replay"
```

Anything that fails again is pushed back on the queue rather than dropped.
Point a scheduled job at that URL (Vercel Cron / Netlify Scheduled Functions)
and a Sheets outage becomes self-healing.

## Setup

```bash
npm install
cp .env.example .env.local     # then fill it in — see the comments in that file
npm run dev
```

The app runs with no configuration at all, falling back to an in-process store
so you can click through the flow immediately. That fallback is per-process and
logs a warning — it is not safe for production.

### Google Sheet

Create the sheet, share it with the service account's `client_email` as
**Editor** (easily missed — without it every write is a 403), then write the
header row once:

```bash
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
  "https://<your-site>/api/admin/sheets?action=init"
```

Columns: booking id, timestamp (IST), name, mobile, email, per-night
quantities, total passes, amount due, status, plus empty **Payment collected**
and **Notes** columns for the team to fill in as they work the calls.

## Deploying

**Vercel** is the recommended host — it is first-party for Next.js, so the App
Router, API routes and image optimisation work with no configuration. Import
the repo, set the root directory to `web/`, add the environment variables from
`.env.example`, deploy.

**Netlify** also works: `netlify.toml` is included and pulls in
`@netlify/plugin-nextjs`, which is what makes the API routes and the
server-rendered confirmation page run. Same environment variables.

Set every variable for Production *and* Preview, or preview deploys will
quietly fall back to the in-memory store.

## Content

Event facts (dates, price, venue, phone numbers, highlights, FAQs) live in
`src/lib/event.ts`; legal copy lives in `src/lib/policies.ts`. Changing the
ticket price or a phone number is a one-line edit there and it updates
everywhere it appears.

## Notes for whoever picks this up

- **The legal copy was drafted in the design tool, not by a lawyer.** It should
  get a proper review before launch.
- **"Pay Now" is deliberately inert**, shown as a locked "coming soon" tile, per
  the design. When a gateway is added, the reservation flow already has the
  hooks: a booking has a `status` field and Redis holds the record.
- The hero video is a 14MB MP4 served from `public/`. It is only fetched when
  playback starts, so arriving on the page costs a phone user nothing. If it
  becomes a bandwidth problem, move it to a CDN or a streaming host.
- Gallery photos were extracted from the design's image-slot sidecar into
  `public/gallery/`.
