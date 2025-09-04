import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Smartphone, Users, Map, Car } from "lucide-react";

import Img from "../../../assets/images/mobile-app-location-digital-art.jpg";

const steps = [
  {
    title: "Request a ride",
    desc: "Set pickup and destination in seconds with upfront pricing.",
    icon: Smartphone,
    size: "md",
  },
  {
    title: "Get matched instantly",
    desc: "We connect you with the nearest trusted driver.",
    icon: Users,
    size: "sm",
  },
  {
    title: "Track in real time",
    desc: "See your driver on the map, share status with friends.",
    icon: Map,
    size: "sm",
  },
  {
    title: "Ride comfortably",
    desc: "Safe vehicles, transparent routes, friendly drivers.",
    icon: Car,
    size: "md",
  },
  //   {
  //     title: "Pay & review",
  //     desc: "Cash or card, then rate your experience.",
  //     icon: CreditCard,
  //     size: "md",
  //   },
];

const span = (s: string) =>
  s === "lg"
    ? "md:col-span-4 md:row-span-2"
    : s === "md"
    ? "md:col-span-2"
    : "md:col-span-1";

export default function HowItWorks() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* background */}
      <div className="absolute inset-0" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            How it works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From booking to arrival, every step is simple and reliable.
          </p>
        </div>

        <div className="grid md:grid-cols-6 auto-rows-[220px] gap-6">
          {/* Hero tile */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="md:col-span-3 md:row-span-2 relative rounded-3xl overflow-hidden shadow-xl"
          >
            <img
              src={Img}
              alt="Requesting a ride"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col justify-center items-center text-center p-6">
              <h3 className="text-2xl font-bold text-white">
                Book a ride in seconds
              </h3>
              <p className="text-white/80 mt-2 max-w-sm">
                Set your pickup, confirm the fare, and you’re ready to go.
              </p>
              <Button className="mt-4" variant="secondary">
                Get started
              </Button>
            </div>
          </motion.div>

          {steps.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`${span(
                s.size
              )} bg-card rounded-2xl shadow-md p-6 flex flex-col`}
            >
              <s.icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
