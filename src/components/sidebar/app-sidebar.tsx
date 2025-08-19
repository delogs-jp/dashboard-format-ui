// src/components/sidebar/app-sidebar.tsx
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
import { mockUser } from "@/lib/sidebar/mock-user";
// ★ 単一出所に統一：ここからメニューを取る
import { MENU } from "@/lib/sidebar/menu.schema";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavTeam team={mockTeam} />
      </SidebarHeader>

      <SidebarContent>
        {/* a11y ランドマーク：メインメニュー */}
        <nav aria-label="メインメニュー">
          <NavMain items={MENU} />
        </nav>
      </SidebarContent>

      <SidebarFooter>
        <ModeToggle className="ml-auto" />
        <NavUser user={mockUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
