import DriverRequest from "@/pages/Rider/DriverRequest";
import RequestRide from "@/pages/Rider/RequestRide";
import type { ISidebarItem } from "@/types";

export const riderSidebarItems: ISidebarItem[] = [
  {
    title: "History",
    items: [
      {
        title: "Booking",
        url: "/rider/bookings",
        component: RequestRide,
      },
      {
        title: "Driver Request",
        url: "/rider/driver-request",
        component: DriverRequest,
      },
    ],
  },
];
