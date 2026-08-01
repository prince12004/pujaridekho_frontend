import type {
  BlogPost,
  City,
  FaqItem,
  Festival,
  Pandit,
  Pooja,
  ProcessStep,
  Product,
  ShopCategory,
  Testimonial,
  TrustStat,
  WhyChooseItem,
} from "./types";

export const trustStats: TrustStat[] = [
  { value: "500+", label: "Verified Pandits" },
  { value: "4.9★", label: "Customer Rating" },
  { value: "10,000+", label: "Completed Poojas" },
  { value: "24×7", label: "Support Available" },
  { value: "100%", label: "Verified Priests" },
];

export const featuredPoojas: Pooja[] = [
  { slug: "satyanarayan-puja", name: "Satyanarayan Puja", duration: "2–3 hrs", location: "Home Visit · Delhi NCR", price: 2100, marketPrice: 2800, image: "roundBowlCandle", tag: "Most Booked" },
  { slug: "griha-pravesh", name: "Griha Pravesh Puja", duration: "3–4 hrs", location: "Home Visit · Delhi NCR", price: 3500, marketPrice: 4500, image: "candlesCircleFloor", tag: "Popular" },
  { slug: "vastu-shanti", name: "Vastu Shanti Puja", duration: "2 hrs", location: "Home Visit", price: 2800, marketPrice: 3600, image: "candleGroup2" },
  { slug: "navgraha-shanti", name: "Navgraha Shanti Puja", duration: "2–3 hrs", location: "Home or Temple", price: 3100, marketPrice: 4000, image: "whiteRoundLight" },
  { slug: "lakshmi-puja", name: "Lakshmi Puja", duration: "1–2 hrs", location: "Home Visit", price: 1800, marketPrice: 2400, image: "bowlWoodenTable" },
  { slug: "ganesh-puja", name: "Ganesh Puja", duration: "1–2 hrs", location: "Home Visit", price: 1500, marketPrice: 2000, image: "ganeshIdol", tag: "Most Booked" },
  { slug: "marriage-puja", name: "Vivah (Marriage) Puja", duration: "Full Day", location: "Venue of Choice", price: 15000, marketPrice: 19000, image: "handHoldingCandle" },
  { slug: "vehicle-puja", name: "Vehicle Puja", duration: "30–45 min", location: "Home / Showroom", price: 800, marketPrice: 1100, image: "tealightCandle" },
  { slug: "office-puja", name: "Office / Shop Opening Puja", duration: "1–2 hrs", location: "Business Premises", price: 2200, marketPrice: 2900, image: "scentedCandle" },
];

export const festivalPoojas: Festival[] = [
  { slug: "sawan-somwar", name: "Sawan Somwar Shiv Puja", dateLabel: "Ongoing · Jul–Aug 2026", image: "candleDarkTable" },
  { slug: "raksha-bandhan", name: "Raksha Bandhan Puja", dateLabel: "Aug 2026", image: "brassBells" },
  { slug: "janmashtami", name: "Janmashtami Puja", dateLabel: "Sep 2026", image: "threeCandlesBowl" },
  { slug: "ganesh-chaturthi", name: "Ganesh Chaturthi Sthapana", dateLabel: "Sep 2026", image: "ganeshIdol" },
  { slug: "navratri", name: "Navratri Kalash Sthapana", dateLabel: "Oct 2026", image: "candlesCircleFloor" },
  { slug: "holi", name: "Holi Celebration Puja", dateLabel: "Mar 2027", image: "holiColors" },
  { slug: "diwali", name: "Diwali Lakshmi Puja", dateLabel: "Nov 2026", image: "candleGroupTable" },
  { slug: "mahashivratri", name: "Mahashivratri Rudrabhishek", dateLabel: "Feb 2027", image: "candleBrownHolder" },
];

