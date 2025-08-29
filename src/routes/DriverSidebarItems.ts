import ActiveRides from "@/pages/Rider/ActiveRides";
import type { ISidebarItem } from "@/types";

export const driverSidebarItems: ISidebarItem[] = [
  {
    title: "History",
    items: [
      {
        title: "Active Ride",
        url: "/driver/active-ride",
        component: ActiveRides,
      },
    ],
  },
];
