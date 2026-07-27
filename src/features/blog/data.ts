import type { BlogPost } from "./types";

const grihaPraveshContent = `
<h2 id="overview">Overview</h2>
<p>Griha Pravesh — literally "entering the house" — is the Vedic ceremony performed before a family moves into a new home. It's not just a ritual formality: it's meant to invoke Vastu Purusha (the presiding deity of the dwelling), neutralise any residual negative energy from construction, and set an auspicious tone for the years the family will spend there.</p>
<p>There are three recognised types depending on the situation: <strong>Apoorva</strong> (moving into a newly built home for the first time), <strong>Sapoorva</strong> (moving back in after a long absence), and <strong>Dwandwah</strong> (moving into a previously-owned home). Each has small variations in vidhi, which your pandit will confirm at booking.</p>

<h2 id="auspicious-dates">Auspicious Dates in 2026</h2>
<p>Griha Pravesh should avoid the Shunya Maas (inauspicious transition months) and is traditionally not performed during Chaturmas (roughly July to November) or on a Tuesday, Saturday or during Rahu Kaal. Based on the Panchang, some of the widely considered auspicious windows in 2026 include:</p>
<ul>
  <li><strong>Late January – early February 2026</strong> — post-Makar Sankranti, a traditional window for new beginnings.</li>
  <li><strong>April 2026</strong> — around Akshaya Tritiya, considered auspicious for nearly all new ventures.</li>
  <li><strong>Mid-November – December 2026</strong> — after Chaturmas ends and before the next Shunya Maas.</li>
</ul>
<p>We'd still recommend confirming the exact date and time (muhurat) with your pandit against your family's specific birth details — a generic calendar date is a starting point, not a substitute for a personalised muhurat.</p>

<h2 id="items-required">Items Required (Samagri)</h2>
<p>When you book Griha Pravesh Puja through PujariDekho, the following are included as part of the fixed price:</p>
<ul>
  <li>Kalash, coconut, mango leaves and a copper vessel</li>
  <li>Raw rice, turmeric, kumkum, and akshat</li>
  <li>Ghee, cotton wicks and a brass diya</li>
  <li>Fresh milk (for the traditional boiling-over ritual at the threshold)</li>
  <li>Havan samagri, dry fruits and a small quantity of navratna (nine gems) or their substitutes</li>
  <li>A Ganesh idol or image for sthapana</li>
</ul>
<p>You do not need to arrange anything separately — the pandit brings everything listed above, so the only preparation on your end is making sure the house is cleaned and the main door is decorated with a torans or rangoli before the pandit arrives.</p>

<h2 id="step-by-step-vidhi">Step-by-Step Vidhi</h2>
<ol>
  <li><strong>Ganesh Puja</strong> — performed first, to remove obstacles before the main ceremony begins.</li>
  <li><strong>Vastu Shanti Puja</strong> — invokes and pacifies Vastu Purusha, typically performed at the centre of the home (Brahmasthan).</li>
  <li><strong>Navagraha Puja</strong> — the nine planetary deities are worshipped to ensure planetary harmony for the household.</li>
  <li><strong>Milk-Boiling Ritual</strong> — fresh milk is boiled over on the stove as the family enters, symbolising abundance.</li>
  <li><strong>Threshold Entry</strong> — the woman of the house typically enters first, right foot forward, carrying a kalash.</li>
  <li><strong>Havan</strong> — a small fire ceremony closes the puja, with offerings for prosperity and protection.</li>
</ol>
<p>The full ceremony typically runs 3–4 hours depending on family size and whether a havan is included.</p>

<h2 id="common-mistakes">Common Mistakes to Avoid</h2>
<p>A few things families frequently get wrong when planning their own Griha Pravesh:</p>
<ul>
  <li>Booking a pandit without confirming which samagri is included — leading to last-minute market runs.</li>
  <li>Choosing a date from a generic online calendar without cross-checking Rahu Kaal for that specific day.</li>
  <li>Skipping Vastu Shanti when the house was previously owned — it's still recommended even for a Dwandwah Griha Pravesh.</li>
  <li>Not cleaning and airing the house at least a day in advance, which the pandit will ask about before beginning.</li>
</ul>
<blockquote>"The ceremony matters less for the objects involved and more for the intention the family brings into a new home — that's the part no samagri kit can substitute." — Pandit Ramesh Sharma Ji</blockquote>
`;