export const shopCategories: ShopCategory[] = [
  { slug: "pooja-samagri-kits", name: "Pooja Samagri Kits", itemCount: "14+ items", icon: "kit" },
  { slug: "rudraksha", name: "Rudraksha", itemCount: "New", icon: "rudraksha" },
  { slug: "idols-murtis", name: "Idols & Murtis", itemCount: "New", icon: "murti" },
  { slug: "yantra", name: "Yantra", itemCount: "New", icon: "yantra" },
  { slug: "brass-copper-items", name: "Brass & Copper Items", itemCount: "New", icon: "kit" },
  { slug: "incense-dhoop", name: "Incense & Dhoop", itemCount: "New", icon: "incense" },
  { slug: "hawan-samagri", name: "Hawan Samagri", itemCount: "New", icon: "havan" },
  { slug: "spiritual-accessories", name: "Spiritual Accessories", itemCount: "New", icon: "mala" },
  { slug: "books", name: "Books", itemCount: "New", icon: "book" },
];

export const cities: City[] = [
  { slug: "delhi", name: "Delhi", panditCount: "180+ Pandits" },
  { slug: "noida", name: "Noida", panditCount: "65+ Pandits" },
  { slug: "greater-noida", name: "Greater Noida", panditCount: "40+ Pandits" },
  { slug: "ghaziabad", name: "Ghaziabad", panditCount: "55+ Pandits" },
  { slug: "gurgaon", name: "Gurgaon", panditCount: "70+ Pandits" },
  { slug: "faridabad", name: "Faridabad", panditCount: "38+ Pandits" },
  { slug: "dwarka", name: "Dwarka", panditCount: "32+ Pandits" },
  { slug: "rohini", name: "Rohini", panditCount: "29+ Pandits" },
  { slug: "indirapuram", name: "Indirapuram", panditCount: "24+ Pandits" },
  { slug: "vaishali", name: "Vaishali", panditCount: "20+ Pandits" },
];

export const topPandits: Pandit[] = [
  { slug: "ramesh-sharma", name: "Pandit Ramesh Sharma Ji", initials: "RS", specialization: "Vedic Rituals & Griha Pravesh", experience: "18 yrs experience", languages: "Hindi, Sanskrit, English", rating: 4.9, completedPoojas: "2,400+ Poojas" },
  { slug: "suresh-trivedi", name: "Pandit Suresh Trivedi Ji", initials: "ST", specialization: "Satyanarayan & Navgraha", experience: "22 yrs experience", languages: "Hindi, Sanskrit", rating: 4.8, completedPoojas: "3,100+ Poojas" },
  { slug: "devendra-pathak", name: "Pandit Devendra Pathak Ji", initials: "DP", specialization: "Marriage & Muhurat", experience: "25 yrs experience", languages: "Hindi, Sanskrit, Bhojpuri", rating: 5.0, completedPoojas: "4,000+ Poojas" },
  { slug: "anil-shastri", name: "Pandit Anil Shastri Ji", initials: "AS", specialization: "Vastu & Yantra Sthapana", experience: "15 yrs experience", languages: "Hindi, English, Punjabi", rating: 4.9, completedPoojas: "1,850+ Poojas" },
  { slug: "vinod-mishra", name: "Pandit Vinod Mishra Ji", initials: "VM", specialization: "Rudrabhishek & Shiv Puja", experience: "12 yrs experience", languages: "Hindi, Sanskrit", rating: 4.7, completedPoojas: "1,200+ Poojas" },
  { slug: "ashok-tiwari", name: "Pandit Ashok Tiwari Ji", initials: "AT", specialization: "Kundli & Astrology", experience: "20 yrs experience", languages: "Hindi, English, Sanskrit", rating: 4.9, completedPoojas: "2,700+ Poojas" },
];

export const religiousProducts: Product[] = [
  { slug: "puja-thali-set", name: "Premium Puja Thali Set (Brass)", price: 1299, image: "brassBells" },
  { slug: "panchmukhi-rudraksha-mala", name: "Panchmukhi Rudraksha Mala", price: 899, image: "candleBrownHolder" },
  { slug: "brass-ganesh-murti", name: "Brass Ganesh Murti (6 inch)", price: 1650, image: "ganeshIdol" },
  { slug: "havan-kund-samagri", name: "Havan Kund with Full Samagri", price: 749, image: "candleGroup2" },
  { slug: "sri-yantra-copper", name: "Sri Yantra (Pure Copper)", price: 599, image: "whiteRoundLight" },
  { slug: "sandalwood-dhoop-pack", name: "Sandalwood Dhoop & Incense Pack", price: 299, image: "incenseSmoke" },
];

