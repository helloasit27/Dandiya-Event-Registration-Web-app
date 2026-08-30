import Image from "next/image";
import Link from "next/link";
import { ORG } from "@/lib/event";
import { Instagram } from "./Icons";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Image
          src="/assets/junction-logo.png"
          alt={ORG.brand}
          width={224}
          height={56}
          className={styles.logo}
        />

        <div className={styles.grid}>
          <div>
            <div className={styles.label}>Passes &amp; help</div>
            <div className={styles.block}>
              <a href={`tel:${ORG.phonePrimary}`} className={styles.phonePrimary}>
                {ORG.phonePrimary}
              </a>
              <a href={`tel:${ORG.phoneSecondary}`} className={styles.phoneAlt}>
                {ORG.phoneSecondary}
              </a>
              <a href={`mailto:${ORG.email}`} className={styles.email}>
                {ORG.email}
              </a>
            </div>
          </div>

          <div>
            <div className={styles.label}>Follow us</div>
            <a
              href={ORG.instagram}
              className={styles.igLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={17} />
              {ORG.instagramHandle}
            </a>
          </div>

          <div>
            <div className={styles.label}>Venue partner</div>
            <div className={styles.plate}>
              <Image
                src="/assets/plutone-logo.png"
                alt="Plutone Mall"
                width={140}
                height={52}
                className={styles.plateImg}
              />
            </div>
          </div>

          <div>
            <div className={styles.label}>Media partner</div>
            <div className={`${styles.plate} ${styles.plateTight}`}>
              <Image
                src="/assets/raurkela-shines-logo.png"
                alt="Raurkela Shines"
                width={160}
                height={60}
                className={styles.plateImgTall}
              />
            </div>
          </div>
        </div>

        <div className={styles.strap}>
          Dress traditional · Bring your energy · Celebrate togetherness
        </div>

        <div className={styles.rule} />

        <nav className={styles.links}>
          <Link href="/about">About Us</Link>
          <Link href="/policies/terms">Terms &amp; Conditions</Link>
          <Link href="/policies/refund">Refund Policy</Link>
          <Link href="/policies/privacy">Privacy Policy</Link>
          <a href={ORG.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </nav>

        <div className={styles.legal}>
          <div className={styles.legalBrand}>{ORG.brand}</div>
          <div className={styles.legalLine}>
            A brand owned and operated by {ORG.legalEntity}
          </div>
          <div className={styles.legalLine}>GSTIN: {ORG.gstin}</div>
          <div className={styles.copyright}>
            © 2026 {ORG.legalEntity}. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
