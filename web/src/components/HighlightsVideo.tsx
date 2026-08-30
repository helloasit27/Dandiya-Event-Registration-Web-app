"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "./Icons";
import styles from "../app/home.module.css";

/**
 * Shows a "2025 highlights" plate, then starts the clip on its own after
 * three seconds — the behaviour signed off in the design.
 *
 * The 14MB file is only fetched once we actually intend to play (preload
 *="none" until then), so arriving on the page does not cost a phone user
 * their data. Autoplay is muted because no browser allows it otherwise;
 * if the browser still refuses, the plate stays as a working play button.
 */
export default function HighlightsVideo() {
  const [started, setStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (started) return;
    const t = setTimeout(() => setStarted(true), 3000);
    return () => clearTimeout(t);
  }, [started]);

  useEffect(() => {
    if (!started) return;
    // Autoplay can still be refused (data saver, low power mode). The
    // controls remain, so a refusal just means the user taps play.
    videoRef.current?.play().catch(() => {});
  }, [started]);

  return (
    <div className={styles.videoFrame}>
      <div className={styles.videoRatio}>
        {started ? (
          <video
            ref={videoRef}
            className={styles.video}
            src="/assets/hero-highlights.mp4"
            muted
            loop
            controls
            playsInline
            preload="auto"
          />
        ) : (
          <button
            type="button"
            className={styles.videoIdle}
            onClick={() => setStarted(true)}
          >
            <span className={styles.playDisc}>
              <Play size={24} />
            </span>
            <span className={styles.videoIdleLabel}>2025 highlights</span>
          </button>
        )}
      </div>
    </div>
  );
}
