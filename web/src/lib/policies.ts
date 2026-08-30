/**
 * Policy clauses, carried over verbatim from the approved design.
 * These were drafted as sensible defaults, not legal advice — they should get
 * a lawyer's read before the site goes live.
 */

export type Clause = { title: string; body: string };

export const POLICY_TABS = [
  { slug: "terms", label: "Terms", heading: "Terms & Conditions" },
  { slug: "refund", label: "Refund", heading: "Refund Policy" },
  { slug: "privacy", label: "Privacy", heading: "Privacy Policy" },
] as const;

export type PolicySlug = (typeof POLICY_TABS)[number]["slug"];

export const LAST_UPDATED = "29 August 2026";

export const TERMS: Clause[] = [
  {
    title: "1 · Acceptance.",
    body: "By using this website, purchasing a ticket or attending the event, you agree to these Terms and Conditions, Ticket and Entry Policy, Refund and Cancellation Policy, and Privacy Policy. Please review this page before completing a ticket purchase.",
  },
  {
    title: "2 · Event details.",
    body: "Dhinchak Dandiya 2026, on 17 and 18 October 2026, 6:00 PM–10:00 PM, at the 6th Floor, Plutone Mall, Rourkela. The Organizer may communicate separate information regarding the entry gate, parking, reporting time, security checks and venue access before the event. The programme, performers, food menu, activities and schedule may be modified where reasonably required for operational, safety or regulatory reasons.",
  },
  {
    title: "3 · Ticket price.",
    body: "Tickets are sold separately for each event day — ₹499 per person for 17 October, ₹499 per person for 18 October, ₹998 per person for both days. There are no early-bird or discounted ticket categories. Food is included with every valid ticket for the applicable event day. The amount displayed during booking is the final amount payable, including applicable taxes unless clearly stated otherwise before payment.",
  },
  {
    title: "4 · Ticket quantity.",
    body: "There is no fixed limit on the number of tickets a customer may purchase. All purchases remain subject to availability, successful payment and reasonable fraud-prevention or payment-verification checks. Tickets added on the booking page are not reserved until payment is successfully completed and the booking is confirmed.",
  },
  {
    title: "5 · Online payments.",
    body: "Online ticket payments will be added soon. Once activated, payments may be securely processed through Razorpay or Cashfree; the applicable gateway will be displayed during checkout. The Organizer does not directly collect or store complete card details, UPI PINs, bank passwords or payment OTPs. A payment deduction alone does not confirm a booking — a booking is confirmed only once you receive a booking confirmation or valid ticket ID. If payment is deducted but no confirmation is received, contact Support with your registered mobile number, email address, payment transaction ID, date and amount of payment, and a payment screenshot if available. Never share your UPI PIN, OTP, card PIN or banking password with anyone, including anyone claiming to represent the event.",
  },
  {
    title: "6 · Customer information.",
    body: "Customers must provide a valid mobile number, and an email address where requested, while booking. We use these details to issue tickets, communicate venue instructions, provide event updates and handle support or refund requests. The Organizer is not responsible for ticket-delivery failures caused by incorrect or incomplete details submitted by the customer.",
  },
  {
    title: "7 · Ticket delivery.",
    body: "After successful payment you receive a booking confirmation and ticket ID at your registered email address. Digital tickets are ordinarily issued within 48 hours of successful payment. Depending on the final operational process, customers may also receive or collect a physical event pass before the event or at the venue. If a confirmed digital ticket is not received within 48 hours, contact Support.",
  },
  {
    title: "8 · Unnamed tickets and transfers.",
    body: "Tickets do not carry the attendee's name. The person presenting a valid, unused ticket may use it for entry, subject to successful verification. The original purchaser is responsible for protecting the booking email, ticket ID and QR code; if a ticket is shared or forwarded, the first successful verification is treated as valid use. Tickets must not be duplicated, resold at a premium or used for unauthorised commercial promotion.",
  },
  {
    title: "9 · Entry and verification.",
    body: "Each ticket permits entry for one person, only on the date stated on the ticket, and one successful verification. The attendee must present the original booking email or valid digital ticket from the email inbox. Screenshots, edited images, photocopies, forwarded screenshots or duplicate QR codes may be rejected — a screenshot of a ticket is not proof of validity. We may request the ticket ID, booking mobile number, registered email address or payment reference to verify a booking. Once a ticket has been scanned or marked as used it cannot be used again. Admission remains subject to ticket validity, security checks, venue rules and event-safety requirements.",
  },
  {
    title: "10 · Children and minors.",
    body: "Every attendee, including children, requires a separate valid ticket. Children must remain under the supervision of a parent or responsible adult throughout the event. Parents and guardians are responsible for determining whether the sound levels, crowd conditions, food and event environment are appropriate for the child.",
  },
  {
    title: "11 · Physical passes.",
    body: "Where physical passes are issued, attendees must carry and display them as instructed. Lost, stolen, damaged or transferred physical passes may not be replaced unless the Organizer can independently verify that the corresponding ticket remains unused. Any replacement is subject to successful verification and operational feasibility.",
  },
  {
    title: "12 · Food.",
    body: "Food is included with each valid ticket for the applicable event day. The menu, serving arrangement, quantity and service schedule are determined by the Organizer. Specific ingredients, dietary preferences or allergen-free preparation cannot be guaranteed unless expressly confirmed. Attendees with food allergies or medical dietary restrictions should verify suitability before consuming any food. Food coupons or tokens, where issued, have no cash value and are valid only during the applicable event day.",
  },
  {
    title: "13 · Attendee conduct.",
    body: "The Organizer may refuse entry or remove a person for violence, harassment or threatening behaviour; intoxication or disorderly conduct; possession of illegal, prohibited or dangerous items; damage to venue or event property; interference with performers, staff or other attendees; ticket fraud, duplication or unauthorised resale; failure to follow security or safety instructions; or violation of applicable law or venue rules. No refund is issued where entry is refused or a person is removed because of misconduct, an invalid ticket or violation of these terms.",
  },
  {
    title: "14 · Safety and belongings.",
    body: "Attendees must follow all security, crowd-management and emergency instructions. The Organizer is not responsible for unattended, lost, misplaced, damaged or stolen personal belongings, except where liability cannot lawfully be excluded. Report any unsafe condition to event staff immediately.",
  },
  {
    title: "15 · Photography and recording.",
    body: "Photography and video recording may take place during the event for security, documentation, publicity, advertising, social media and future event promotion. By entering the venue, attendees acknowledge that they may appear incidentally in crowd photographs or recordings. The Organizer will not use an identifiable attendee as a standalone commercial endorsement without appropriate permission. Unauthorised professional photography, commercial recording, live broadcasting or use of drones may be restricted.",
  },
  {
    title: "16 · Intellectual property.",
    body: "The event name, logos, designs, website content, photographs, videos and promotional materials owned by the Organizer may not be copied, modified, sold, republished or used commercially without written permission. Third-party names, trademarks and partner logos remain the property of their respective owners.",
  },
  {
    title: "17 · Third-party services.",
    body: "The website may link to payment gateways, Google Maps, Instagram and other third-party platforms. These services operate under their own terms and privacy policies. The Organizer is not responsible for the independent functioning of third-party services, except where required by applicable law.",
  },
  {
    title: "18 · Limitation of liability.",
    body: "To the extent permitted by law, the Organizer is not responsible for indirect losses arising from personal travel, accommodation, transport, work schedules or other arrangements made by an attendee. Nothing in these terms excludes any consumer right, remedy or liability that cannot lawfully be excluded.",
  },
  {
    title: "19 · Governing law.",
    body: "These terms are governed by the laws of India. Subject to applicable consumer-protection rights, legal proceedings relating to the event, website or tickets fall under the jurisdiction of the competent courts in Rourkela or Sundargarh, Odisha.",
  },
  {
    title: "20 · Policy updates.",
    body: 'The Organizer may update this page to reflect changes in law, event operations, payment services or security requirements. The latest version is identified by the "Last updated" date. If any provision is found invalid or unenforceable, the remaining provisions continue to apply.',
  },
];

