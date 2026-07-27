import { BadgeIndianRupee, CalendarClock, ShieldCheck, TrendingUp } from "lucide-react";
import type { TimelineItem } from "@/components/shared/timeline";

export const panditBenefits = [
  { icon: BadgeIndianRupee, title: "Fixed, Fair Pricing", description: "No haggling over dakshina — every booking has a clear, pre-agreed payout for you." },
  { icon: CalendarClock, title: "Choose Your Own Schedule", description: "Accept or decline bookings based on your own availability — there's no minimum commitment." },
  { icon: TrendingUp, title: "Steady Booking Flow", description: "Get matched with families actively searching for a pandit in your city and specialization." },
  { icon: ShieldCheck, title: "Verified Badge & Reviews", description: "Build a public reputation with genuine ratings from families you've served." },
];

export const eligibilityCriteria = [
  "Minimum 3 years of experience performing Vedic rituals, either independently or under a senior pandit/guru.",
  "Working knowledge of Hindi and at least one regional language commonly spoken in Delhi NCR.",
  "Ability to travel to the client's home or venue within your registered service city.",
  "A valid government-issued photo ID for identity verification.",
];

export const documentsRequired = [
  "Aadhaar Card or any government-issued photo ID",
  "A recent passport-size photograph",
  "Proof of address (utility bill, rent agreement, or Aadhaar)",
  "Certificate or reference from a guru, temple or senior pandit (if available)",
  "Bank account details for payouts (account number + IFSC)",
];

export const registrationSteps: TimelineItem[] = [
  { label: "Step 1", title: "Submit Your Application", description: "Fill out the registration form below with your experience, specialization and city." },
  { label: "Step 2", title: "Document Verification", description: "Our team reviews your submitted documents and references — typically within 2–3 business days." },
  { label: "Step 3", title: "Verification Call", description: "A short call to confirm your ritual experience, availability and the poojas you're comfortable performing." },
  { label: "Step 4", title: "Profile Goes Live", description: "Once approved, your verified profile appears to families searching in your city — you start receiving bookings." },
];

export const earningsBreakdown = [
  { pooja: "Ganesh / Lakshmi Puja (1–2 hrs)", payout: "₹1,000 – ₹1,200" },
  { pooja: "Satyanarayan Puja (2–3 hrs)", payout: "₹1,400 – ₹1,700" },
  { pooja: "Griha Pravesh Puja (3–4 hrs)", payout: "₹2,200 – ₹2,800" },
  { pooja: "Vivah / Marriage Puja (Full Day)", payout: "₹8,000 – ₹11,000" },
];

export const panditTestimonials = [
  { name: "Pandit Ramesh Sharma Ji", location: "Delhi", rating: 5, quote: "I used to depend entirely on word-of-mouth. Now I get 8-10 bookings a month through PujariDekho, and families already know my specialization before they call." },
  { name: "Pandit Vinod Mishra Ji", location: "Faridabad", rating: 5, quote: "The verification process was thorough but fair — and it means the families I meet already trust me before I arrive." },
  { name: "Pandit Anil Shastri Ji", location: "Gurgaon", rating: 4, quote: "Payouts are exactly what was agreed at booking. No last-minute negotiation, which I genuinely appreciate." },
];

export const panditFaq = [
  { question: "Is there a registration fee to join?", answer: "No, registering and getting verified as a pandit on PujariDekho is completely free." },
  { question: "How much can I expect to earn?", answer: "Earnings depend on how many bookings you accept and their type — see the earnings breakdown above for typical payouts per puja." },
  { question: "Can I still take bookings outside the platform?", answer: "Yes — registering with PujariDekho doesn't restrict you from performing rituals through your existing network as well." },
  { question: "What happens if a family cancels last minute?", answer: "Per our cancellation policy, late cancellations (within 24 hours) include a partial payout to you to compensate for the reserved time." },
];