const navgrahaContent = `
<h2 id="what-is-navgraha">What Is Navgraha Shanti?</h2>
<p>Navgraha Shanti Puja pacifies the nine celestial bodies recognised in Vedic astrology — Surya, Chandra, Mangal, Budh, Guru, Shukra, Shani, Rahu and Ketu — each believed to influence different areas of life through their positions in your birth chart.</p>
<h2 id="when-you-need-it">When Do You Actually Need It?</h2>
<p>You don't need this puja for every minor setback. It's traditionally recommended when a birth chart (Kundli) shows a difficult planetary period (dasha) approaching, before major life events like marriage or a new business, or when a Kaal Sarp or Pitra Dosh has been diagnosed alongside challenging planetary placements.</p>
<h2 id="how-to-know">How to Know If It Applies to You</h2>
<p>The most reliable way is a proper Kundli reading — not a generic online quiz. PujariDekho's free Kundli tool can generate your birth chart, and our astrologers can review it with you on a live consultation before you commit to a Navgraha Shanti booking.</p>
`;

const sawanContent = `
<h2 id="why-sawan-matters">Why Sawan Somwar Matters</h2>
<p>Sawan (Shravan) is considered Lord Shiva's most beloved month, and Mondays (Somwar) within it are held especially auspicious for Shiv Puja and fasting.</p>
<h2 id="fasting-rules">Fasting Rules</h2>
<p>Most observers follow a Nirjala (no water) or Phalahari (fruits-only) fast depending on personal capacity, breaking it only after evening Shiv Puja. Grains, salt and non-satvik food are typically avoided for the day.</p>
<h2 id="puja-vidhi">Puja Vidhi</h2>
<p>A simple Sawan Somwar puja involves Jal Abhishek (pouring water, milk or Gangajal over the Shiva Lingam), offering Bel Patra, and chanting the Mahamrityunjaya Mantra or Om Namah Shivaya 108 times using a Rudraksha mala.</p>
`;

