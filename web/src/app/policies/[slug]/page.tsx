import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "@/components/Icons";
import { EVENT, ORG } from "@/lib/event";
import {
  CLAUSES,
  LAST_UPDATED,
  POLICY_TABS,
  type PolicySlug,
} from "@/lib/policies";
import styles from "../policies.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POLICY_TABS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tab = POLICY_TABS.find((t) => t.slug === slug);
  if (!tab) return {};
  return {
    title: `${tab.heading} · ${ORG.brand}`,
    description: `${tab.heading} for ${EVENT.name}, operated by ${ORG.legalEntity}.`,
  };
}

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params;
  const tab = POLICY_TABS.find((t) => t.slug === slug);
  if (!tab) notFound();

  const clauses = CLAUSES[tab.slug as PolicySlug];

  return (
    <div className={styles.screen}>
      <div className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link href="/" className={styles.back} aria-label="Go back">
            <ChevronLeft size={18} />
          </Link>
          <div className={styles.topbarTitle}>Policies</div>
        </div>
      </div>

      <div className={styles.body}>
        <h1 className={styles.title}>Legal information</h1>
        <p className={styles.subtitle}>
          Terms and Conditions · Ticket and Entry Policy · Refund and
          Cancellation Policy · Privacy Policy
        </p>
        <p className={styles.updated}>Last updated {LAST_UPDATED}</p>

        <div className={styles.entityCard}>
          <p className={styles.entityIntro}>
            This website and <strong>{EVENT.name}</strong> are operated by{" "}
            <strong>{ORG.legalEntity}</strong> under the brand name{" "}
            <strong>{ORG.brand}</strong>. In this document, &ldquo;Organizer&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to{" "}
            {ORG.legalEntity}, operating under the brand {ORG.brand}.
          </p>
          <div className={styles.entityGrid}>
            <div>
              <div className={styles.entityLabel}>Registered office</div>
              {ORG.address}
            </div>
            <div>
              <div className={styles.entityLabel}>Contact</div>
              GSTIN: {ORG.gstin}
              <br />
              Support: {ORG.supportHours}
              <br />
              Phone / WhatsApp:{" "}
              <a href={`tel:${ORG.phonePrimary}`}>{ORG.phonePrimary}</a> ·{" "}
              <a href={`tel:${ORG.phoneSecondary}`}>{ORG.phoneSecondary}</a>
              <br />
              Email: <a href={`mailto:${ORG.email}`}>{ORG.email}</a>
              <br />
              <a href={ORG.instagram} target="_blank" rel="noopener noreferrer">
                instagram.com/rourkela_junction
              </a>
            </div>
          </div>
        </div>

        <nav className={styles.tabs}>
          {POLICY_TABS.map((t) => (
            <Link
              key={t.slug}
              href={`/policies/${t.slug}`}
              className={`${styles.tab} ${t.slug === tab.slug ? styles.tabActive : ""}`}
              aria-current={t.slug === tab.slug ? "page" : undefined}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <h2 className={styles.heading}>{tab.heading}</h2>
        <div className={styles.clauses}>
          {clauses.map((c) => (
            <div key={c.title}>
              <strong className={styles.clauseTitle}>{c.title}</strong> {c.body}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
