import { HomepageBannerStrip } from "@/features/home/components/homepage-banner-strip";
import { HeroSection } from "@/features/home/components/hero-section";
import { TrustNumbers } from "@/features/home/components/trust-numbers";
import { FeaturedPoojas } from "@/features/home/components/featured-poojas";
import { FestivalPoojasSection } from "@/features/home/components/festival-poojas";
import { ShopCategories } from "@/features/home/components/shop-categories";
import { CitiesSection } from "@/features/home/components/cities-section";
import { TopPandits } from "@/features/home/components/top-pandits";
import { HowItWorks } from "@/features/home/components/how-it-works";
import { WhyChooseUs } from "@/features/home/components/why-choose-us";
import { KundliCta } from "@/features/home/components/kundli-cta";
import { PanchangSection } from "@/features/home/components/panchang-section";
import { ReligiousProducts } from "@/features/home/components/religious-products";
import { TestimonialsSection } from "@/features/home/components/testimonials-section";
import { BlogSection } from "@/features/home/components/blog-section";
import { FaqSection } from "@/features/home/components/faq-section";

export default function Home() {
  return (
    <>
      <HomepageBannerStrip />
      <HeroSection />
      <TrustNumbers />
      <FeaturedPoojas />
      <FestivalPoojasSection />
      <ShopCategories />
      <CitiesSection />
      <TopPandits />
      <HowItWorks />
      <WhyChooseUs />
      <KundliCta />
      <PanchangSection />
      <ReligiousProducts />
      <TestimonialsSection />
      <BlogSection />
      <FaqSection />
    </>
  );
}