export const blogPosts: BlogPost[] = [
  {
    slug: "griha-pravesh-2026-vidhi-guide",
    title: "Griha Pravesh 2026: Auspicious Dates & Complete Vidhi",
    excerpt: "Everything you need to know before entering your new home — dates, samagri, and the full step-by-step vidhi.",
    category: "Guides",
    readTime: "6 min read",
    image: "candlesCircleFloor",
    publishDate: "2026-06-02",
    author: { name: "Pandit Ramesh Sharma Ji", role: "Vedic Ritual Consultant" },
    featured: true,
    popular: true,
    contentHtml: grihaPraveshContent,
    faq: [
      { question: "Can Griha Pravesh be performed at night?", answer: "It's traditionally performed in the morning or early afternoon, aligned with an auspicious muhurat — night ceremonies are uncommon but not forbidden if the muhurat specifically calls for it." },
      { question: "Do I need to be physically present for the whole ceremony?", answer: "The head of household and at least one other family member should be present throughout, particularly for the threshold entry and havan." },
      { question: "Is Griha Pravesh needed for a rented home?", answer: "It's optional but commonly done, especially for long-term rentals — the same vidhi applies." },
    ],
    relatedPoojaSlugs: ["griha-pravesh", "vastu-shanti", "navgraha-shanti"],
    relatedProductSlugs: ["puja-thali-set", "havan-kund-samagri"],
  },
  {
    slug: "navgraha-shanti-when-you-need-it",
    title: "Navgraha Shanti: When Do You Actually Need It?",
    excerpt: "A clear-eyed look at when this puja is genuinely recommended — and when it's not necessary.",
    category: "Astrology",
    readTime: "5 min read",
    image: "whiteRoundLight",
    publishDate: "2026-05-18",
    author: { name: "Acharya Devraj Joshi", role: "Vedic Astrologer" },
    popular: true,
    contentHtml: navgrahaContent,
    faq: [
      { question: "How long does Navgraha Shanti take?", answer: "Typically 2–3 hours depending on how many planets require specific remedial offerings." },
      { question: "Can it be combined with another puja?", answer: "Yes, it's often combined with Griha Pravesh or performed before a wedding ceremony." },
    ],
    relatedPoojaSlugs: ["navgraha-shanti"],
    relatedProductSlugs: ["sri-yantra-copper"],
  },
  {
    slug: "sawan-somwar-2026-fasting-rules",
    title: "Sawan Somwar 2026: Fasting Rules & Puja Vidhi Explained",
    excerpt: "Fasting rules, puja vidhi, and the significance of Shiva's most sacred month.",
    category: "Festivals",
    readTime: "4 min read",
    image: "candleDarkTable",
    publishDate: "2026-07-06",
    author: { name: "Pandit Vinod Mishra Ji", role: "Shiv Puja Specialist" },
    contentHtml: sawanContent,
    faq: [
      { question: "Can pregnant women or the elderly observe a modified fast?", answer: "Yes — a Phalahari (fruit-only) fast or even a single-meal fast is an accepted modification; the intention matters more than strict austerity." },
    ],
    relatedPoojaSlugs: ["mahashivratri"],
    relatedProductSlugs: ["panchmukhi-rudraksha-mala"],
  },
  {
    slug: "satyanarayan-puja-vidhi-and-benefits",
    title: "Satyanarayan Puja: Complete Vidhi and Benefits",
    excerpt: "Why this is the most frequently booked puja on PujariDekho, and how the ceremony actually unfolds.",
    category: "Guides",
    readTime: "5 min read",
    image: "roundBowlCandle",
    publishDate: "2026-04-22",
    author: { name: "Pandit Suresh Trivedi Ji", role: "Vedic Ritual Consultant" },
    popular: true,
    contentHtml: `<h2 id="overview">Overview</h2><p>Satyanarayan Puja honours Lord Vishnu in his form as Satyanarayan — "the one who is the embodiment of truth." It's typically performed on full moon days (Purnima) or to mark a happy occasion.</p><h2 id="benefits">Benefits</h2><p>Families commonly perform this puja after resolving a difficulty, before starting something new, or simply as a periodic act of gratitude.</p>`,
    faq: [],
    relatedPoojaSlugs: ["satyanarayan-puja"],
    relatedProductSlugs: [],
  },
  {
    slug: "kaal-sarp-dosh-myths-and-facts",
    title: "Kaal Sarp Dosh: Myths and Facts",
    excerpt: "Separating what's astrologically meaningful from what's exaggerated for fear-based sales.",
    category: "Astrology",
    readTime: "7 min read",
    image: "candleGroup2",
    publishDate: "2026-03-14",
    author: { name: "Acharya Devraj Joshi", role: "Vedic Astrologer" },
    contentHtml: `<h2 id="what-it-is">What It Actually Is</h2><p>Kaal Sarp Dosh occurs when all seven visible planets fall between Rahu and Ketu in a birth chart. It is one of several chart configurations, not an automatic curse.</p><h2 id="myths">Common Myths</h2><p>Not every difficulty in life should be attributed to this dosha — a proper reading looks at the whole chart, not one isolated configuration.</p>`,
    faq: [],
    relatedPoojaSlugs: ["navgraha-shanti"],
    relatedProductSlugs: [],
  },
  {
    slug: "rudraksha-guide-mukhi-and-meaning",
    title: "Rudraksha Guide: Mukhi Types and What They Mean",
    excerpt: "A practical guide to choosing a Rudraksha mala that actually matches your intention.",
    category: "Products",
    readTime: "6 min read",
    image: "candleBrownHolder",
    publishDate: "2026-02-27",
    author: { name: "Kavita Desai", role: "Head of Customer Experience" },
    contentHtml: `<h2 id="what-is-mukhi">What Does "Mukhi" Mean?</h2><p>Mukhi refers to the natural lines or facets on a Rudraksha seed — most commonly 1 to 21 lines, each associated with a different intention.</p><h2 id="choosing-one">Choosing the Right One</h2><p>5-Mukhi is the most common and considered suitable for general wellbeing; specific mukhis are chosen based on individual astrological guidance.</p>`,
    faq: [],
    relatedPoojaSlugs: [],
    relatedProductSlugs: ["panchmukhi-rudraksha-mala"],
  },
  {
    slug: "mundan-ceremony-right-age-and-vidhi",
    title: "Mundan Ceremony: Right Age and Vidhi",
    excerpt: "When families traditionally perform a child's first haircut, and what the ceremony involves.",
    category: "Guides",
    readTime: "4 min read",
    image: "handHoldingCandle",
    publishDate: "2026-01-30",
    author: { name: "Pandit Devendra Pathak Ji", role: "Vedic Ritual Consultant" },
    contentHtml: `<h2 id="right-age">The Right Age</h2><p>Mundan is traditionally performed between a child's first and third year, on an odd-numbered birthday, though family tradition varies.</p><h2 id="the-ceremony">The Ceremony</h2><p>A short puja precedes the haircut itself, typically performed by a family elder or the presiding pandit.</p>`,
    faq: [],
    relatedPoojaSlugs: [],
    relatedProductSlugs: [],
  },
  {
    slug: "vastu-tips-for-main-entrance",
    title: "5 Vastu Tips for Your Main Entrance",
    excerpt: "Simple, non-disruptive adjustments that align with traditional Vastu principles.",
    category: "Guides",
    readTime: "3 min read",
    image: "scentedCandle",
    publishDate: "2025-12-19",
    author: { name: "Pandit Anil Shastri Ji", role: "Vastu Consultant" },
    contentHtml: `<h2 id="tip-1">Keep It Well-Lit</h2><p>The main entrance is considered the entry point for energy into the home — good lighting is a simple, universally-agreed Vastu principle.</p><h2 id="tip-2">Avoid Direct Obstruction</h2><p>Avoid placing heavy furniture or a staircase directly opposite the main door.</p>`,
    faq: [],
    relatedPoojaSlugs: ["vastu-shanti"],
    relatedProductSlugs: [],
  },
  {
    slug: "diwali-2026-lakshmi-puja-muhurat",
    title: "Diwali 2026: Lakshmi Puja Muhurat and Vidhi",
    excerpt: "The most auspicious window for Lakshmi Puja this Diwali, and how to prepare your home.",
    category: "Festivals",
    readTime: "5 min read",
    image: "candleGroupTable",
    publishDate: "2026-10-05",
    author: { name: "Pandit Suresh Trivedi Ji", role: "Vedic Ritual Consultant" },
    contentHtml: `<h2 id="muhurat">The Muhurat</h2><p>Lakshmi Puja is performed during Pradosh Kaal on Diwali night, typically in the two hours following sunset.</p><h2 id="preparation">Preparing Your Home</h2><p>Clean the home thoroughly, light diyas at every entrance, and keep the main door slightly open during the puja to symbolically welcome Goddess Lakshmi.</p>`,
    faq: [],
    relatedPoojaSlugs: ["lakshmi-puja"],
    relatedProductSlugs: ["puja-thali-set"],
  },
];

export const blogCategories = ["All", "Guides", "Astrology", "Festivals", "Products"];

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAdjacentPosts(slug: string) {
  const index = blogPosts.findIndex((post) => post.slug === slug);
  return {
    prev: index > 0 ? blogPosts[index - 1] : undefined,
    next: index < blogPosts.length - 1 ? blogPosts[index + 1] : undefined,
  };
}
