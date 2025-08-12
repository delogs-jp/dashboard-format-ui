// src/components/nav-team.tsx
"use client";

import Image from "next/image";

import type { Team } from "@/lib/sidebar/mock-team";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavTeam({ team }: { team: Team }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="cursor-default rounded"
          aria-label="チーム情報"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 h-[32px] min-h-[32px] w-[32px] min-w-[32px] items-center justify-center overflow-hidden rounded">
            <Image
              src={team.icon}
              alt={team.name}
              width={32}
              height={32}
              priority
              className="object-contain"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{team.name}</span>
            <span className="text-muted-foreground truncate text-xs">
              {team.lead}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