export const REFUND: Clause[] = [
  {
    title: "1 · Customer cancellations.",
    body: "Tickets are non-refundable and non-cancellable after successful purchase. Refunds will not ordinarily be provided for a change of personal plans; inability to attend; illness or personal emergency; travel delay or cancellation; selection of an incorrect event date; late arrival; failure to present a valid ticket; a ticket that has already been scanned; loss or unauthorised sharing of a ticket; entry refusal caused by misconduct; or dissatisfaction with an individual performer, activity, programme element or food choice. This policy does not limit any remedy required under applicable law.",
  },
  {
    title: "2 · Event cancellation by the Organizer.",
    body: "If the Organizer cancels the entire event and does not announce a replacement date, eligible customers receive a refund of the ticket amount paid. Refund instructions are communicated through the website, registered booking details or the official Instagram account. Once initiated, a refund may take approximately 7–10 business days to appear in the original payment method, depending on Razorpay, Cashfree, your bank or another payment provider.",
  },
  {
    title: "3 · Cancellation of one event day.",
    body: "If only one event day is cancelled, customers holding a ticket for that day receive the applicable announced refund, and customers who purchased tickets for both days receive the applicable adjustment for the cancelled day.",
  },
  {
    title: "4 · Rescheduled event.",
    body: "If the event is rescheduled, existing tickets ordinarily remain valid for the revised date. The Organizer will announce whether a refund, ticket transfer, credit or alternative arrangement is offered, depending on the circumstances and applicable law.",
  },
  {
    title: "5 · Venue or programme changes.",
    body: "A change to the entry gate, access route, parking arrangement, reporting instructions, programme, performer, food menu or event sequence does not automatically constitute event cancellation. If the venue must be changed due to circumstances beyond the Organizer's reasonable control, customers are informed through official channels.",
  },
  {
    title: "6 · Force majeure.",
    body: "The Organizer may reschedule, relocate, modify, partially cancel or cancel the event because of severe weather or natural disaster; public emergency or epidemic; government or legal restrictions; civil disturbance; safety or security concerns; venue unavailability; or another circumstance beyond the Organizer's reasonable control. The Organizer will announce whether tickets remain valid and whether a full refund, partial refund, credit or alternative arrangement applies, subject to applicable law.",
  },
  {
    title: "7 · Duplicate or failed payments.",
    body: "If you are charged more than once for the same confirmed booking, or payment is deducted without ticket issuance, the transaction is investigated. A verified duplicate or failed payment is refunded to the original payment method.",
  },
  {
    title: "8 · Refund support.",
    body: "A refund-related request must include your ticket or order ID, registered email address, registered mobile number, payment transaction ID, date and amount of payment, and a description of the issue. Refunds are never processed through unofficial social-media accounts or personal payment accounts.",
  },
];

