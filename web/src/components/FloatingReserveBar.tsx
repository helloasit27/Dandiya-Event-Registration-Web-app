"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "./Icons";
import { CTA_LABEL, TICKET_PRICE } from "@/lib/event";
import styles from "../app/home.module.css";

/**
 * The bottom reserve bar, shown from "The night" section onwards.
 *
 * The bar is a sticky last child of the section container, so it still
 * scrolls away naturally at the end of the page. What this component adds is
 * *when* it starts showing.
 *
 * Position:sticky alone cannot express that: it engages as soon as the
 * container's top edge enters the viewport, which is up to one screen-height
 * early — on a tall screen the bar appeared while the Passes section and its
 * own CTA were still on screen, putting two identical gold buttons on top of
 * each other. So visibility is gated on a sentinel at the top of "The night"
 * actually having been scrolled past.
 *
 * Rendered visible by default and hidden on mount, so that with JavaScript
 * unavailable the bar still works — degraded to the old sticky-only timing
 * rather than disappearing entirely.
 */
export default function FloatingReserveBar() {
  const [shown, setShown] = useState(true);
  const readyRef = useRef(false);

  useEffect(() => {
    const sentinel = document.getElementById("night-sentinel");
    if (!sentinel) return;

    // Hide only once we know we can observe; see the note above about no-JS.
    if (!readyRef.current) {
      readyRef.current = true;
      setShown(sentinel.getBoundingClientRect().top < 0);
    }

    const io = new IntersectionObserver(
      ([entry]) => setShown(entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`${styles.stickyBar} ${shown ? "" : styles.stickyBarHidden}`}
      aria-hidden={!shown}
    >
      <div className={styles.stickyInner}>
        <Link
          href="/book"
          className={`cta ${styles.stickyCta}`}
          tabIndex={shown ? undefined : -1}
        >
          <span>
            {CTA_LABEL}
            <span className="cta__sub">
              ₹{TICKET_PRICE} · Food included · T&amp;C apply
            </span>
          </span>
          <ArrowRight size={19} />
        </Link>
      </div>
    </div>
  );
}
