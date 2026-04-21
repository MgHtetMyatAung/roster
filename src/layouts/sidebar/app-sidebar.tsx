import * as React from "react";

import { NavMain } from "@/layouts/sidebar/nav-main";
import { NavUser } from "@/layouts/sidebar/nav-user";
import { TeamSwitcher } from "@/layouts/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { MENUS } from "@/constants/menus";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={MENUS.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={MENUS.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={MENUS.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
