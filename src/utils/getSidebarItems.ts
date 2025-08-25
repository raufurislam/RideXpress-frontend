// getSidebarItems.ts
import { role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/AdminSidebarItems";
import { riderSidebarItems } from "@/routes/RiderSidebarItems";
// import { adminSidebarItems } from "@/routes/AdminSidebarItems";
import type { TRole } from "@/types";

export const getSidebarItems = (userRole: TRole) => {
  // console.log(userRole);
  switch (userRole) {
    case role.superAdmin:
      return [...adminSidebarItems, ...riderSidebarItems];
    case role.admin:
      return [...adminSidebarItems];
    case role.user:
      return [...riderSidebarItems];
    default:
      return [];
  }
};
