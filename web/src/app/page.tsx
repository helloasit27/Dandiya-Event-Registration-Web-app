import Image from "next/image";
import Link from "next/link";
import HighlightsVideo from "@/components/HighlightsVideo";
import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  ExternalLink,
  HighlightIcon,
  Pin,
} from "@/components/Icons";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  EVENT,
  FAQS,
  GALLERY,
  GOOD_TO_KNOW,
  HIGHLIGHTS,
  NIGHTS,
  TAGS,
  TICKER,
  TICKET_PRICE,
} from "@/lib/event";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      {/* Hero ---------------------------------------------------------- */}
      <section className={styles.hero}>
        <div className={styles.heroGlowA} aria-hidden="true" />
        <div className={styles.heroGlowB} aria-hidden="true" />

        <div className={styles.heroInner}>
          <div className={styles.glass}>
            <div className={styles.badge}>{EVENT.badge}</div>
            <div className={styles.presents}>Presents</div>
            <h1 className={styles.title}>
              Dhinchak
              <br />
              Dandiya 2026
            </h1>
            <div className={styles.tagline}>{EVENT.tagline}</div>

            <div className={styles.chips}>
              <div className="chip">
                <Calendar size={18} stroke="var(--gold)" />
                {EVENT.dates}
              </div>
              <div className="chip">
                <Clock size={18} stroke="var(--gold)" />
                {EVENT.time}
              </div>
              <div className="chip">
                <Pin size={18} stroke="var(--gold)" />
                {EVENT.venue}
              </div>
            </div>

            <div className={styles.partners}>
              <div className={styles.partner}>
                <div className={styles.squircle}>
                  <Image
                    src="/assets/plutone-logo.png"
                    alt="Plutone Mall"
                    width={88}
                    height={88}
                    className={styles.squircleImg}
                  />
                </div>
                <div>
                  <div className={styles.partnerRole}>Venue partner</div>
                  <div className={styles.partnerName}>Plutone Mall</div>
                </div>
              </div>

              <div className={styles.partner}>
                <div className={`${styles.squircle} ${styles.squircleFlush}`}>
                  <Image
                    src="/assets/raurkela-shines-logo.png"
                    alt="Raurkela Shines"
                    width={88}
                    height={88}
                    className={styles.squircleImgCover}
                  />
                </div>
                <div>
                  <div className={styles.partnerRole}>Media partner</div>
                  <div className={styles.partnerName}>Raurkela Shines</div>
                </div>
              </div>
            </div>

            <Link href="/book" className={`cta ${styles.heroCta}`}>
              <span>
                Reserve Pass Now · ₹{TICKET_PRICE}
                <span className="cta__sub">Food included · T&amp;C apply</span>
              </span>
              <ArrowRight size={20} />
            </Link>
            <div className={styles.heroCtaNote}>
              Reserve free — pay when our team calls you
            </div>
          </div>
        </div>
      </section>

      {/* Attractions ticker -------------------------------------------- */}
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          {[0, 1].map((copy) => (
            <div className={styles.tickerRun} key={copy}>
              {TICKER.map((item) => (
                <span key={item} style={{ display: "contents" }}>
                  <span>{item}</span>
                  <span>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="sr-only">
        Attractions: {TICKER.join(", ")}.
      </p>

      {/* Watch ---------------------------------------------------------- */}
      <section className={styles.watch}>
        <div className={styles.watchInner}>
          <div className="eyebrow">Watch</div>
          <h2 className="h2">Last year in 60 seconds</h2>
          <HighlightsVideo />
        </div>
      </section>

      {/* Passes --------------------------------------------------------- */}
      <section className={styles.passes}>
        <div className={styles.passesInner}>
          <div className="eyebrow">Passes</div>
          <h2 className="h2">One price, both nights open</h2>

          <div className={styles.passGrid}>
            {NIGHTS.map((n) => (
              <div className={styles.passCard} key={n.id}>
                <div className={styles.passLabel}>{n.label}</div>
                <div className={styles.passName}>{n.name}</div>
                <div className={styles.passPriceRow}>
                  <span className={styles.passPrice}>₹{TICKET_PRICE}</span>
                  <span className={styles.passPer}>per person</span>
                </div>
                <div className={styles.foodChip}>
                  <Check size={12} />
                  Food included
                </div>
                <div className={styles.tnc}>T&amp;C apply</div>
              </div>
            ))}
          </div>

          <div className={styles.passNotes}>
            {[
              "Choose one night or both — quantities set separately.",
              `Both days together: ₹${TICKET_PRICE * 2} per person.`,
              "Food is included with every valid ticket.",
            ].map((note) => (
              <div className={styles.passNote} key={note}>
                <Check
                  size={16}
                  stroke="var(--gold)"
                  strokeWidth={2.4}
                  className={styles.passNoteIcon}
                />
                {note}
              </div>
            ))}
          </div>

          <Link href="/book" className={`cta ${styles.passesCta}`}>
            <span>Reserve Pass · food included</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* The night ------------------------------------------------------ */}
      <section className={styles.night}>
        <div className="eyebrow">The night</div>
        <h2 className="h2">Two evenings of non-stop garba</h2>
        <p className={styles.lede}>
          A live dhol squad, a DJ playing back-to-back Navratri hits, mascots
          roaming the floor, limited gift hampers to win, and food and shopping
          stalls all around. Come dressed traditional, bring your crew, and dance
          till the lights come up.
        </p>

        <div className={styles.highlightGrid}>
          {HIGHLIGHTS.map((h) => (
            <div className={styles.highlight} key={h.title}>
              <HighlightIcon
                name={h.icon}
                size={22}
                stroke="var(--gold)"
                className={styles.highlightIcon}
              />
              <div className={styles.highlightTitle}>{h.title}</div>
              <div className={styles.highlightBody}>{h.body}</div>
            </div>
          ))}
        </div>

        <div className={styles.tags}>
          {TAGS.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Gallery -------------------------------------------------------- */}
      <section className={styles.gallery}>
        <div className={styles.galleryHead}>
          <div className="eyebrow">Last year</div>
          <h2 className="h2" style={{ marginBottom: 0 }}>
            Moments from the floor
          </h2>
        </div>
        <div className={styles.galleryTrack}>
          {[0, 1].map((copy) => (
            <div className={styles.galleryRun} key={copy} aria-hidden={copy === 1}>
              {GALLERY.map((photo) => (
                <div className={styles.frame} key={`${copy}-${photo.src}`}>
                  <Image
                    src={photo.src}
                    alt={copy === 1 ? "" : photo.alt}
                    width={218}
                    height={158}
                    className={styles.frameImg}
                    style={{ objectPosition: photo.objectPosition }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Venue → footer. The sticky bar lives at the end of this container,
          so it only appears once the reader is past the venue section. */}
      <div className={styles.tail}>
        <section className={styles.venue}>
          <div className="eyebrow">The venue</div>
          <h2 className="h2">{EVENT.venue}</h2>
          <div className={styles.venueGrid}>
            <div>
              <p className={styles.venueCopy}>
                {EVENT.venueCity}. Take the mall lifts straight to the 6th floor
                — our team is at the entry desk from 5:30 PM both evenings.
              </p>
              <a
                href={EVENT.mapsUrl}
                className={styles.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Maps
                <ExternalLink size={16} />
              </a>
            </div>
            <div className={styles.knowCard}>
              <div className={styles.knowLabel}>Good to know</div>
              <div className={styles.knowList}>
                {GOOD_TO_KNOW.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="eyebrow">Questions</div>
          <h2 className="h2">Everything you asked us</h2>
          <div className={styles.faqGrid}>
            {FAQS.map((f) => (
              <div className="card" key={f.q}>
                <div className={styles.faqQ}>{f.q}</div>
                <div className={styles.faqA}>{f.a}</div>
              </div>
            ))}
          </div>
        </section>

        <SiteFooter />

        <div className={styles.stickyBar}>
          <div className={styles.stickyInner}>
            <Link href="/book" className={`cta ${styles.stickyCta}`}>
              <span>
                Reserve Pass Now · ₹{TICKET_PRICE}
                <span className="cta__sub">Food included · T&amp;C apply</span>
              </span>
              <ArrowRight size={19} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
