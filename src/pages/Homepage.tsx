import HeroSection from "@/components/modules/homepage/HeroSection";
import HowItWorks from "@/components/modules/homepage/HowItWorks";
import PublicStats from "@/components/modules/homepage/PublicStats";
import ServiceHighlights from "@/components/modules/homepage/ServiceHighlights";
import Testimonials from "@/components/modules/homepage/Testimonials";
import AppPromo from "@/components/modules/homepage/AppPromo";

export default function Homepage() {
  return (
    <div>
      <HeroSection />
      <PublicStats />
      <ServiceHighlights />
      <HowItWorks />
      <Testimonials />
      <AppPromo />
      {/* Scroll Indicator
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
