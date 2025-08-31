import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "@/assets/icons/Logo";
import { Link } from "react-router";
import { getSidebarItems } from "@/utils/getSidebarItems";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { NavUser } from "./ui/nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData } = useUserInfoQuery(undefined);
  // console.log(userData?.data);

  // This is sample data.
  const data = {
    // navMain: adminSidebarItems,
    navMain: getSidebarItems(userData?.data?.role),
  };
  /**
   Argument of type 'Role | undefined' is not assignable to parameter of type 'TRole'.
  Type 'undefined' is not assignable to type 'TRole'.ts(2345)
const userData: IResponse<IUser> | undefined

   */

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link to="/">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
      <SidebarFooter>
        <NavUser user={userData?.data} />
      </SidebarFooter>
    </Sidebar>
  );
}
