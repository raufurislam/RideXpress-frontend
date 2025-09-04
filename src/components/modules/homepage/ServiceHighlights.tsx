import { motion } from "framer-motion";
import {
  ShieldCheck,
  Clock,
  Car,
  CreditCard,
  BellRing,
  Globe,
} from "lucide-react";

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
    <section className="relative py-24 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0" />

      <div className="container relative z-10 mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Service Highlights
          </h2>
          <p className="text-muted-foreground text-lg">
            What makes <span className="text-primary">RideExpress</span> the
            smarter way to move around the city.
          </p>
        </div>

        {/* Flow layout */}
        <div className="space-y-12">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-start gap-6 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <f.icon className="h-7 w-7 text-primary" />
              </div>

              {/* Text */}
              <div className="max-w-xl">
                <h3 className="text-2xl font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-base">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