export const testimonials: Testimonial[] = [
  { name: "Ritu Kapoor", location: "Dwarka, Delhi", rating: 5, quote: "The pandit ji arrived exactly on time with everything needed for our Griha Pravesh. Every ritual was explained to us — felt authentic and unhurried." },
  { name: "Sanjay Malhotra", location: "Gurgaon", rating: 5, quote: "Booked a Satyanarayan Puja the same evening for the next morning. Samagri was complete and pricing matched exactly what was quoted." },
  { name: "Anita Verma", location: "Rohini, Delhi", rating: 5, quote: "Used PujariDekho for my son's Mundan ceremony. The pandit was warm, patient, and clearly experienced. Highly recommend." },
  { name: "Deepak Chauhan", location: "Noida", rating: 4, quote: "Great experience overall — samagri and pandit both on point. Would love more evening slots on weekdays." },
  { name: "Meera Iyer", location: "Vaishali, Ghaziabad", rating: 5, quote: "The free Kundli tool was surprisingly detailed, and the astrologer consultation helped us pick the right muhurat." },
];

export const blogPosts: BlogPost[] = [
  { slug: "griha-pravesh-2026-vidhi-guide", title: "Griha Pravesh 2026: Auspicious Dates & Complete Vidhi", category: "Guides", readTime: "6 min read", image: "candlesCircleFloor" },
  { slug: "navgraha-shanti-when-you-need-it", title: "Navgraha Shanti: When Do You Actually Need It?", category: "Astrology", readTime: "5 min read", image: "whiteRoundLight" },
  { slug: "sawan-somwar-2026-fasting-rules", title: "Sawan Somwar 2026: Fasting Rules & Puja Vidhi Explained", category: "Festivals", readTime: "4 min read", image: "candleDarkTable" },
];

export const faqItems: FaqItem[] = [
  { question: "Are all pandits on PujariDekho verified?", answer: "Yes — every pandit undergoes identity verification, background checks and a review of their ritual experience before being listed on the platform." },
  { question: "Is puja samagri included in the price?", answer: "Every booking marked \"Samagri Included\" comes with complete, temple-grade materials for that specific ritual — no separate shopping needed." },
  { question: "Which cities do you currently serve?", answer: "We currently serve Delhi, Noida, Greater Noida, Ghaziabad, Gurgaon, Faridabad, Dwarka, Rohini, Indirapuram and Vaishali, with more cities being added regularly." },
  { question: "Can I reschedule or cancel my booking?", answer: "Yes, bookings can be rescheduled or cancelled free of charge up to 24 hours before the scheduled puja time." },
  { question: "Is my payment secure?", answer: "All payments are processed through encrypted, PCI-compliant gateways — your card and banking details are never stored on our servers." },
  { question: "How do I register as a pandit on PujariDekho?", answer: "Click \"Become a Pandit\" in the header, complete the verification form with your credentials and experience, and our team will onboard you within 3–5 business days." },
];

export const processSteps: ProcessStep[] = [
  { title: "Choose Your Puja", description: "Pick a ritual, festival puja, or consultation from our catalog of verified offerings." },
  { title: "Book a Date & Time", description: "Select a convenient slot — same-day and next-day booking available in most cities." },
  { title: "Pandit Ji Visits Home", description: "A verified priest arrives with complete samagri and performs the puja as per vidhi." },
];

export const whyChooseItems: WhyChooseItem[] = [
  { title: "Verified Pandits", description: "Every priest is identity-checked and reviewed before listing." },
  { title: "Transparent Pricing", description: "One fixed price, shown upfront — no last-minute additions." },
  { title: "Experienced Priests", description: "Average 15+ years performing traditional Vedic rituals." },
  { title: "Complete Puja Samagri", description: "Temple-grade materials arranged and delivered with the pandit." },
  { title: "Secure Payments", description: "Encrypted, PCI-compliant checkout on every booking." },
  { title: "24×7 Support", description: "Real people on call or WhatsApp whenever you need help." },
];

export const bookingCities = ["Delhi", "Noida", "Gurgaon", "Ghaziabad", "Faridabad", "Greater Noida"];
