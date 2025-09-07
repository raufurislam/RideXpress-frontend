import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Users, Car, MapPin, Award } from "lucide-react";
import { motion, animate } from "framer-motion";
import { useGetPublicStatsQuery } from "@/redux/features/admin/stats.api";
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";

type CardItem = {
  title: string;
  value: string | number;
  sub?: string;
  icon: JSX.Element;
  featured?: boolean;
};

function formatNumber(n: number) {
  return new Intl.NumberFormat(undefined, {
    notation: n >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(n);
}

function CountUp({
  value,
  duration = 1.2,
}: {
  value: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value, duration]);

  return <span>{formatNumber(Math.round(display))}</span>;
}

export default function PublicStats() {
  const { data, isLoading, isError, refetch } = useGetPublicStatsQuery();

  const cards: CardItem[] = useMemo(() => {
    const totalCompletedRides = Number(data?.totalCompletedRides ?? 0);
    const totalApprovedDrivers = Number(data?.totalApprovedDrivers ?? 0);
    const coverageLocations = Number(data?.coverageLocationsCount ?? 0);
    const milestone = totalCompletedRides + totalApprovedDrivers;

    return [
      {
        title: "Completed Rides",
        value: totalCompletedRides,
        icon: <Car className="h-6 w-6 text-primary" />,
        featured: true,
      },
      {
        title: "Approved Drivers",
        value: totalApprovedDrivers,
        icon: <Users className="h-6 w-6 text-primary" />,
      },
      {
        title: "Coverage Locations",
        value: coverageLocations,
        icon: <MapPin className="h-6 w-6 text-primary" />,
      },
      {
        title: "Community Milestone",
        value: milestone,
        sub: "Rides & Drivers",
        icon: <Award className="h-6 w-6 text-primary" />,
      },
    ];
  }, [data]);

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 px-4 container mx-auto">
        <div className="flex justify-center items-center py-16 sm:py-20 rounded-2xl border bg-card">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 px-4 container mx-auto">
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center rounded-2xl border bg-card">
          <p className="text-muted-foreground mb-4">Couldn't load stats</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 container mx-auto">
      <div className="text-center mb-10 sm:mb-12 lg:mb-14">
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs sm:text-sm text-muted-foreground bg-background">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          <span>Trusted by riders and drivers</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mt-3 mb-2">
          RideExpress in Numbers
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base lg:text-lg">
          Real-time highlights that showcase our growing community.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => {
          const isNumber = typeof card.value === "number";
          const colSpanLg = card.featured ? "lg:col-span-1" : "";

          return (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`${colSpanLg}`}
            >
              <Card className="h-full rounded-xl border shadow-sm bg-card">
                <CardContent className="flex flex-col justify-center items-center py-6 sm:py-8 lg:py-10">
                  <div className="mb-2 sm:mb-3">{card.icon}</div>
                  <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                    {isNumber ? (
                      <CountUp value={card.value as number} />
                    ) : (
                      card.value
                    )}
                    {typeof card.value === "number" &&
                    card.title === "Community Milestone"
                      ? "+"
                      : null}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
                    {card.sub ?? card.title}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
