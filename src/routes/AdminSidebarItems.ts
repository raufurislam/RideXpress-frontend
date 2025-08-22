// import AddDivision from "@/pages/Admin/AddDivision";
// import AddTour from "@/pages/Admin/AddTour";
// import AddTourType from "@/pages/Admin/AddTourType";
import DriverRequest from "@/pages/Admin/DriverRequest";
import Analytics from "@/pages/Analytics";
import type { ISidebarItem } from "@/types";
// import Analytics from "./../pages/Admin/Analytics";
// import { lazy } from "react";

// const Analytics = lazy(() => import("@/pages/Admin/Analytics"));

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: Analytics,
      },
    ],
  },
  {
    title: "Tour Management",
    items: [
      {
        title: "Add Tour Type",
        url: "/admin/driver-request",
        component: DriverRequest,
      },
    ],
  },
];
