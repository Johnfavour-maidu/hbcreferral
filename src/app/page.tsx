import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { HeroSection } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features";
import { StatsSection } from "@/components/landing/stats";
import { FAQSection } from "@/components/landing/faq";
import { CTASection } from "@/components/landing/cta";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
