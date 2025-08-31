import ActiveRides from "@/pages/Driver/ActiveRides";
import GetRide from "@/pages/Driver/GetRide";
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
      {
        title: "Get Ride",
        url: "/driver/get-ride",
        component: GetRide,
      },
    ],
  },
];
