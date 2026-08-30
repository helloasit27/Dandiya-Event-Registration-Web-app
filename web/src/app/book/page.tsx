import type { Metadata } from "next";
import BookingForm from "./BookingForm";

export const metadata: Metadata = {
  title: "Reserve your passes · Dhinchak Dandiya 2026",
  description:
    "Reserve passes for Dhinchak Dandiya 2026. Nothing to pay now — our team calls you to collect payment and send your tickets.",
  robots: { index: false },
};

export default function BookPage() {
  return <BookingForm />;
}