export const PRIVACY: Clause[] = [
  {
    title: "1 · Information we collect.",
    body: "Depending on how you use the website or event services, we may collect your name where requested; email address; mobile number; ticket date and quantity; booking and ticket IDs; transaction reference and payment status; support messages and complaints; device, browser, IP address and website-usage information; ticket-verification and entry records; and photographs or videos captured during the event. We do not intentionally collect complete card information, UPI PINs, banking passwords or payment OTPs.",
  },
  {
    title: "2 · How we use information.",
    body: "To process and confirm bookings; issue digital tickets or physical passes; communicate event and venue information; verify entry and prevent ticket duplication or fraud; provide customer support; investigate payments and process refunds; maintain event security; meet tax, accounting and legal requirements; improve the website and event experience; and send promotional communication where consent has been provided or is otherwise permitted by law. Essential booking, payment, safety and event updates may be sent even if you do not opt in to promotional messages.",
  },
  {
    title: "3 · Consent and communication choices.",
    body: "By submitting information for booking or support, you authorise its use to provide the requested service. Where marketing consent is requested it is optional, and you may withdraw promotional consent using an unsubscribe option or by contacting Support.",
  },
  {
    title: "4 · Information sharing.",
    body: "Relevant information may be shared with Razorpay, Cashfree or another payment provider; email, messaging, ticketing, hosting and technology providers; Plutone Mall and authorised venue personnel; event security and entry staff; event-service providers; accountants, auditors and professional advisers; and government, judicial, regulatory or law-enforcement authorities where legally required. Personal information is not sold as an independent commercial database.",
  },
  {
    title: "5 · Data retention.",
    body: "Information is retained only for as long as reasonably required for ticket fulfilment, entry verification, customer support, fraud prevention, dispute resolution, accounting, taxation and legal obligations. Information no longer required may be securely deleted, anonymised or restricted from ordinary use.",
  },
  {
    title: "6 · Security.",
    body: "Reasonable technical and administrative measures are used to protect personal information. No online transmission or storage system can be guaranteed to be completely secure. Customers are responsible for keeping booking emails, ticket IDs and QR codes confidential.",
  },
  {
    title: "7 · Cookies and analytics.",
    body: "The website may use essential cookies or similar technologies for security, booking continuity, preferences and website performance. Analytics or advertising technologies are used with appropriate notice or consent where required. You may restrict cookies using browser settings, although some website functions may then operate differently.",
  },
  {
    title: "8 · Children's information.",
    body: "Tickets for children must be purchased and managed by a parent or legal guardian. The website is not intended to independently collect information directly from children. A parent or guardian who believes a child's information has been collected improperly may contact Support.",
  },
  {
    title: "9 · Privacy requests.",
    body: "You may contact us to request access to information associated with your booking; correction of inaccurate information; withdrawal of optional marketing consent; deletion of information no longer required; or resolution of a privacy-related grievance. Some information may be retained where required for legal, taxation, fraud-prevention, payment or dispute-resolution purposes. Reasonable identity or booking verification may be required before processing a request.",
  },
  {
    title: "10 · External links.",
    body: "Google Maps, Instagram, Razorpay, Cashfree and other external platforms operate under their own privacy policies.",
  },
  {
    title: "11 · Privacy and grievance contact.",
    body: "Grievance Officer, Junction India Enterprises — phone / WhatsApp 9348087289, email works.rourkelaj@gmail.com, support hours 10:00 AM–10:00 PM all seven days, at Ground Floor, Plot No. 1/1041, Jalda, C Block, Rourkela, Sundargarh, Odisha – 769043, India. Consumer complaints should include your name, ticket or order ID, registered contact details and a clear description of the issue. We aim to acknowledge consumer complaints within 48 hours and resolve them within one month, in accordance with applicable requirements.",
  },
];

export const CLAUSES: Record<PolicySlug, Clause[]> = {
  terms: TERMS,
  refund: REFUND,
  privacy: PRIVACY,
};
