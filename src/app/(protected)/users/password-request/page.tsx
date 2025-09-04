// src/app/(protected)/users/password-request/page.tsx
import type { Metadata } from "next";
import { SidebarTrigger } from "@/components/ui/sidebar";
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

import { CURRENT_ACCOUNT_CODE, mockRoleOptions } from "@/lib/users/mock";
import { listPasswordRequests } from "@/lib/users/password-request.mock";

export const metadata: Metadata = {
  title: "パスワード再発行依頼 | 管理画面レイアウト【DELOGs】",
  description:
    "Data table（shadcn/ui + @tanstack/react-table）でパスワード再発行依頼を一覧表示",
};

export default function Page() {
  // UIのみ：ログイン中アカウント配下の依頼をモックから取得
  const accountCode = CURRENT_ACCOUNT_CODE;
  const rows = listPasswordRequests(accountCode);

  return (
    <>
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
                <BreadcrumbPage>パスワード再発行依頼</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="container p-4 pt-0">
        <DataTable
          columns={columns}
          data={rows}
          roleOptions={mockRoleOptions}
        />
      </div>
    </>
  );
}
