import RideHistory from "@/pages/Rider/RideHistory";
import DriverRequest from "@/pages/Rider/DriverRequest";
import RequestRide from "@/pages/Rider/RequestRide";
import type { ISidebarItem } from "@/types";

export const riderSidebarItems: ISidebarItem[] = [
  {
    title: "History",
    items: [
      {
        title: "Book Ride",
        url: "/rider/request-ride",
        component: RequestRide,
      },
      {
        title: "Driver Request",
        url: "/rider/driver-request",
        component: DriverRequest,
      },
      {
        title: "Ride History",
        url: "/rider/ride-history",
        component: RideHistory,
      },
    ],
  },
];
