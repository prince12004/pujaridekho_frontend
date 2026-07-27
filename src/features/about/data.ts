import type { TimelineItem } from "@/components/shared/timeline";
import { Award, Handshake, HeartHandshake, ShieldCheck } from "lucide-react";

export const aboutStats = [
  { value: "500+", label: "Verified Pandits" },
  { value: "10,000+", label: "Poojas Completed" },
  { value: "10", label: "Cities Served" },
  { value: "4.9★", label: "Average Rating" },
];

export const journeyItems: TimelineItem[] = [
  {
    label: "2021",
    title: "The Idea Takes Shape",
    description:
      "After struggling to find a reliable, verified pandit for a family Griha Pravesh in Noida, our founders started mapping local pandits across Delhi NCR by hand.",
  },
  {
    label: "2022",
    title: "First 50 Verified Pandits Onboarded",
    description:
      "We built our verification process — identity checks, ritual experience review, and family references — and onboarded our first cohort of pandits across Delhi and Noida.",
  },
  {
    label: "2023",
    title: "Expanded Across Delhi NCR",
    description:
      "Grew to Gurgaon, Ghaziabad, Faridabad and Greater Noida, and introduced fixed, transparent pricing with samagri included in every booking.",
  },
  {
    label: "2024",
    title: "10,000th Puja Completed",
    description:
      "Crossed 10,000 completed poojas and launched festival-season advance booking so families never have to scramble during Diwali or Navratri.",
  },
  {
    label: "2025–26",
    title: "Astrology & Puja Essentials",
    description:
      "Added free Kundli generation, live astrologer consultations, and a curated shop for temple-grade puja samagri, murtis and rudraksha.",
  },
];

export const missionPoints = [
  "Make it effortless for any family to find a genuinely verified, experienced pandit — no matter which city they're in.",
  "Remove the anxiety of last-minute samagri shopping by including everything a ritual needs in one fixed price.",
  "Treat every ritual with the same seriousness and respect it holds in the household performing it.",
];

export const visionPoints = [
  "A Bharat where every family, in every city, can book a trusted pandit as easily as they book a cab.",
  "A living, digital record of Vedic ritual knowledge — vidhi, muhurat and samagri — accessible to the next generation.",
  "A dignified, well-paying platform for thousands of pandits to practice their craft on their own terms.",
];

export const whyChooseAbout = [
  { icon: ShieldCheck, title: "Verification, Not Just Listing", description: "Every pandit is background-checked and reviewed before they ever appear on the platform." },
  { icon: Handshake, title: "Fixed Price, No Renegotiation", description: "The price you see at booking is the price you pay — samagri included." },
  { icon: HeartHandshake, title: "Built By a Family, For Families", description: "Our own team has planned Griha Pravesh, Mundan and Vivah ceremonies — we design for the person booking, not just the transaction." },
  { icon: Award, title: "Accountable Service", description: "Every completed puja is rated by the family that booked it — ratings are public and permanent." },
];

export const teamMembers = [
  { name: "Ankit Sharma", role: "Co-Founder & CEO", initials: "AS" },
  { name: "Priya Nair", role: "Co-Founder & Head of Pandit Relations", initials: "PN" },
  { name: "Rohit Malhotra", role: "Head of Operations", initials: "RM" },
  { name: "Kavita Desai", role: "Head of Customer Experience", initials: "KD" },
];

export const aboutFaq = [
  { question: "How does PujariDekho verify its pandits?", answer: "Every pandit submits identity documents and proof of ritual training or lineage, which our team personally verifies. We also collect references from prior families they've served before listing them on the platform." },
  { question: "Is PujariDekho affiliated with any particular temple or sect?", answer: "No — we work with pandits across traditions (Vedic, Purohit, regional) and let families choose based on the specific ritual, language and tradition they need." },
  { question: "Can I trust the pricing shown on the platform?", answer: "Yes. The price shown at the time of booking is fixed and includes samagri for that specific ritual — there are no hidden charges added afterward." },
  { question: "How can my business or temple partner with PujariDekho?", answer: "Reach out through our Become a Partner section below or email partners@pujaridekho.com — we work with samagri suppliers, temples and community organizations." },
];
