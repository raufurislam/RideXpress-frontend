import ActiveRides from "@/pages/Driver/ActiveRides";
import DriverEarning from "@/pages/Driver/DriverEarning";
import DrivingProfile from "@/pages/Driver/DrivingProfile";
import GetRide from "@/pages/Driver/GetRide";
import RideHistoryDriver from "@/pages/Driver/RideHistoryDriver";
import type { ISidebarItem } from "@/types";

export const driverSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "My Earning",
        url: "/driver/earning",
        component: DriverEarning,
      },
    ],
  },
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
      {
        title: "Ride History",
        url: "/driver/ride-history",
        component: RideHistoryDriver,
      },
      {
        title: "Driving profile",
        url: "/driver/driving-profile",
        component: DrivingProfile,
      },
    ],
  },
];
