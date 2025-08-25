import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { role } from "@/constants/role";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import type { TRole } from "@/types";
import { withAuth } from "@/utils/withAuth";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./AdminSidebarItems";
import { generateRoutes } from "@/utils/generateRoutes";
import { riderSidebarItems } from "./RiderSidebarItems";
import Unauthorized from "@/pages/Unauthorized";
import Features from "@/pages/Features";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import { driverSidebarItems } from "./DriverSidebarItems";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: About,
        path: "/about",
      },
      {
        Component: Features,
        path: "/features",
      },
      {
        Component: Contact,
        path: "/contact",
      },
      {
        Component: FAQ,
        path: "/faq",
      },
    ],
  },

  {
    Component: withAuth(DashboardLayout, role.superAdmin as TRole),
    path: "/admin",
    children: [
      { index: true, element: <Navigate to="/admin/analytics" /> },
      ...generateRoutes(adminSidebarItems),
    ],
  },

  {
    Component: withAuth(DashboardLayout, role.rider as TRole),
    path: "/rider",
    children: [
      { index: true, element: <Navigate to="/rider/bookings" /> },
      ...generateRoutes(riderSidebarItems),
    ],
  },

  {
    Component: withAuth(DashboardLayout, role.driver as TRole),
    path: "/driver",
    children: [
      { index: true, element: <Navigate to="/driver/active-ride" /> },
      ...generateRoutes(driverSidebarItems),
    ],
  },

  {
    Component: Login,
    path: "/login",
  },
  {
    Component: Register,
    path: "/register",
  },
  {
    Component: Unauthorized,
    path: "/unauthorized",
  },
]);
