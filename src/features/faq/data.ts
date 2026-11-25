export interface CategorizedFaq {
  category: string;
  question: string;
  answer: string;
}

export const faqCategories = ["All", "Booking", "Payments", "Pandits", "Cities", "Account"];

export const allFaqs: CategorizedFaq[] = [
  { category: "Booking", question: "How far in advance should I book a puja?", answer: "We recommend booking at least 2–3 days in advance. Shorter-notice bookings are accepted subject to pandit availability, which we confirm before the booking is final. For festival pujas (Diwali, Navratri) book at least a week ahead as slots fill quickly." },
  { category: "Booking", question: "Can I reschedule or cancel my booking?", answer: "Yes, bookings can be rescheduled or cancelled free of charge up to 24 hours before the scheduled puja time. The ₹99 booking fee is non-refundable, except when we cannot provide a pandit." },
  { category: "Booking", question: "Is puja samagri included in the price?", answer: "Samagri is optional. The puja price covers the pandit ji's service; while booking you can add the complete samagri kit for that ritual and it comes with the pandit ji. If you don't add it, the pandit ji shares the list in advance so you can arrange it yourself." },
  { category: "Booking", question: "What happens if the pandit is late or doesn't show up?", answer: "If your assigned pandit becomes unavailable, we will try to arrange another verified pandit for the same date and time. If we cannot, you can choose to reschedule free of charge or cancel for a full refund." },
  { category: "Payments", question: "Is my payment secure?", answer: "All payments are processed through encrypted, PCI-compliant gateways — your card and banking details are never stored on our servers." },
  { category: "Payments", question: "What payment methods are accepted?", answer: "We accept UPI, credit/debit cards, net banking and popular wallets through our Razorpay-powered checkout." },
  { category: "Payments", question: "Can I get an invoice for my booking?", answer: "Yes, a GST-compliant invoice is automatically generated and available in your dashboard after every completed booking." },
  { category: "Pandits", question: "Are all pandits on PujariDekho verified?", answer: "Yes — every pandit undergoes identity verification, background checks and a review of their ritual experience before being listed on the platform." },
  { category: "Pandits", question: "Can I choose a pandit who speaks a specific language?", answer: "Yes, pandit profiles list the languages they're fluent in — you can filter by language when browsing available pandits." },
  { category: "Pandits", question: "How are pandit ratings calculated?", answer: "Ratings come exclusively from families who completed a verified booking — there's no way to purchase or fake a rating on the platform." },
  { category: "Cities", question: "Which cities do you currently serve?", answer: "We currently serve Noida, Greater Noida (including Greater Noida West), Ghaziabad, Delhi and Gurugram — including localities such as Indirapuram, Vaishali, Dwarka and Rohini." },
  { category: "Cities", question: "Can I request service in a new city?", answer: "Yes — email us at support@pujaridekho.com with your city and we'll prioritise it as we expand our verified pandit network." },
  { category: "Account", question: "Do I need an account to book a puja?", answer: "You need to log in with your mobile number via OTP to confirm a booking, but browsing poojas, pandits and the shop doesn't require an account." },
  { category: "Account", question: "How do I change my registered mobile number?", answer: "Go to your Dashboard → Profile → Change Mobile Number, and verify the new number via OTP." },
  { category: "Account", question: "How do I delete my account and data?", answer: "Email support@pujaridekho.com with a deletion request — we'll process it within 7 business days in line with our Privacy Policy." },
];
