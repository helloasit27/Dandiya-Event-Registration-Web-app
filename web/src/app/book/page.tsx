import type { Metadata } from "next";
import BookingForm from "./BookingForm";
import SoldOut from "./SoldOut";
import { allNightsSoldOut } from "@/lib/event";

export const metadata: Metadata = {
  title: allNightsSoldOut()
    ? "Sold out · Dhinchak Dandiya 2026"
    : "Reserve your passes · Dhinchak Dandiya 2026",
  description:
    "Reserve passes for Dhinchak Dandiya 2026. Nothing to pay now — pay and collect your pass at Plutone Mall, Rourkela.",
  robots: { index: false },
};

export default function BookPage() {
  return allNightsSoldOut() ? <SoldOut /> : <BookingForm />;
}
