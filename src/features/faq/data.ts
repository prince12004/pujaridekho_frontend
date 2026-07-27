export interface CategorizedFaq {
  category: string;
  question: string;
  answer: string;
}

export const faqCategories = ["All", "Booking", "Payments", "Pandits", "Cities", "Account"];

export const allFaqs: CategorizedFaq[] = [
  { category: "Booking", question: "How far in advance should I book a puja?", answer: "For regular poojas, same-day or next-day booking is usually available. For festival poojas (Diwali, Navratri) we recommend booking at least a week in advance as slots fill quickly." },
  { category: "Booking", question: "Can I reschedule or cancel my booking?", answer: "Yes, bookings can be rescheduled or cancelled free of charge up to 24 hours before the scheduled puja time." },
  { category: "Booking", question: "Is puja samagri included in the price?", answer: "Every booking marked \"Samagri Included\" comes with complete, temple-grade materials for that specific ritual — no separate shopping needed." },
  { category: "Booking", question: "What happens if the pandit is late or doesn't show up?", answer: "This is extremely rare given our verification process, but if it happens, contact support immediately — we'll arrange a replacement pandit or a full refund." },
  { category: "Payments", question: "Is my payment secure?", answer: "All payments are processed through encrypted, PCI-compliant gateways — your card and banking details are never stored on our servers." },
  { category: "Payments", question: "What payment methods are accepted?", answer: "We accept UPI, credit/debit cards, net banking and popular wallets through our Razorpay-powered checkout." },
  { category: "Payments", question: "Can I get an invoice for my booking?", answer: "Yes, a GST-compliant invoice is automatically generated and available in your dashboard after every completed booking." },
  { category: "Pandits", question: "Are all pandits on PujariDekho verified?", answer: "Yes — every pandit undergoes identity verification, background checks and a review of their ritual experience before being listed on the platform." },
  { category: "Pandits", question: "Can I choose a pandit who speaks a specific language?", answer: "Yes, pandit profiles list the languages they're fluent in — you can filter by language when browsing available pandits." },
  { category: "Pandits", question: "How are pandit ratings calculated?", answer: "Ratings come exclusively from families who completed a verified booking — there's no way to purchase or fake a rating on the platform." },
  { category: "Cities", question: "Which cities do you currently serve?", answer: "We currently serve Delhi, Noida, Greater Noida, Ghaziabad, Gurgaon, Faridabad, Dwarka, Rohini, Indirapuram and Vaishali, with more cities being added regularly." },
  { category: "Cities", question: "Can I request service in a new city?", answer: "Yes — email us at support@pujaridekho.com with your city and we'll prioritise it as we expand our verified pandit network." },
  { category: "Account", question: "Do I need an account to book a puja?", answer: "You need to log in with your mobile number via OTP to confirm a booking, but browsing poojas, pandits and the shop doesn't require an account." },
  { category: "Account", question: "How do I change my registered mobile number?", answer: "Go to your Dashboard → Profile → Change Mobile Number, and verify the new number via OTP." },
  { category: "Account", question: "How do I delete my account and data?", answer: "Email support@pujaridekho.com with a deletion request — we'll process it within 7 business days in line with our Privacy Policy." },
];
