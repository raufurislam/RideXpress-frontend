import RequestRide from "@/pages/Rider/RequestRide";
import type { ISidebarItem } from "@/types";

export const riderSidebarItems: ISidebarItem[] = [
  {
    title: "History",
    items: [
      {
        title: "Booking",
        url: "/user/bookings",
        component: RequestRide,
      },
    ],
  },
];
