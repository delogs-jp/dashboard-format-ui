// src/components/sidebar/app-sidebar.tsx
"use client";

import { useMemo } from "react";

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
//import { MENU } from "@/lib/sidebar/menu.schema";
import { getMenus } from "@/lib/sidebar/menu.mock"; // MenuRecord[] を返す
import { toMenuTree } from "@/lib/sidebar/menu.transform"; // 変換レイヤ

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // ① MenuRecord[] を取得（UIモックストア）
  const records = getMenus();
  // ② MenuTree に変換（useMemo で安定化）
  const tree = useMemo(() => toMenuTree(records), [records]);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavTeam team={mockTeam} />
      </SidebarHeader>

      <SidebarContent>
        {/* a11y ランドマーク：メインメニュー */}
        <nav aria-label="メインメニュー">
          <NavMain items={tree} />
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
