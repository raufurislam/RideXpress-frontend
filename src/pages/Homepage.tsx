import HeroSection from "@/components/modules/homepage/HeroSection";
import HowItWorks from "@/components/modules/homepage/HowItWorks";
import PublicStats from "@/components/modules/homepage/PublicStats";
import ServiceHighlights from "@/components/modules/homepage/ServiceHighlights";

export default function Homepage() {
  return (
    <div>
      <HeroSection />
      <PublicStats />
      <ServiceHighlights />
      <HowItWorks />
    </div>
  );
}
