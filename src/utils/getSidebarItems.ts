// getSidebarItems.ts
import { role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/AdminSidebarItems";
import { driverSidebarItems } from "@/routes/DriverSidebarItems";
import { riderSidebarItems } from "@/routes/RiderSidebarItems";
// import { adminSidebarItems } from "@/routes/AdminSidebarItems";
import type { TRole } from "@/types";

export const getSidebarItems = (userRole?: TRole) => {
  // console.log(userRole);
  switch (userRole) {
    case role.superAdmin:
      return [...adminSidebarItems];
    case role.admin:
      return [...adminSidebarItems];
    case role.rider:
      return [...riderSidebarItems];
    case role.driver:
      return [...driverSidebarItems];
    default:
      return [];
  }
};
