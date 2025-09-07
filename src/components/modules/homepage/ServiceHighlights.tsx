import { motion } from "framer-motion";
import {
  ShieldCheck,
  Clock,
  Car,
  CreditCard,
  BellRing,
  Globe,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Safety First",
    desc: "Emergency SOS, trip sharing, and verified drivers keep every journey secure.",
    icon: ShieldCheck,
  },
  {
    title: "Always On Time",
    desc: "Smart ride matching ensures quick pickups and reliable ETAs.",
    icon: Clock,
  },
  {
    title: "Vehicle Choice",
    desc: "From affordable bikes to comfortable cars — choose what fits your ride.",
    icon: Car,
  },
  {
    title: "Flexible Payments",
    desc: "Cash, card, or wallet — pay the way you like, with transparent receipts.",
    icon: CreditCard,
  },
  {
    title: "Smart Notifications",
    desc: "Stay updated with driver arrival alerts, ride status, and ETAs.",
    icon: BellRing,
  },
  {
    title: "Expanding Coverage",
    desc: "We’re reaching more areas every month, with better pickup accuracy.",
    icon: Globe,
  },
];

export default function ServiceHighlights() {
  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs sm:text-sm text-muted-foreground bg-background">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Why RideExpress</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mt-3 mb-2">
            Service Highlights
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
            What makes RideExpress the smarter way to move around the city.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true, margin: "-20%" }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <f.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-semibold">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
