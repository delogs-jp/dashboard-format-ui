// src/components/nav-main.tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { NavItem } from "@/lib/sidebar/mock-nav-main";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

type Props = { items: NavItem };

export function NavMain({ items }: Props) {
  const { state, isMobile, setOpen } = useSidebar();

  const handleMenuClick = (e: React.MouseEvent) => {
    if (state === "collapsed" && !isMobile) {
      setOpen(true); // サイドバーを展開
      e.preventDefault(); // すぐ遷移させない
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>メニュー</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const hasChildren = !!item.items?.length;

          // 子がない場合は Collapsible を使わずにそのままリンク
          if (!hasChildren) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={item.isActive ? "bg-muted font-semibold" : ""}
                  tooltip={item.title}
                  aria-current={item.isActive ? "page" : undefined}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon className="size-4" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // 子がある場合は Collapsible（開閉可）
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={item.isActive ? "bg-muted font-semibold" : ""}
                    aria-expanded={item.isActive ? true : undefined}
                    onClick={handleMenuClick} // ← 追加
                  >
                    {item.icon && <item.icon className="size-4" />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((sub) => (
                      <SidebarMenuSubItem key={sub.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={sub.url}>
                            <span>{sub.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
