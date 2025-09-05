import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Users, Car, MapPin, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useGetPublicStatsQuery } from "@/redux/features/admin/stats.api";
import type { JSX } from "react";

type CardItem = {
  title: string;
  value: string | number;
  sub?: string;
  icon: JSX.Element;
};

export default function PublicStats() {
  const { data, isLoading, isError, refetch } = useGetPublicStatsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground mb-4">Couldn't load stats</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  const cards: CardItem[] = [
    {
      title: "Completed Rides",
      value: Number(data.totalCompletedRides ?? 0),
      icon: <Car className="h-6 w-6 text-primary" />,
    },
    {
      title: "Approved Drivers",
      value: Number(data.totalApprovedDrivers ?? 0),
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      title: "Coverage Locations",
      value: Number(data.coverageLocationsCount ?? 0),
      icon: <MapPin className="h-6 w-6 text-primary" />,
    },
    {
      title: "Community Milestone",
      value: `${
        Number(data.totalCompletedRides ?? 0) +
        Number(data.totalApprovedDrivers ?? 0)
      }+`,
      sub: "Rides & Drivers",
      icon: <Award className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <section className="py-20 px-4 container mx-auto">
      <div className="text-center mb-14">
        <h2 className="text-4xl font-extrabold tracking-tight mb-3">
          RideExpress in Numbers
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
          Real-time highlights that showcase our growing community.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 250 }}
          >
            <Card className="h-full rounded-2xl border border-border/50 shadow-md bg-card hover:shadow-lg transition">
              <CardContent className="flex flex-col justify-center items-center py-10">
                <div className="mb-3">{card.icon}</div>
                <p className="text-4xl font-bold tracking-tight">
                  {card.value}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {card.sub ?? card.title}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
