"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "./Icons";
import styles from "../app/home.module.css";

/**
 * "2025 highlights" — a play plate that loads the clip only when tapped.
 *
 * It used to start on its own after three seconds. That made the 14MB file a
 * near-universal download: at roughly 14MB per visitor the site exhausted its
 * host's monthly bandwidth in about a week and was suspended mid-campaign.
 * The video is ~98% of the page's payload, so gating it behind a tap is the
 * difference between roughly 7,000 and roughly 140,000 visitors a month on
 * the same quota.
 *
 * The <video> element is not rendered until `started`, so nothing about the
 * clip is fetched before the tap — not the file, not its metadata. Once
 * playing it keeps the muted/looping/controls behaviour the design settled on.
 */
export default function HighlightsVideo() {
  const [started, setStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!started) return;
    // Started by a tap, so playback is user-initiated and will not be blocked.
    // Still muted, and .play() may be refused under data saver or low power —
    // the controls remain, so a refusal just means tapping play again.
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
            aria-label="Play the 2025 highlights video"
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
