import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { role } from "@/constants/role";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
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
import Homepage from "@/pages/Homepage";
import AccountStatus from "@/pages/AccountStatus";
import GoogleCallback from "@/components/modules/Authentication/GoogleCallback";
// import RideDetails from "@/pages/Rider/RideDetails";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: Homepage,
        index: true,
      },
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
    Component: withAuth(DashboardLayout, [
      role.superAdmin as TRole,
      role.admin as TRole,
    ]),
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
      { index: true, element: <Navigate to="/rider/request-ride" /> },
      ...generateRoutes(riderSidebarItems),
    ],
  },

  // {
  //   Component: withAuth(RideDetails),
  //   path: "/rider/ride-details/:rideId",
  // },

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
    Component: withAuth(Profile),
    path: "/profile",
  },
  {
    Component: withAuth(Settings),
    path: "/settings",
  },
  {
    Component: Unauthorized,
    path: "/unauthorized",
  },
  { Component: AccountStatus, path: "/account-status" },
  { Component: GoogleCallback, path: "/google-callback" },
]);
