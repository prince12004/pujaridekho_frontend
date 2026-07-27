export const siteConfig = {
  name: "PujariDekho",
  tagline: "Verified & Trusted",
  taglineHi: "पूजा हो तो,",
  description:
    "PujariDekho is a premium Hindu religious services marketplace — verified pandits, complete puja samagri, fixed pricing and same-day booking.",
  contact: {
    phone: "+91 9211241314",
    whatsapp: "+91 9211241314",
    serviceArea: "Delhi NCR",
    email: "support@pujaridekho.com",
    partnerEmail: "partners@pujaridekho.com",
    careersEmail: "careers@pujaridekho.com",
    officeAddress: "7th Floor Gaur City Center Greater Noida Uttar Pradesh 201318 ",
    officeHours: "Mon–Sun, 7:00 AM – 10:00 PM IST",
  },
} as const;

export const mainNav = [
  { label: "Poojas", href: "/poojas" },
  { label: "Pandit Ji", href: "/pandits" },
  { label: "Festival Pooja", href: "/festivals" },
  { label: "Consultation", href: "/consultation" },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
