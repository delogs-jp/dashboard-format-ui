"use client";

import * as React from "react";

import { ModeToggle } from "@/components/sidebar/mode-toggle";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { NavTeam } from "@/components/sidebar/nav-team";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { mockTeam } from "@/lib/sidebar/mock-team";
import { mockNavMain } from "@/lib/sidebar/mock-nav-main";
import { mockUser } from "@/lib/sidebar/mock-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavTeam team={mockTeam} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={mockNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle className="ml-auto" />
        <NavUser user={mockUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
