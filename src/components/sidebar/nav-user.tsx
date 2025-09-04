"use client";
import Link from "next/link";
import {
  Bell,
  ChevronsUpDown,
  KeyRound,
  LogOut,
  User as UserIcon,
} from "lucide-react";

import type { User } from "@/lib/sidebar/mock-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              aria-label="ユーザーメニューを開く"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {/* 画像は next/image でもOKだが AvatarImage で十分 */}
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* ヘッダー（ユーザー情報の再掲） */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                {/* 変更: /profile に差し替え */}
                <Link href="/profile" className="flex items-center gap-2">
                  <UserIcon className="size-4" />
                  ユーザー情報確認
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                {/* 変更: /profile/password に差し替え */}
                <Link
                  href="/profile/password"
                  className="flex items-center gap-2"
                >
                  <KeyRound className="size-4" />
                  パスワード変更
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                {/* TODO: /notifications に差し替え */}
                <Link href="#" className="flex items-center gap-2">
                  <Bell className="size-4" />
                  通知
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              {/* TODO: /api/logout などにPOST。UIだけなら href="#" でOK */}
              <Link
                href="/"
                className="text-destructive flex items-center gap-2"
              >
                <LogOut className="size-4" />
                ログアウト
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
