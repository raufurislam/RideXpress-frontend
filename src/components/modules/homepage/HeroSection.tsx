import React from "react";
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
    <section className="relative flex items-start justify-center min-h-screen text-center bg-background overflow-hidden">
      {/* Background Image */}
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
        className={`relative z-10 px-4 sm:px-6 lg:px-8 ${
          style ? "" : "mt-16 sm:mt-24 lg:mt-32"
        }`}
      >
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
          Share the Ride
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Experience the future of urban mobility with our secure ride-sharing
          platform for companies and universities. Connect, travel, and save
          together.
        </p>

        <Button
          size="lg"
          className="bg-primary text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg hover:scale-105 transition"
        >
          Book Ride
        </Button>
      </div>
    </section>
  );
}
