import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "@/components/Icons";
import { EVENT, ORG } from "@/lib/event";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: `About us · ${ORG.brand}`,
  description: `${ORG.brand} is an event-hosting and experience brand operated by ${ORG.legalEntity}, based in Rourkela.`,
};

const WORK = [
  "Public and cultural events",
  "Ticketed entertainment experiences",
  "Brand activations",
  "Sponsorship integrations",
  "Influencer and creator collaborations",
  "Wedding and private-event support",
];

export default function AboutPage() {
  return (
    <div className={styles.screen}>
      <div className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link href="/" className={styles.back} aria-label="Go back">
            <ChevronLeft size={18} />
          </Link>
          <div className={styles.topbarTitle}>About us</div>
        </div>
      </div>

      <div className={styles.body}>
        <Image
          src="/assets/junction-logo.png"
          alt={ORG.brand}
          width={256}
          height={64}
          className={styles.logo}
        />

        <h1 className={styles.title}>
          Welcome to the junction where life is celebrated
        </h1>

        <p className={styles.para}>
          <strong>{ORG.brand}</strong> is an event-hosting and experience brand
          operated by <strong>{ORG.legalEntity}</strong>.
        </p>
        <p className={styles.para}>
          Based in Rourkela, we create cultural, festive and entertainment
          experiences that bring audiences, performers, creators and brands
          together.
        </p>
        <p className={styles.paraLast}>
          Our flagship event, <strong>Dhinchak Dandiya</strong>, celebrates
          Navratri through music, dance, food and a vibrant community
          experience.
        </p>

        <div className={styles.label}>Our work includes</div>
        <div className={styles.workGrid}>
          {WORK.map((w) => (
            <div className={styles.work} key={w}>
              {w}
            </div>
          ))}
        </div>

        <p className={styles.paraLast}>
          Our goal is to create well-organised celebrations that audiences
          enjoy, partners can participate in meaningfully and Rourkela can look
          forward to every year.
        </p>

        <div className={styles.legalCard}>
          <div className={styles.label}>Legal entity</div>
          <div className={styles.legalBody}>
            {ORG.brand} is a brand operated by {ORG.legalEntity}.
            <br />
            <br />
            <strong>Registered office</strong>
            <br />
            {ORG.address}
            <br />
            <br />
            <strong>GSTIN</strong> {ORG.gstin}
            <br />
            <a href={ORG.instagram} target="_blank" rel="noopener noreferrer">
              instagram.com/rourkela_junction
            </a>
          </div>
        </div>

        <Link href="/book" className={`cta ${styles.cta}`}>
          <span>Reserve passes for {EVENT.name.replace(" 2026", "")}</span>
        </Link>
      </div>
    </div>
  );
}
