import type { TimelineItem } from "@/components/shared/timeline";
import { Award, BadgeCheck, Handshake, HeartHandshake, Lightbulb, ShieldCheck, Sparkles, Trophy } from "lucide-react";

export const journeyItems: TimelineItem[] = [
  {
    label: "2025",
    icon: Lightbulb,
    title: "The Idea Takes Shape",
    description:
      "A difficult search for a verified pandit for a family Griha Pravesh in Noida led our founder to start mapping trusted pandits across Delhi NCR.",
  },
  {
    label: "2025",
    icon: BadgeCheck,
    title: "Verification Process & First Pandits",
    description:
      "We built a structured verification process — identity, ritual experience and family references — and onboarded our first verified pandits.",
  },
  {
    label: "2025–26",
    icon: Trophy,
    title: "1,000+ Pujas Completed",
    description:
      "Crossed 1,000 completed pujas across Delhi NCR, with fixed and transparent pricing on every booking.",
  },
  {
    label: "2026",
    icon: Sparkles,
    title: "Puja Essentials Store",
    description:
      "Launched a curated shop for puja samagri, murtis and rudraksha, delivered to your doorstep.",
  },
];

export const missionStatement =
  "To make every sacred ceremony simple, authentic and stress-free by connecting families with verified pandits at transparent prices.";

export const missionPoints = [
  "Help every family find a verified, experienced pandit for the ritual, language and tradition they follow.",
  "Keep pricing fixed and transparent, with optional samagri kits so families never have to rush to the market.",
  "Perform every ritual with the care and respect it holds for the family celebrating it.",
];

export const visionStatement =
  "To become India's most trusted platform for Hindu rituals — preserving tradition while making it accessible to every family.";

export const visionPoints = [
  "A Bharat where every family, in every city, can book a trusted pandit with complete confidence.",
  "A reliable, digital source of Vedic ritual knowledge — vidhi, muhurat and samagri — for the next generation.",
  "A respected, fairly paid livelihood for pandits, with the tools to grow their practice."
];

export const whyChooseAbout = [
  { icon: ShieldCheck, title: "Verification, Not Just Listing", description: "Every pandit's identity, ritual experience and references are verified before they are assigned to a booking." },
  { icon: Handshake, title: "Fixed Price, No Renegotiation", description: "The price you see at booking is the price you pay — samagri is an optional add-on, priced upfront." },
  { icon: HeartHandshake, title: "Built Around Families", description: "From choosing the muhurat to the final aarti, every step is designed around the family performing the ritual." },
  { icon: Award, title: "Accountable Service", description: "Families rate every completed puja, and a backup pandit or reschedule is arranged if a pandit cannot attend." },
];

export const aboutFaq = [
  { question: "How does PujariDekho verify its pandits?", answer: "Every pandit submits identity documents and details of their ritual training and experience, which our team verifies. We also check references from families they have served before assigning them to bookings." },
  { question: "Is PujariDekho affiliated with any particular temple or sect?", answer: "No — we work with pandits across traditions (Vedic, Purohit, regional) and let families choose based on the specific ritual, language and tradition they need." },
  { question: "Can I trust the pricing shown on the platform?", answer: "Yes. The price shown at the time of booking is fixed — there are no hidden charges added afterward. Samagri is optional: you can bring your own or add our samagri kit, priced upfront." },
  { question: "How can my business or temple partner with PujariDekho?", answer: "Use the Get in Touch button in the Become a Partner section above or visit our Contact page. We work with samagri suppliers, temples and community organisations." },
  { question: "What happens if my pandit cannot attend?", answer: "If your assigned pandit becomes unavailable, we will try to arrange another verified pandit for the same date and time. If we cannot, you can choose to reschedule free of charge or cancel for a full refund." },
];
