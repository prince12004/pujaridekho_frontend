export const lastUpdated = "1 July 2026";

export const privacyContent = `
<h2 id="information-we-collect">Information We Collect</h2>
<p>When you use PujariDekho, we collect information you provide directly — your name, mobile number, email address, delivery address, and details of the puja or product you book. We also collect booking history, payment confirmation records (not full card details, which are handled by our payment processor), and basic device/browser information for security and analytics.</p>

<h2 id="how-we-use-it">How We Use Your Information</h2>
<p>We use your information to confirm and fulfil bookings, assign verified pandits, process payments and refunds, send booking reminders and festival notifications you've opted into, and to improve our matching between families and pandits over time.</p>
<ul>
  <li>Booking confirmations and pandit assignment</li>
  <li>Order processing for shop purchases and delivery updates</li>
  <li>Customer support and dispute resolution</li>
  <li>Optional marketing communications, which you can opt out of at any time</li>
</ul>

<h2 id="sharing-your-information">Sharing Your Information</h2>
<p>We share only what's necessary for a booking to be fulfilled: your name, address and contact number are shared with the assigned pandit so they can reach your home; payment information is shared with our PCI-compliant payment processor (Razorpay); and delivery details are shared with our logistics partners for shop orders. We do not sell your personal information to third parties.</p>

<h2 id="data-security">Data Security</h2>
<p>All data in transit is encrypted via TLS, and sensitive fields are encrypted at rest. Access to customer data within our team is role-restricted and logged. Payment card details are never stored on our servers — they're tokenised directly by our payment processor.</p>

<h2 id="your-rights">Your Rights</h2>
<p>You can request a copy of the personal data we hold about you, ask us to correct inaccurate information, or request deletion of your account and associated data, subject to statutory retention requirements (e.g. for tax and dispute-resolution purposes). Write to us at support@pujaridekho.com to exercise any of these rights.</p>

<h2 id="cookies">Cookies</h2>
<p>We use essential cookies to keep you logged in and remember your city/language preference, and analytics cookies to understand how the platform is used so we can improve it. You can control cookie preferences through your browser settings.</p>

<h2 id="changes-to-this-policy">Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. Material changes will be notified via email or an in-app banner before they take effect.</p>
`;

export const privacyToc = [
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use-it", label: "How We Use Your Information" },
  { id: "sharing-your-information", label: "Sharing Your Information" },
  { id: "data-security", label: "Data Security" },
  { id: "your-rights", label: "Your Rights" },
  { id: "cookies", label: "Cookies" },
  { id: "changes-to-this-policy", label: "Changes to This Policy" },
];

export const termsContent = `
<h2 id="acceptance">Acceptance of Terms</h2>
<p>By accessing or booking through PujariDekho, you agree to these Terms & Conditions. If you don't agree with any part of these terms, please don't use the platform.</p>

<h2 id="bookings">Bookings & Services</h2>
<p>PujariDekho acts as a marketplace connecting families with independently verified pandits, and as a retailer for puja essentials. All puja pricing shown at the time of booking is final and includes the samagri explicitly listed on that booking's page. Booking confirmations are sent via SMS/WhatsApp and are also visible in your dashboard.</p>

<h2 id="cancellations">Cancellations & Rescheduling</h2>
<p>Bookings can be rescheduled or cancelled free of charge up to 24 hours before the scheduled time. Cancellations within 24 hours may be subject to a partial charge to compensate the assigned pandit, as detailed in our Refund Policy.</p>

<h2 id="user-conduct">User Conduct</h2>
<p>Users agree to provide accurate booking information, treat assigned pandits with respect, and not use the platform for any unlawful purpose. Abusive behaviour toward pandits or staff may result in account suspension.</p>

<h2 id="pandit-obligations">Pandit Obligations</h2>
<p>Pandits listed on PujariDekho agree to arrive at the confirmed time with the samagri specified for the booking, conduct the ritual per the standard vidhi for that puja, and maintain the conduct standards outlined in our Pandit Partner Agreement.</p>

<h2 id="limitation-of-liability">Limitation of Liability</h2>
<p>PujariDekho verifies pandits to a reasonable standard but does not guarantee specific spiritual or astrological outcomes from any ritual performed. Our liability for any booking is limited to the amount paid for that specific booking.</p>

<h2 id="governing-law">Governing Law</h2>
<p>These terms are governed by the laws of India, and any disputes are subject to the jurisdiction of the courts in New Delhi.</p>
`;

