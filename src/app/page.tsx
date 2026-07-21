import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { HeroSection } from "@/components/landing/hero";
import { RewardsPreview } from "@/components/landing/rewards";
import { FAQSection } from "@/components/landing/faq";
import { SocialSection } from "@/components/landing/social";
import { CTASection } from "@/components/landing/cta";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <RewardsPreview />
        <FAQSection />
        <SocialSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
