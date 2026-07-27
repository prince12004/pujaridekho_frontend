import { Coffee, GraduationCap, HeartPulse, PartyPopper } from "lucide-react";
import type { TimelineItem } from "@/components/shared/timeline";

export interface JobOpening {
  title: string;
  department: string;
  location: string;
  type: string;
}

export const openPositions: JobOpening[] = [
  { title: "Senior Frontend Engineer", department: "Engineering", location: "Delhi NCR / Remote", type: "Full-time" },
  { title: "Pandit Relations Manager", department: "Operations", location: "New Delhi", type: "Full-time" },
  { title: "Customer Experience Associate", department: "Support", location: "Noida", type: "Full-time" },
  { title: "Content Writer — Astrology & Rituals", department: "Content", location: "Remote", type: "Contract" },
  { title: "City Operations Lead — Gurgaon", department: "Operations", location: "Gurgaon", type: "Full-time" },
];

export const cultureValues = [
  "We book our own family's poojas on the platform — we feel the product the same way our customers do.",
  "Decisions are made close to the pandits and families they affect, not purely from a dashboard.",
  "We move quickly, but never at the cost of a family's trust in the pandit we send them.",
];

export const employeeBenefits = [
  { icon: HeartPulse, title: "Health Insurance", description: "Comprehensive medical cover for you and your immediate family." },
  { icon: PartyPopper, title: "Festival Leave", description: "Extra paid leave around major festivals, on top of standard annual leave." },
  { icon: GraduationCap, title: "Learning Budget", description: "Annual budget for courses, books or conferences relevant to your role." },
  { icon: Coffee, title: "Flexible Hours", description: "Core collaboration hours with flexibility around the rest of your day." },
];

export const hiringProcessSteps: TimelineItem[] = [
  { label: "Step 1", title: "Apply Online", description: "Submit the form below with your resume link and a short note on why you're interested." },
  { label: "Step 2", title: "Screening Call", description: "A 20-minute call with our team to understand your background and answer questions." },
  { label: "Step 3", title: "Role-Specific Round", description: "A practical exercise or interview relevant to the role you've applied for." },
  { label: "Step 4", title: "Final Conversation & Offer", description: "A conversation with the founding team, followed by an offer within a few days." },
];

export const careersFaq = [
  { question: "Do you offer remote positions?", answer: "Some roles (like Content and select Engineering positions) are remote-friendly; operations roles typically require presence in the relevant city." },
  { question: "What's the interview process timeline?", answer: "Most candidates go from application to offer within 2–3 weeks, depending on role seniority." },
  { question: "Can I apply for more than one open position?", answer: "Yes, mention all roles you're interested in in the message field of the application form." },
];