export const termsToc = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "bookings", label: "Bookings & Services" },
  { id: "cancellations", label: "Cancellations & Rescheduling" },
  { id: "user-conduct", label: "User Conduct" },
  { id: "pandit-obligations", label: "Pandit Obligations" },
  { id: "limitation-of-liability", label: "Limitation of Liability" },
  { id: "governing-law", label: "Governing Law" },
];

export const refundScenarios = [
  { title: "Full Refund", description: "Cancel 24+ hours before your scheduled puja time, or if we're unable to assign a verified pandit.", icon: "full" as const },
  { title: "Partial Refund", description: "Cancel within 24 hours of the scheduled time — a partial charge covers the pandit's reserved time.", icon: "partial" as const },
  { title: "No Refund", description: "No-shows without prior cancellation, or cancellations after the pandit has already arrived.", icon: "none" as const },
];

export const refundContent = `
<h2 id="how-refunds-work">How Refunds Work</h2>
<p>Refund eligibility for puja bookings depends on how far in advance you cancel, as summarised in the scenarios above. All approved refunds are issued to the original payment method — we do not offer cash refunds or store credit unless you specifically request it in place of a refund.</p>
<h2 id="processing-time">Processing Time</h2>
<p>Once approved, refunds are initiated within 24 hours. UPI and card refunds typically reflect within 5–7 business days; net banking refunds can take up to 10 business days depending on your bank.</p>
`;

export const refundToc = [
  { id: "refund-scenarios", label: "Refund Scenarios" },
  { id: "how-refunds-work", label: "How Refunds Work" },
  { id: "processing-time", label: "Processing Time" },
  { id: "refund-faq", label: "FAQ" },
];

export const shippingContent = `
<h2 id="shipping-information">Shipping Information</h2>
<p>Our shop delivers temple-grade puja essentials, murtis, rudraksha and havan samagri across our serviced Delhi NCR cities. Orders placed before 2 PM are typically packed the same day.</p>
`;

export const shippingToc = [
  { id: "shipping-process", label: "Shipping Process" },
  { id: "shipping-information", label: "Shipping Information" },
  { id: "delivery-zones", label: "Delivery Zones & Charges" },
  { id: "shipping-faq", label: "FAQ" },
];

export const refundFaq = [
  { question: "How long does a refund take to process?", answer: "Refunds are initiated within 24 hours of approval and typically reflect in your account within 5–7 business days, depending on your bank." },
  { question: "What if I'm unhappy with the puja itself, not the timing?", answer: "Contact support within 48 hours with details — we review service-quality complaints case by case and may offer a partial refund or a complimentary re-booking." },
  { question: "Are shop product returns handled the same way?", answer: "No — physical products follow our Shipping Policy return window (7 days for unopened, unused items), separate from puja booking refunds." },
];

export const shippingSteps = [
  { label: "Day 0", title: "Order Placed", description: "You'll receive an order confirmation via SMS and email immediately after checkout." },
  { label: "Day 0–1", title: "Packed", description: "Puja kits and products are quality-checked and carefully packed at our fulfilment centre." },
  { label: "Day 1–2", title: "Dispatched", description: "Your order is handed to our logistics partner and a tracking link is shared." },
  { label: "Day 2–4", title: "Out for Delivery", description: "Our delivery partner attempts delivery to your registered address." },
  { label: "Day 2–5", title: "Delivered", description: "Delivered across Delhi NCR within 2–5 business days depending on your pin code." },
];

export const shippingZones = [
  { zone: "Delhi, Noida, Gurgaon", time: "2–3 business days", charge: "Free above ₹999" },
  { zone: "Ghaziabad, Faridabad, Greater Noida", time: "3–4 business days", charge: "Free above ₹999" },
  { zone: "Rest of Delhi NCR", time: "4–5 business days", charge: "₹79 flat" },
];

export const shippingFaq = [
  { question: "Do you ship outside Delhi NCR?", answer: "Not yet — our shop currently delivers only within our serviced Delhi NCR cities, in line with our verified local fulfilment process for perishable puja items." },
  { question: "Can I track my order?", answer: "Yes, a tracking link is sent via SMS and email once your order is dispatched, and is also visible in your dashboard under Orders." },
  { question: "What if an item arrives damaged?", answer: "Contact support within 48 hours of delivery with photos of the damaged item — we'll arrange a free replacement or refund." },
];
