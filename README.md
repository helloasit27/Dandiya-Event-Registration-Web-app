# Dandiya Event Registration Web App

Booking site for **Dhinchak Dandiya 2026** — 17 & 18 October 2026, Plutone Mall
6th Floor, Rourkela. Presented by Rourkela Junction Events, a brand operated by
Junction India Enterprises.

## Repository layout

| Path | What it is |
|---|---|
| **`web/`** | **The actual website.** Next.js app — start here. See [`web/README.md`](web/README.md) for setup, environment variables and deployment. |
| `project/` | Source design files exported from Claude Design (HTML/CSS/JS prototypes, assets, logos). Reference material, not shipped. |
| `chats/` | Transcript of the design conversation — the reasoning behind each decision. |
| `project/HANDOFF.md` | The original handoff brief that came with the design export. |

## Quick start

```bash
cd web
npm install
cp .env.example .env.local   # fill in — the comments explain each value
npm run dev
```

It runs with no configuration at all, using an in-process store, so you can
click through the whole flow immediately. Production needs the environment
variables set — see `web/README.md`.

## How booking works

Nothing is charged online. A customer reserves passes, the team calls them, and
payment is collected on that call — the flow settled on during design.

Reservations get sequential, collision-free booking numbers and are mirrored
live into a Google Sheet for the team working the phones. Details, including
the concurrency and failure-handling behaviour, are in
[`web/README.md`](web/README.md).

## Before launch

- The legal copy in the policy pages was drafted during design, **not by a
  lawyer**. Get it reviewed.
- "Pay Now" is intentionally inactive, shown as a locked "coming soon" tile.
- The hero video is a 14 MB MP4 that starts automatically — see the bandwidth
  note in `web/README.md` before going live on a free hosting tier.
