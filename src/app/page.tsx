import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { HeroSection } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { RewardsPreview } from "@/components/landing/rewards";
import { FAQSection } from "@/components/landing/faq";
import { CTASection } from "@/components/landing/cta";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <RewardsPreview />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
