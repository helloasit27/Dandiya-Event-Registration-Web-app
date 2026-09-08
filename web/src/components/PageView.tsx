"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Reports one page view per navigation.
 *
 * Uses sendBeacon so the request is handed to the browser and forgotten — it
 * survives the page being closed and never delays anything the visitor sees.
 *
 * The visitor id is a random string kept in localStorage. It identifies nobody:
 * it exists so the same person refreshing twice counts as one visitor rather
 * than two. No cookie, so no consent banner, and nothing to correlate across
 * sites. If storage is unavailable — private mode, storage disabled — the view
 * still counts, it just counts as a new visitor.
 */
const KEY = "dd.vid";

function visitorId(): string {
  const fresh = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
  try {
    let id = localStorage.getItem(KEY);
    if (!id || !/^[a-z0-9]{8,40}$/.test(id)) {
      id = fresh();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return fresh();
  }
}

export default function PageView() {
  const pathname = usePathname();

  useEffect(() => {
    // The confirmation page carries a booking token in the URL; it is not sent
    // anywhere here, but keep it out of the count entirely to be sure.
    if (pathname.startsWith("/booking/")) return;

    const payload = JSON.stringify({
      v: visitorId(),
      p: pathname === "/book" ? "book" : "page",
    });

    try {
      const blob = new Blob([payload], { type: "application/json" });
      if (!navigator.sendBeacon("/api/track", blob)) {
        void fetch("/api/track", { method: "POST", body: payload, keepalive: true });
      }
    } catch {
      // A blocked beacon is not worth a broken page.
    }
  }, [pathname]);

  return null;
}
