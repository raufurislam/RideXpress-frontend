import AllDriver from "@/pages/Admin/AllDriver";
import Analytics from "@/pages/Analytics";
import type { ISidebarItem } from "@/types";
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
      {
        title: "All Driver",
        url: "/admin/all-driver",
        component: AllDriver,
      },
      {
        title: "All Driver",
        url: "/admin/all-driver",
        component: AllDriver,
      },
    ],
  },
  // {
  //   title: "Tour Management",
  //   items: [
  //     {
  //       title: "Add Tour ",
  //       url: "/admin/driver-request",
  //       component: DriverRequest,
  //     },
  //   ],
  // },
];
