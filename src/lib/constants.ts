export const siteConfig = {
  name: "PujariDekho",
  tagline: "Verified & Trusted",
  taglineHi: "पूजा हो तो,",
  description:
    "PujariDekho is a premium Hindu religious services marketplace — verified pandits, complete puja samagri, fixed pricing and same-day booking.",
  contact: {
    phone: "+91 9211241314",
    whatsapp: "+91 9211241314",
  serviceAreas: [
  "Noida",
  "Greater Noida",
  "Gaziabad",
  "Gurgaon",
    "Delhi NCR",
],
    email: "support@pujaridekho.com",
    partnerEmail: "partners@pujaridekho.com",
    careersEmail: "careers@pujaridekho.com",
    officeAddress: "7th Floor Gaur City Center Greater Noida Uttar Pradesh 201318 ",
    officeHours: "Mon–Sun, 7:00 AM – 10:00 PM IST",
  },
} as const;

// Mirrors FREE_DELIVERY_THRESHOLD/DELIVERY_CHARGE in apps/api orders.service.ts —
// the backend is authoritative for the actual charge; these are only for
// showing the same numbers before an order is created.
export const FREE_DELIVERY_THRESHOLD = 299;
export const DELIVERY_CHARGE = 49;

export const mainNav = [
  { label: "Poojas", href: "/poojas" },
  { label: "Pandit Ji", href: "/pandits" },
  { label: "Festival Pooja", href: "/festivals" },
  { label: "Consultation", href: "/consultation" },
  { label: "Shop", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
