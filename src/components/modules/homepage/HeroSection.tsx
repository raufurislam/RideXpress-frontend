import { Button } from "@/components/ui/button";
import mapLineImg from "@/assets/images/mapLineImg.png";

type Props = {
  /** If provided, uses this many pixels for margin-top */
  topOffsetPx?: number;
  /** If provided, uses this many vh (viewport height) for margin-top — takes precedence over px */
  topOffsetVh?: number;
};

export default function HeroSection({ topOffsetPx, topOffsetVh }: Props) {
  // If topOffsetVh provided use vh, else if px provided use px, else fall back to responsive tailwind mt classes
  const style = topOffsetVh
    ? { marginTop: `${topOffsetVh}vh` }
    : topOffsetPx
    ? { marginTop: `${topOffsetPx}px` }
    : undefined;

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* -------------------
          MOBILE VERSION (sm and below)
          ------------------- */}
      <div className="md:hidden relative flex flex-col items-center justify-center min-h-screen text-center px-6">
        {/* Background Image - Mobile optimized */}
        <img
          src={mapLineImg}
          alt="Map background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Gradient overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Decorative accent */}
          <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full mb-4" />

          <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
            Share the Ride
          </h1>

          <p className="text-base text-muted-foreground max-w-sm mb-8 leading-relaxed">
            Experience the future of urban mobility with our secure ride-sharing
            platform for companies and universities. Connect, travel, and save
            together.
          </p>

          <Button
            size="lg"
            className="bg-primary text-white px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform font-semibold"
          >
            Book Ride
          </Button>
        </div>
      </div>

      {/* -------------------
          TABLET & DESKTOP (md and above) - Your Original Design
          ------------------- */}
      <div className="hidden md:flex items-start justify-center min-h-screen text-center relative">
        {/* Background Image - Original positioning */}
        <img
          src={mapLineImg}
          alt="Map Line Background"
          className="absolute bottom-0 left-0 w-full h-auto object-cover pointer-events-none"
        />

        {/* Gradient overlay (keep behind content) */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none" />

        {/* Content: if no explicit style, we apply responsive mt classes */}
        <div
          style={style}
          className={`relative z-10 px-6 lg:px-8 ${
            style ? "" : "mt-24 lg:mt-32"
          }`}
        >
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
            Share the Ride
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Experience the future of urban mobility with our secure ride-sharing
            platform for companies and universities. Connect, travel, and save
            together.
          </p>

          <Button
            size="lg"
            className="bg-primary text-white px-8 py-3 rounded-full shadow-lg hover:scale-105 transition"
          >
            Book Ride
          </Button>
        </div>
      </div>
    </section>
  );
}
