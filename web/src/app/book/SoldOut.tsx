import Link from "next/link";
import { EVENT, ORG, PICKUP } from "@/lib/event";
import styles from "./book.module.css";

/**
 * Shown at /book once every night is full.
 *
 * The form is not merely disabled here — it is not rendered at all. A sold-out
 * event still gets traffic from links already shared, old tabs and search
 * results, and a form that collects a name and number before refusing it is
 * worse than a page that says so up front. The phone number stays, because the
 * question these visitors actually have is whether anything can still be done.
 */
export default function SoldOut() {
  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link href="/" className={styles.back} aria-label="Back to the event page">
            ←
          </Link>
          <div>
            <div className={styles.topbarTitle}>Sold out</div>
            <div className={styles.topbarSub}>{EVENT.name}</div>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.soldOutPanel}>
          <div className={styles.soldOutHead}>Both nights are fully booked</div>
          <p className={styles.soldOutBody}>
            All passes for {EVENT.dates} have gone and we are not taking any
            more reservations.
          </p>
          <p className={styles.soldOutBody}>
            <strong>Already reserved but not collected?</strong> Your
            reservation still stands. Pay and collect your pass at{" "}
            {PICKUP.place} as normal — bring your reservation ID.
          </p>
          <p className={styles.soldOutBody}>
            <strong>Already have your pass?</strong> Nothing changes. Entry
            opens at 5:30 PM, {EVENT.venue}.
          </p>
          <div className={styles.soldOutActions}>
            <a href={`tel:${ORG.phonePrimary}`} className={styles.soldOutCall}>
              Call {ORG.phonePrimary}
            </a>
            <Link href="/" className={styles.soldOutBack}>
              Back to the event page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
