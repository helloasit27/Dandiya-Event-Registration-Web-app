"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  Alert,
  ArrowRight,
  Check,
  ChevronLeft,
  Lock,
  Minus,
  Plus,
} from "@/components/Icons";
import { MAX_PER_NIGHT, NIGHTS, TICKET_PRICE } from "@/lib/event";
import styles from "./book.module.css";

type Errors = Partial<
  Record<"qty" | "firstName" | "lastName" | "phone" | "email" | "accepted", boolean>
>;

export default function BookingForm() {
  const router = useRouter();

  const [qty, setQty] = useState({ day1: 2, day2: 0 });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * Stable for the life of this form, so a double-tap or a retry after a
   * flaky connection reuses the same reservation instead of making a second.
   * It is only rotated once a booking has actually succeeded.
   */
  const requestId = useRef<string>(crypto.randomUUID());

  const totalQty = qty.day1 + qty.day2;
  const subtotal = totalQty * TICKET_PRICE;

  const bump = (id: "day1" | "day2", delta: number) =>
    setQty((q) => ({
      ...q,
      [id]: Math.min(MAX_PER_NIGHT, Math.max(0, q[id] + delta)),
    }));

  function validate(): Errors {
    const e: Errors = {};
    if (totalQty < 1) e.qty = true;
    if (!firstName.trim()) e.firstName = true;
    if (!lastName.trim()) e.lastName = true;
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ""))) e.phone = true;
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = true;
    }
    if (!accepted) e.accepted = true;
    return e;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError(null);

    const found = validate();
    if (Object.keys(found).length) {
      setErrors(found);
      // Send focus to the first problem so the fix is obvious on a phone.
      document
        .querySelector<HTMLElement>('[data-invalid="true"]')
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.replace(/\D/g, ""),
          email: email.trim(),
          day1: qty.day1,
          day2: qty.day2,
          accepted: true,
          requestId: requestId.current,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        if (res.status === 422 && payload?.fields) {
          const serverErrors: Errors = {};
          for (const key of Object.keys(payload.fields)) {
            serverErrors[key as keyof Errors] = true;
          }
          setErrors(serverErrors);
          setSubmitError("Please check the highlighted details and try again.");
        } else {
          setSubmitError(
            "We could not reserve your passes just now. Please try again, or call us on 9348087289."
          );
        }
        return;
      }

      const { booking, token } = await res.json();
      router.push(`/booking/${booking.bookingId}?t=${token}`);
    } catch {
      setSubmitError(
        "You appear to be offline. Check your connection and try again, or call us on 9348087289."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link href="/" className={styles.back} aria-label="Go back">
            <ChevronLeft size={18} />
          </Link>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className={styles.topbarTitle}>Reserve your passes</div>
            <div className={styles.topbarSub}>
              ₹{TICKET_PRICE} per person, per night
            </div>
          </div>
        </div>
      </div>

      <form className={styles.body} onSubmit={submit} noValidate>
        {/* Step 1 --------------------------------------------------- */}
        <div className={styles.step}>Step 1 · How many passes?</div>
        <div className={styles.nights}>
          {NIGHTS.map((night) => {
            const count = qty[night.id];
            return (
              <div
                key={night.id}
                className={`${styles.nightCard} ${
                  count > 0 ? styles.nightCardActive : ""
                }`}
              >
                <div className={styles.nightRow}>
                  <div className={styles.nightMeta}>
                    <div className={styles.nightName}>{night.name}</div>
                    <div className={styles.nightDate}>
                      {night.shortDate} · ₹{TICKET_PRICE} each
                    </div>
                  </div>
                  <div className={styles.stepper}>
                    <button
                      type="button"
                      className={styles.stepBtn}
                      onClick={() => bump(night.id, -1)}
                      disabled={count === 0}
                      aria-label={`One less pass for ${night.name}, ${night.shortDate}`}
                    >
                      <Minus size={18} />
                    </button>
                    <span
                      className={styles.qty}
                      aria-live="polite"
                      aria-label={`${count} passes for ${night.name}`}
                    >
                      {count}
                    </span>
                    <button
                      type="button"
                      className={`${styles.stepBtn} ${styles.stepBtnPrimary}`}
                      onClick={() => bump(night.id, 1)}
                      disabled={count === MAX_PER_NIGHT}
                      aria-label={`One more pass for ${night.name}, ${night.shortDate}`}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.hint}>
          Coming both nights? Add passes to both — it stays one booking.
        </div>
        {errors.qty && (
          <div className={styles.qtyError} data-invalid="true" role="alert">
            Please add at least one pass to continue
          </div>
        )}

        {/* Step 2 --------------------------------------------------- */}
        <div className={styles.step}>Step 2 · Your details</div>
        <div className={styles.fieldGrid}>
          <div>
            <label className={styles.label} htmlFor="firstName">
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              className={`${styles.input} ${errors.firstName ? styles.inputError : ""}`}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              data-invalid={errors.firstName ? "true" : undefined}
              aria-invalid={errors.firstName || undefined}
            />
            {errors.firstName && (
              <div className="field-error">Please type your first name</div>
            )}
          </div>

          <div>
            <label className={styles.label} htmlFor="lastName">
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              className={`${styles.input} ${errors.lastName ? styles.inputError : ""}`}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              data-invalid={errors.lastName ? "true" : undefined}
              aria-invalid={errors.lastName || undefined}
            />
            {errors.lastName && (
              <div className="field-error">Please type your last name</div>
            )}
          </div>

          <div>
            <label className={styles.label} htmlFor="phone">
              Mobile number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={14}
              className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10 digit mobile number"
              data-invalid={errors.phone ? "true" : undefined}
              aria-invalid={errors.phone || undefined}
            />
            {errors.phone && (
              <div className="field-error">Please check the 10 digit number</div>
            )}
          </div>
        </div>

        <div className={styles.emailField}>
          <label className={styles.label} htmlFor="email">
            Email <span className={styles.optional}>(optional)</span> — we send
            your pass here
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@gmail.com"
            data-invalid={errors.email ? "true" : undefined}
            aria-invalid={errors.email || undefined}
          />
          {errors.email && (
            <div className="field-error">Please check the email address</div>
          )}
          <div className={styles.emailNote}>
            No email? No problem — we will send your pass on WhatsApp instead.
          </div>
        </div>

        {/* Terms ---------------------------------------------------- */}
        <button
          type="button"
          onClick={() => setAccepted((v) => !v)}
          className={`${styles.terms} ${accepted ? styles.termsChecked : ""} ${
            errors.accepted ? styles.termsError : ""
          }`}
          role="checkbox"
          aria-checked={accepted}
          data-invalid={errors.accepted ? "true" : undefined}
        >
          <span className={`${styles.checkbox} ${accepted ? styles.checkboxOn : ""}`}>
            {accepted && <Check size={15} stroke="var(--plum)" strokeWidth={3.2} />}
          </span>
          <span className={styles.termsCopy}>
            I have read and accept the <strong>Terms &amp; Conditions</strong>,{" "}
            <strong>Refund Policy</strong> and <strong>Privacy Policy</strong>.
            Tickets are non-refundable once paid.
          </span>
        </button>
        {errors.accepted && (
          <div className={styles.termsError_msg} role="alert">
            <Alert size={15} />
            Please accept the terms and conditions to continue
          </div>
        )}

        {/* Summary -------------------------------------------------- */}
        <div className={styles.summary}>
          <div className={styles.summaryChip}>
            <Check size={12} />
            Food included with every pass
          </div>
          {NIGHTS.map((night) =>
            qty[night.id] > 0 ? (
              <div className={styles.summaryRow} key={night.id}>
                <span className={styles.summaryRowLabel}>
                  {qty[night.id]} × {night.summaryLabel}
                </span>
                <span style={{ fontWeight: 700 }}>
                  ₹{qty[night.id] * TICKET_PRICE}
                </span>
              </div>
            ) : null
          )}
          <div className={styles.summaryRule} />
          <div className={styles.summaryTotal}>
            <span className={styles.summaryTotalLabel}>
              {totalQty} {totalQty === 1 ? "pass" : "passes"} total
            </span>
            <span className={styles.summaryTotalValue}>₹{subtotal}</span>
          </div>
        </div>

        {/* Submit --------------------------------------------------- */}
        <div className={styles.submitBar}>
          <div className={styles.submitInner}>
            <button
              type="submit"
              className={`cta ${styles.submitCta}`}
              disabled={submitting}
            >
              <span>
                {submitting ? "Booking…" : `Book Now, Pay Later · ₹${subtotal}`}
              </span>
              <ArrowRight size={19} />
            </button>

            <div className={styles.payNow} aria-hidden="true">
              <Lock size={16} />
              Pay Now — coming soon
            </div>

            <div className={styles.submitNote}>
              Nothing to pay now. Your passes are only confirmed once payment is
              done on our call.
            </div>

            {submitError && (
              <div className={styles.submitError} role="alert">
                <Alert size={15} />
                {submitError}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
