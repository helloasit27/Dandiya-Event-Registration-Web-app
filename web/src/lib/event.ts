/**
 * Every event fact the site renders, in one place.
 * Values are taken verbatim from the approved design (Dandiya Site.dc.html)
 * and the decisions in the handoff chat transcript.
 */

export const TICKET_PRICE = 499;
export const MAX_PER_NIGHT = 20;

export const NIGHTS = [
  {
    id: "day1" as const,
    name: "Saptami",
    label: "Night 1 · Sat 17 Oct",
    shortDate: "Sat 17 Oct",
    summaryLabel: "Saptami, 17 Oct",
  },
  {
    id: "day2" as const,
    name: "Asthami",
    label: "Night 2 · Sun 18 Oct",
    shortDate: "Sun 18 Oct",
    summaryLabel: "Asthami, 18 Oct",
  },
];

export type NightId = (typeof NIGHTS)[number]["id"];

export const EVENT = {
  name: "Dhinchak Dandiya 2026",
  tagline: "Legacy like no others",
  badge: "Navratri 2026 · 2 Nights",
  dates: "17 & 18 Oct",
  time: "6–10 PM",
  venue: "Plutone Mall, 6th Floor",
  venueCity: "Rourkela, Odisha",
  mapsUrl: "https://maps.app.goo.gl/tjwzcZjvxPKxjAwv6",
};

export const ORG = {
  brand: "Rourkela Junction Events",
  legalEntity: "Junction India Enterprises",
  gstin: "21IWZPM0456B1ZF",
  address:
    "Ground Floor, Plot No. 1/1041, Jalda, C Block, Rourkela, Sundargarh, Odisha – 769043, India",
  phonePrimary: "9348087289",
  phoneSecondary: "9078039055",
  email: "works.rourkelaj@gmail.com",
  instagram: "https://www.instagram.com/rourkela_junction/",
  instagramHandle: "@rourkela_junction",
  supportHours: "10:00 AM–10:00 PM, all seven days",
};

export const whatsappShareUrl = (bookingId: string) =>
  `https://wa.me/91${ORG.phonePrimary}?text=${encodeURIComponent(
    `Hi, I have reserved passes for ${EVENT.name}. My booking ID is ${bookingId}.`
  )}`;

export const GALLERY = Array.from({ length: 10 }, (_, i) => ({
  src: `/gallery/gal-${i + 1}.webp`,
  alt: `Dhinchak Dandiya 2025 — crowd moment ${i + 1}`,
  /* gal-7 was reframed downward in the design; preserved here. */
  objectPosition: i + 1 === 7 ? "50% 78%" : "50% 50%",
}));

export const HIGHLIGHTS = [
  { title: "Live DJ", body: "Non-stop garba sets", icon: "dj" },
  { title: "Live Dhol", body: "Dhol squad both nights", icon: "dhol" },
  { title: "Gift Hampers", body: "Limited hampers to win", icon: "gift" },
  { title: "Mascots", body: "Special attraction for kids", icon: "mascot" },
  { title: "Food Stalls", body: "Snacks, chaat & dinner", icon: "food" },
  { title: "Lights & Decor", body: "Stage, SFX & photobooth", icon: "decor" },
] as const;

export const TICKER = [
  "Live DJ",
  "Live Dhol",
  "Gift Hampers",
  "Mascots",
  "Food Stalls",
  "Photobooth",
  "VIP Lounge",
];

export const TAGS = [
  "Photobooth zone",
  "Exciting games",
  "Shopping stalls",
  "VIP lounge",
];

export const FAQS = [
  {
    q: "How do I pay?",
    a: "Reserve now and our team calls you to collect the payment and send your tickets. Online payment is coming soon.",
  },
  {
    q: "How do I get my pass?",
    a: "Once payment is done we send it by email and WhatsApp. Show it at the entry desk — no printout needed.",
  },
  {
    q: "Is it safe for families?",
    a: "Yes. Security and volunteers are on the floor all evening, with a separate family seating area.",
  },
  {
    q: "Can I cancel?",
    a: "Passes are non-refundable once paid, but you can transfer yours to a friend — just call us before the event.",
  },
];

export const GOOD_TO_KNOW = [
  "Dress traditional — chaniya choli, kediyu, kurta.",
  "Parking available in the mall basement.",
  "Every attendee, including children, needs a ticket.",
];
