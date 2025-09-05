import { Button } from "@/components/ui/button";
import mobileImg from "@/assets/images/mobile-app-location-digital-art.jpg";

export default function AppPromo() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-sm font-semibold text-primary mb-2">
            RideExpress App
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Book faster with our mobile app
          </h2>
          <p className="mt-3 text-muted-foreground">
            Plan trips, track drivers in real-time, and manage payments
            securely. Built for speed, safety, and reliability—anytime,
            anywhere.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" className="rounded-full">
              Get the App
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              Learn More
            </Button>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <li className="text-muted-foreground">• One-tap booking</li>
            <li className="text-muted-foreground">• Live location tracking</li>
            <li className="text-muted-foreground">• Secure digital payments</li>
            <li className="text-muted-foreground">• 24/7 support</li>
          </ul>
        </div>
        <div className="relative">
          <img
            src={mobileImg}
            alt="Ride booking mobile app preview"
            className="rounded-xl shadow-2xl w-full object-cover"
          />
          <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg">
            4.9★ Rated
          </div>
        </div>
      </div>
    </section>
  );
}
