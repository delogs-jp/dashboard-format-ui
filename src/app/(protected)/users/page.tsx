// src/app/(protected)/users/page.tsx
import type { Metadata } from "next";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

import DataTable from "./data-table";
import { columns } from "./columns";

import {
  CURRENT_ACCOUNT_CODE,
  getUsersByAccount,
  mockRoleOptions,
} from "@/lib/users/mock";

export const metadata: Metadata = {
  title: "ユーザ一覧 | 管理画面レイアウト【DELOGs】",
  description:
    "Data table（shadcn/ui + @tanstack/react-table）でユーザ一覧を表示",
};

export default async function Page() {
  // UIのみ：ログイン中アカウント配下のユーザをモックから取得
  const accountCode = CURRENT_ACCOUNT_CODE;
  const all = getUsersByAccount(accountCode);
  const users = all.filter((u) => !u.deletedAt); // 論理削除は一覧非表示

  return (
    <>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/users">ユーザ管理</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>ユーザ一覧</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="max-w-full p-4 pt-0">
          <DataTable
            columns={columns}
            data={users}
            roleOptions={mockRoleOptions}
          />
        </div>
      </SidebarInset>
    </>
  );
}
