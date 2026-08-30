import Image from "next/image";
import Link from "next/link";
import { ORG } from "@/lib/event";
import { Instagram, Phone } from "./Icons";
import styles from "./SiteHeader.module.css";

/**
 * The prototype swapped a `compact` prop to shrink the contact pill inside the
 * phone frame. Here that is a media query, so one header serves both.
 */
export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <Image
            src="/assets/junction-logo.png"
            alt={ORG.brand}
            width={168}
            height={42}
            className={styles.logo}
            priority
          />
        </Link>

        <div className={styles.org}>
          <div className={styles.orgLine}>
            Event organised by<span className={styles.orgBreak}> </span>
            {ORG.brand}
          </div>
          <div className={styles.orgSub}>a brand of {ORG.legalEntity}</div>
        </div>

        <div className={styles.actions}>
          <a
            href={ORG.instagram}
            className={styles.igButton}
            aria-label={`Follow ${ORG.instagramHandle} on Instagram`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={17} stroke="var(--gold)" />
          </a>

          <a
            href={`tel:${ORG.phonePrimary}`}
            className={styles.callPill}
            aria-label={`Need help? Call ${ORG.phonePrimary}`}
          >
            <span className={styles.callIcon}>
              <Phone size={16} stroke="var(--gold)" />
            </span>
            <span className={styles.callLabel}>
              <span className={styles.callLabelTop}>Need help? Contact us</span>
              <span className={styles.callLabelNum}>{ORG.phonePrimary}</span>
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
