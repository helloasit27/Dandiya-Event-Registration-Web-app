import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock } from "@/components/Icons";
import { EVENT, NIGHTS, ORG, TICKET_PRICE, whatsappShareUrl } from "@/lib/event";
import { getBooking } from "@/lib/store";
import styles from "./confirm.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pass reserved · Dhinchak Dandiya 2026",
  // A reservation page carries a name and mobile number — keep it out of search.
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string }>;
};

export default async function ConfirmationPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { t } = await searchParams;

  const booking = await getBooking(id);

  /**
   * Booking numbers run in sequence, so DD100002 is trivially guessable from
   * DD100001. The page shows a name and a mobile number, so it opens only for
   * whoever holds the token issued with the booking.
   */
  if (!booking || !t || t !== booking.accessToken) {
    return (
      <div className={styles.screen}>
        <div className={styles.missing}>
          <h1 className={styles.missingTitle}>We could not open that booking</h1>
          <p className={styles.missingBody}>
            The link may be incomplete or it may have expired. If you have your
            booking ID, call us on{" "}
            <a href={`tel:${ORG.phonePrimary}`}>{ORG.phonePrimary}</a> and we
            will find your reservation.
          </p>
          <Link href="/" className="cta" style={{ maxWidth: 320, margin: "0 auto" }}>
            <span>Back to event page</span>
            <ArrowRight size={19} />
          </Link>
        </div>
      </div>
    );
  }

  const qty = { day1: booking.day1, day2: booking.day2 };
  const fullName = [booking.firstName, booking.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.screen}>
      <div className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.tick}>
            <Check size={34} stroke="var(--plum)" strokeWidth={3} />
          </div>
          <h1 className={styles.title}>Pass reserved</h1>
          <div className={styles.lede}>
            Your passes are reserved under this ID —{" "}
            <strong>not confirmed yet</strong>. They are confirmed only after
            payment, which our team will collect on a call shortly.
          </div>
        </div>
      </div>

      <div className={styles.idBand}>
        <div className={styles.idBandInner}>
          <div className={styles.idLabel}>Reservation ID · payment pending</div>
          <div className={styles.idValue}>{booking.bookingId}</div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.detailCard}>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Event</span>
            <span className={styles.rowValue}>{EVENT.name}</span>
          </div>

          {NIGHTS.map((night) =>
            qty[night.id] > 0 ? (
              <div className={styles.row} key={night.id}>
                <span className={styles.rowLabel}>{night.summaryLabel}</span>
                <span className={styles.rowValue}>
                  {qty[night.id]} {qty[night.id] === 1 ? "pass" : "passes"} · ₹
                  {qty[night.id] * TICKET_PRICE}
                </span>
              </div>
            ) : null
          )}

          <div className={styles.row}>
            <span className={styles.rowLabel}>Where</span>
            <span className={styles.rowValue}>
              {EVENT.venue} · {EVENT.time}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Name</span>
            <span className={styles.rowValue}>{fullName}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Mobile</span>
            <span className={styles.rowValue}>{booking.phone}</span>
          </div>

          <div className={styles.rule} />

          <div className={styles.dueRow}>
            <span className={styles.dueLabel}>Amount due on call</span>
            <span className={styles.dueValue}>₹{booking.amountDue}</span>
          </div>

          <div className={styles.pendingChip}>
            <Clock size={13} />
            Reserved · payment pending
          </div>
        </div>

        <div className={styles.screenshotCard}>
          <div className={styles.screenshotTitle}>
            Take a screenshot of this page
          </div>
          <div className={styles.screenshotBody}>
            Keep it for your reference and share it with us on WhatsApp if
            needed. Your reservation ID{" "}
            <strong>{booking.bookingId}</strong> is all we ask for when our team
            calls.
          </div>
        </div>

        <div className={styles.stepsCard}>
          <div className={styles.stepsTitle}>How your pass gets confirmed</div>
          <ol className={styles.steps}>
            <li>
              Our team calls you on {booking.phone} to check your reservation.
            </li>
            <li>
              You pay ₹{booking.amountDue} by UPI on that call — this is what
              confirms your passes.
            </li>
            <li>
              We send your confirmed tickets on WhatsApp
              {booking.email ? ` and to ${booking.email}` : ""}.
            </li>
          </ol>
          <div className={styles.stepsCaveat}>
            Until payment is done, your passes stay reserved and can be released
            if the event fills up.
          </div>
        </div>

        <a
          href={whatsappShareUrl(booking.bookingId)}
          className={`cta ${styles.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Share booking on WhatsApp</span>
          <ArrowRight size={19} />
        </a>

        <div className={styles.tail}>
          <a href={`tel:${ORG.phonePrimary}`}>Call {ORG.phonePrimary}</a>
          <Link href="/" className={styles.tailMuted}>
            Back to event page
          </Link>
        </div>
      </div>
    </div>
  );
}
