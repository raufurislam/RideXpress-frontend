import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Smartphone, Users, Map, Car } from "lucide-react";

import Img from "../../../assets/images/mobile-app-location-digital-art.jpg";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { role as ROLE } from "@/constants/role";
import { adminSidebarItems } from "@/routes/AdminSidebarItems";

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
];

const span = (s: string) =>
  s === "lg"
    ? "md:col-span-4 md:row-span-2"
    : s === "md"
    ? "md:col-span-2"
    : "md:col-span-1";

export default function HowItWorks() {
  const { data } = useUserInfoQuery(undefined);
  const user = data?.data;
  const userRole = user?.role;

  const getAdminPrimaryItem = () => {
    const dashboard = adminSidebarItems?.[0];
    const firstItem = dashboard?.items?.[0];
    return firstItem || null;
  };

  const renderCTA = () => {
    if (!user?.email) {
      return (
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <a href="/rider/request-ride">Request a ride</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/login">Sign in</a>
          </Button>
        </div>
      );
    }

    if (userRole === ROLE.rider) {
      return (
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <a href="/rider/request-ride">Request a ride</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/rider">Rider dashboard</a>
          </Button>
        </div>
      );
    }

    if (userRole === ROLE.driver) {
      return (
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <a href="/driver/get-ride">Get rides</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/driver">Driver dashboard</a>
          </Button>
        </div>
      );
    }

    if (userRole === ROLE.admin || userRole === ROLE.superAdmin) {
      const primary = getAdminPrimaryItem();
      return (
        <div className="mt-4 flex flex-wrap gap-3">
          {primary ? (
            <Button asChild variant="secondary">
              <a href={primary.url}>{primary.title}</a>
            </Button>
          ) : null}
          <Button asChild variant="outline">
            <a href="/admin/analytics">Admin dashboard</a>
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10 sm:mb-12 lg:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs sm:text-sm text-muted-foreground bg-background">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Simple, reliable, fast</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mt-3 mb-2">
            How it works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
            From booking to arrival, every step is simple and reliable.
          </p>
        </div>

        <div className="grid md:grid-cols-6 auto-rows-[220px] gap-4 sm:gap-6">
          {/* Hero tile */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="md:col-span-3 md:row-span-2 relative rounded-2xl overflow-hidden shadow-sm border"
          >
            <img
              src={Img}
              alt="Requesting a ride"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/55 flex flex-col justify-center items-center text-center p-6">
              <h3 className="text-2xl font-bold text-white">
                Book a ride in seconds
              </h3>
              <p className="text-white/85 mt-2 max-w-sm">
                Set your pickup, confirm the fare, and you’re ready to go.
              </p>
              {renderCTA()}
            </div>
          </motion.div>

          {steps.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`${span(
                s.size
              )} bg-card rounded-2xl border p-5 sm:p-6 flex flex-col`}
            >
              <s.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 text-base sm:text-lg font-semibold">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1.5">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
