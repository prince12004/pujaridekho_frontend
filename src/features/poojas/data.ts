import type { PoojaDetail } from "./types";

export const poojaCategories = [
  "All",
  "Home Poojas",
  "Griha Pravesh & Vastu",
  "Astrology & Graha Shanti",
  "Wealth & Prosperity",
  "Ganpati Poojas",
  "Marriage & Life Events",
  "Vehicle & Business",
];

const defaultFaqExtra = [
  { question: "Is samagri really included, or do I need to buy anything?", answer: "Everything listed under \"Samagri Included\" is brought by the pandit — you don't need to purchase anything separately." },
  { question: "What if I need to reschedule?", answer: "Free rescheduling up to 24 hours before the scheduled time, per our Refund Policy." },
];

export const poojas: PoojaDetail[] = [
  {
    slug: "satyanarayan-puja",
    name: "Satyanarayan Puja",
    category: "Home Poojas",
    duration: "2–3 hrs",
    location: "Home Visit · Delhi NCR",
    price: 2100,
    marketPrice: 2800,
    image: "roundBowlCandle",
    galleryImages: ["roundBowlCandle", "candleBrownHolder", "bowlWoodenTable"],
    tag: "Most Booked",
    overview:
      "Satyanarayan Puja honours Lord Vishnu in his form as Satyanarayan — \"the embodiment of truth.\" It's one of the most frequently performed home poojas, typically done on full moon days or to mark a happy occasion, resolve a difficulty, or simply as a periodic act of gratitude.",
    benefits: [
      "Invokes prosperity, harmony and truthfulness within the household",
      "Traditionally performed to mark the successful completion of an important task",
      "Strengthens family bonds through a shared ritual and the Satyanarayan Katha (story)",
    ],
    importance:
      "The puja is centred around the Satyanarayan Katha, a story illustrating the rewards of truth and devotion, and the consequences of breaking a vow made to the divine. It's considered auspicious enough to be repeated at any life stage.",
    whoShouldPerform:
      "Any householder can sponsor this puja — no specific eligibility is required. It's commonly performed by the head of the family, with the full household present for the katha and prasad.",
    samagri: [
      "Panchamrit (milk, curd, honey, ghee, sugar) and fresh fruits",
      "Banana leaves/stalks for the mandap",
      "Turmeric, kumkum, akshat and betel nuts",
      "Ghee, cotton wicks and a brass diya",
      "Wheat flour and jaggery for the prasad (sheera)",
    ],
    vidhiSteps: [
      { title: "Sankalpa", description: "The householder takes a formal vow (sankalpa) stating the intention behind the puja." },
      { title: "Ganesh & Kalash Puja", description: "Lord Ganesh is invoked first, followed by installation and worship of the kalash." },
      { title: "Satyanarayan Katha", description: "The pandit narrates the five chapters of the Satyanarayan Katha aloud to those present." },
      { title: "Aarti & Prasad", description: "The puja concludes with aarti and distribution of the sheera prasad to all attendees." },
    ],
    packages: [
      { name: "Essential", price: 2100, duration: "2 hrs", features: ["Pandit + full samagri", "Satyanarayan Katha", "Prasad for up to 10 people"] },
      { name: "Complete", price: 3200, duration: "3 hrs", features: ["Everything in Essential", "Havan included", "Prasad for up to 25 people"] },
    ],
    faq: [
      { question: "Can this puja be done in the evening?", answer: "Yes, it's commonly performed in the evening, especially on Purnima (full moon)." },
      ...defaultFaqExtra,
    ],
    relatedBlogSlugs: ["satyanarayan-puja-vidhi-and-benefits"],
    relatedProductSlugs: ["puja-thali-set"],
  },
  {
    slug: "griha-pravesh",
    name: "Griha Pravesh Puja",
    category: "Griha Pravesh & Vastu",
    duration: "3–4 hrs",
    location: "Home Visit · Delhi NCR",
    price: 3500,
    marketPrice: 4500,
    image: "candlesCircleFloor",
    galleryImages: ["candlesCircleFloor", "threeCandlesBowl", "handHoldingCandle"],
    tag: "Popular",
    overview:
      "Griha Pravesh — \"entering the house\" — is the ceremony performed before a family moves into a new home. It invokes Vastu Purusha, neutralises residual negative energy from construction, and sets an auspicious tone for the years ahead.",
    benefits: [
      "Ritually purifies and consecrates a new or previously-owned home before you move in",
      "Pacifies Vastu Purusha, the presiding energy of the dwelling",
      "Marks a clear, auspicious beginning for the household in its new home",
    ],
    importance:
      "There are three recognised types — Apoorva (a newly built home, first entry), Sapoorva (returning after a long absence) and Dwandwah (a previously-owned home) — each with small variations your pandit will confirm at booking.",
    whoShouldPerform:
      "The family moving into the home should be present throughout, particularly the head of household and whoever will cross the threshold first (traditionally the woman of the house, carrying a kalash).",
    samagri: [
      "Kalash, coconut, mango leaves and a copper vessel",
      "Raw rice, turmeric, kumkum and akshat",
      "Ghee, cotton wicks and a brass diya",
      "Fresh milk for the traditional boiling-over ritual",
      "Havan samagri and a Ganesh idol for sthapana",
    ],
    vidhiSteps: [
      { title: "Ganesh Puja", description: "Removes obstacles before the main ceremony begins." },
      { title: "Vastu Shanti Puja", description: "Invokes and pacifies Vastu Purusha at the Brahmasthan (centre) of the home." },
      { title: "Navagraha Puja", description: "The nine planetary deities are worshipped for planetary harmony." },
      { title: "Milk-Boiling & Threshold Entry", description: "Milk is boiled over as the family enters, right foot forward, carrying a kalash." },
      { title: "Havan", description: "A closing fire ceremony with offerings for prosperity and protection." },
    ],
    packages: [
      { name: "Essential", price: 3500, duration: "3 hrs", features: ["Pandit + full samagri", "Vastu Shanti + Navagraha Puja", "Milk-boiling & threshold ritual"] },
      { name: "Complete", price: 4800, duration: "4 hrs", features: ["Everything in Essential", "Extended havan", "Satyanarayan Katha included"] },
    ],
    faq: [
      { question: "Can Griha Pravesh be performed at night?", answer: "It's traditionally performed in the morning or early afternoon, aligned with an auspicious muhurat." },
      ...defaultFaqExtra,
    ],
    relatedBlogSlugs: ["griha-pravesh-2026-vidhi-guide"],
    relatedProductSlugs: ["havan-kund-samagri", "puja-thali-set"],
  },
  {
    slug: "vastu-shanti",
    name: "Vastu Shanti Puja",
    category: "Griha Pravesh & Vastu",
    duration: "2 hrs",
    location: "Home Visit",
    price: 2800,
    marketPrice: 3600,
    image: "candleGroup2",
    galleryImages: ["candleGroup2", "candleDarkTable"],
    overview:
      "Vastu Shanti Puja pacifies Vastu Purusha — the deity believed to preside over a plot of land or dwelling — to neutralise structural or directional imbalances and restore harmony to the home.",
    benefits: [
      "Addresses Vastu-related concerns without structural renovation",
      "Recommended after purchasing a previously-owned home",
      "Often performed alongside Griha Pravesh, but can be done independently",
    ],
    importance:
      "Even homes that are structurally sound per Vastu principles benefit from this puja as a periodic reset — many families perform it every few years or after any major renovation.",
    whoShouldPerform:
      "Any resident of the home, ideally the person who holds the property title, with as many household members present as possible.",
    samagri: ["Kalash and copper vessel", "Nine-coloured cloth (Navagraha), rice and turmeric", "Ghee, cotton wicks and diya", "Havan samagri"],
    vidhiSteps: [
      { title: "Sankalpa", description: "A formal vow stating the intention to pacify Vastu Purusha." },
      { title: "Vastu Purusha Puja", description: "Worship performed at the Brahmasthan (centre) of the home." },
      { title: "Havan", description: "A concluding fire ceremony for protection and balance." },
    ],
    packages: [
      { name: "Essential", price: 2800, duration: "2 hrs", features: ["Pandit + full samagri", "Vastu Purusha Puja", "Havan included"] },
    ],
    faq: [...defaultFaqExtra],
    relatedBlogSlugs: ["vastu-tips-for-main-entrance"],
    relatedProductSlugs: [],
  },
  {
    slug: "navgraha-shanti",
    name: "Navgraha Shanti Puja",
    category: "Astrology & Graha Shanti",
    duration: "2–3 hrs",
    location: "Home or Temple",
    price: 3100,
    marketPrice: 4000,
    image: "whiteRoundLight",
    galleryImages: ["whiteRoundLight", "candleGroupTable"],
    overview:
      "Navgraha Shanti Puja pacifies the nine celestial bodies of Vedic astrology — Surya, Chandra, Mangal, Budh, Guru, Shukra, Shani, Rahu and Ketu — each believed to influence different life areas through your birth chart.",
    benefits: [
      "Recommended before a difficult planetary period (dasha)",
      "Often performed ahead of marriage or a major business decision",
      "Complements a Kundli reading when specific doshas are diagnosed",
    ],
    importance:
      "This isn't a puja for every minor setback — it's most meaningful when grounded in an actual birth chart reading, not a generic recommendation.",
    whoShouldPerform:
      "The individual whose chart shows the relevant planetary period, ideally after a consultation with an astrologer to confirm it's actually indicated.",
    samagri: ["Nine-grain mix (navadhanya)", "Nine-coloured cloth for each planet", "Ghee, cotton wicks and diya", "Havan samagri specific to afflicted planets"],
    vidhiSteps: [
      { title: "Kundli Review", description: "Confirming which planetary placements need pacification." },
      { title: "Navagraha Sthapana", description: "Installing representations of all nine planets for worship." },
      { title: "Individual Graha Puja", description: "Targeted mantras and offerings for the specific afflicted planet(s)." },
      { title: "Havan", description: "A closing fire ceremony sealing the remedial offerings." },
    ],
    packages: [
      { name: "Essential", price: 3100, duration: "2.5 hrs", features: ["Pandit + full samagri", "All nine planets worshipped", "Havan included"] },
    ],
    faq: [
      { question: "How long does Navgraha Shanti take?", answer: "Typically 2–3 hours depending on how many planets require specific remedial offerings." },
      ...defaultFaqExtra,
    ],
    relatedBlogSlugs: ["navgraha-shanti-when-you-need-it", "kaal-sarp-dosh-myths-and-facts"],
    relatedProductSlugs: ["sri-yantra-copper"],
  },
  {
    slug: "lakshmi-puja",
    name: "Lakshmi Puja",
    category: "Wealth & Prosperity",
    duration: "1–2 hrs",
    location: "Home Visit",
    price: 1800,
    marketPrice: 2400,
    image: "bowlWoodenTable",
    galleryImages: ["bowlWoodenTable", "candleGroupTable"],
    overview:
      "Lakshmi Puja invokes Goddess Lakshmi, the deity of wealth and prosperity. It's performed on Fridays, during Diwali, or whenever a family wants to invite abundance into a home or new venture.",
    benefits: [
      "Traditionally performed when starting a new business or financial year",
      "A central ritual during Diwali across most Hindu households",
      "Believed to remove obstacles to financial stability",
    ],
    importance:
      "During Diwali specifically, Lakshmi Puja is performed during Pradosh Kaal — the two hours following sunset — considered the most auspicious window of the year for this puja.",
    whoShouldPerform: "Any household member, though it's traditionally led by the woman of the house alongside the family priest.",
    samagri: ["Lakshmi and Ganesh idols/images", "Lotus flowers and marigold", "Coins, rice and kumkum", "Ghee diyas and cotton wicks"],
    vidhiSteps: [
      { title: "Ganesh Puja", description: "Invoked first, as with most household poojas." },
      { title: "Lakshmi Avahan", description: "Formal invocation of Goddess Lakshmi into the home." },
      { title: "Aarti & Prasad", description: "Closing aarti with prasad distributed to the household." },
    ],
    packages: [
      { name: "Essential", price: 1800, duration: "1.5 hrs", features: ["Pandit + full samagri", "Lakshmi & Ganesh Puja", "Aarti included"] },
    ],
    faq: [...defaultFaqExtra],
    relatedBlogSlugs: ["diwali-2026-lakshmi-puja-muhurat"],
    relatedProductSlugs: ["puja-thali-set"],
  },
  {
    slug: "ganesh-puja",
    name: "Ganesh Puja",
    category: "Ganpati Poojas",
    duration: "1–2 hrs",
    location: "Home Visit",
    price: 1500,
    marketPrice: 2000,
    image: "ganeshIdol",
    galleryImages: ["ganeshIdol", "threeCandlesBowl"],
    tag: "Most Booked",
    overview:
      "Ganesh Puja invokes Lord Ganesh, the remover of obstacles, and is traditionally performed before any new beginning — a new home, business, vehicle, or another puja itself.",
    benefits: [
      "Clears obstacles before starting something new",
      "A short, accessible ritual suitable for any occasion",
      "Often the opening ritual within a larger ceremony",
    ],
    importance:
      "Nearly every Hindu ritual opens with an invocation to Ganesh — this standalone version is for occasions where a full Ganesh Chaturthi-style sthapana isn't needed.",
    whoShouldPerform: "Anyone marking a new beginning — no specific eligibility required.",
    samagri: ["Ganesh idol or image", "Modak or ladoo for prasad", "Durva grass and red flowers", "Ghee diya and incense"],
    vidhiSteps: [
      { title: "Sankalpa", description: "Stating the intention behind the puja." },
      { title: "Ganesh Avahan", description: "Invocation and worship of Lord Ganesh." },
      { title: "Aarti & Prasad", description: "Closing aarti with modak prasad." },
    ],
    packages: [{ name: "Essential", price: 1500, duration: "1.5 hrs", features: ["Pandit + full samagri", "Ganesh Avahan & Aarti", "Modak prasad included"] }],
    faq: [...defaultFaqExtra],
    relatedBlogSlugs: [],
    relatedProductSlugs: ["brass-ganesh-murti"],
  },
  {
    slug: "marriage-puja",
    name: "Vivah (Marriage) Puja",
    category: "Marriage & Life Events",
    duration: "Full Day",
    location: "Venue of Choice",
    price: 15000,
    marketPrice: 19000,
    image: "handHoldingCandle",
    galleryImages: ["handHoldingCandle", "candleBrownHolder"],
    overview:
      "A traditional Vedic wedding ceremony, conducted per the specific rituals of the families' region and tradition — from the initial Ganesh Puja through Kanyadaan, Saptapadi and Sindoor Daan.",
    benefits: [
      "A fully guided, correctly-sequenced ceremony for one of life's most important rituals",
      "The pandit coordinates directly with your families ahead of the date",
      "Available across common regional traditions found in Delhi NCR",
    ],
    importance:
      "Muhurat (the exact auspicious time) matters more for this ceremony than almost any other — we strongly recommend booking a consultation to confirm timing well before the wedding date.",
    whoShouldPerform: "The couple, with both families present for the relevant rituals.",
    samagri: ["Complete havan and mandap samagri", "Mangalsutra and sindoor (if not separately arranged)", "Rice, turmeric and kumkum for all rituals", "Seven-step Saptapadi materials"],
    vidhiSteps: [
      { title: "Ganesh Puja & Mandap Muhurat", description: "Opens the ceremony and consecrates the wedding mandap." },
      { title: "Kanyadaan", description: "The formal giving away of the bride by her family." },
      { title: "Saptapadi", description: "Seven steps taken together, each with a specific vow." },
      { title: "Sindoor Daan & Mangalsutra", description: "The concluding rituals marking the couple as married." },
    ],
    packages: [
      { name: "Ceremony Only", price: 15000, duration: "Full Day", features: ["Pandit + full samagri", "Complete Vedic ceremony", "Coordination call before the date"] },
      { name: "Ceremony + Pre-Wedding Poojas", price: 22000, duration: "2 Days", features: ["Everything in Ceremony Only", "Haldi & Mehendi puja", "Griha Pravesh for the new couple (optional)"] },
    ],
    faq: [
      { question: "Can the pandit travel outside Delhi NCR for a destination wedding?", answer: "In some cases yes — contact support with your venue location and we'll confirm availability and travel charges." },
      ...defaultFaqExtra,
    ],
    relatedBlogSlugs: [],
    relatedProductSlugs: [],
  },
  {
    slug: "vehicle-puja",
    name: "Vehicle Puja",
    category: "Vehicle & Business",
    duration: "30–45 min",
    location: "Home / Showroom",
    price: 800,
    marketPrice: 1100,
    image: "tealightCandle",
    galleryImages: ["tealightCandle"],
    overview:
      "A short blessing ceremony for a new (or newly purchased used) vehicle, invoking safety and good fortune for its journeys ahead.",
    benefits: ["Quick, focused ritual specifically for vehicle safety", "Can be performed at home or at the showroom on delivery day", "Suitable for cars, two-wheelers and commercial vehicles"],
    importance: "A small but widely observed ritual — most families perform this before a new vehicle's first drive.",
    whoShouldPerform: "The vehicle's owner, ideally present for the puja and the first drive afterward.",
    samagri: ["Coconut, lemon and flowers", "Kumkum and rice for the tilak", "Ghee diya and incense"],
    vidhiSteps: [
      { title: "Vehicle Tilak", description: "A kumkum tilak applied to the vehicle." },
      { title: "Aarti", description: "A short aarti performed around the vehicle." },
      { title: "Lemon Ritual", description: "A lemon placed under the front wheel, traditionally driven over for the first start." },
    ],
    packages: [{ name: "Essential", price: 800, duration: "30 min", features: ["Pandit + full samagri", "Tilak & Aarti", "Suitable for showroom delivery"] }],
    faq: [...defaultFaqExtra],
    relatedBlogSlugs: [],
    relatedProductSlugs: [],
  },
  {
    slug: "office-puja",
    name: "Office / Shop Opening Puja",
    category: "Vehicle & Business",
    duration: "1–2 hrs",
    location: "Business Premises",
    price: 2200,
    marketPrice: 2900,
    image: "scentedCandle",
    galleryImages: ["scentedCandle", "candleGroup2"],
    overview:
      "A puja performed before opening a new office, shop or commercial space — combining Ganesh Puja, Vastu Shanti and Lakshmi Puja to bless the venture from day one.",
    benefits: ["Sets an auspicious tone for a new business venture", "Combines obstacle removal, Vastu balance and prosperity invocation in one visit", "Suitable for offices, retail shops and warehouses"],
    importance: "Commonly performed on the day of possession or the first official day of business, ideally at a muhurat confirmed in advance.",
    whoShouldPerform: "The business owner or a senior partner, with staff welcome to attend.",
    samagri: ["Ganesh and Lakshmi idols/images", "Kalash and coconut", "Rice, turmeric and kumkum", "Ghee diya and havan samagri"],
    vidhiSteps: [
      { title: "Ganesh Puja", description: "Removes obstacles before the venture begins." },
      { title: "Vastu Shanti", description: "Balances the energy of the commercial space." },
      { title: "Lakshmi Puja", description: "Invokes prosperity for the new business." },
    ],
    packages: [{ name: "Essential", price: 2200, duration: "1.5 hrs", features: ["Pandit + full samagri", "Ganesh, Vastu & Lakshmi Puja", "Suitable for shops & offices"] }],
    faq: [...defaultFaqExtra],
    relatedBlogSlugs: [],
    relatedProductSlugs: [],
  },
];

export function getPoojaBySlug(slug: string) {
  return poojas.find((p) => p.slug === slug);
}

/** { label, value } pairs for booking pickers — value is the real slug, so a
 * submitted booking can navigate straight to that pooja's detail page. */
export const poojaOptions = poojas.map((p) => ({ label: p.name, value: p.slug }));
