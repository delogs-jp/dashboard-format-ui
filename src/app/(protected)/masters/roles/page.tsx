/* ==================================================
   src/app/(protected)/masters/roles/page.tsx
   ================================================== */
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

import { columns } from "./columns";
import RolesDataTable from "./data-table";
import { getRoles } from "@/lib/roles/mock";

export const metadata: Metadata = {
  title: "ロール一覧 | 管理画面レイアウト【DELOGs】",
  description:
    "ロール一覧（色・種別・権限）をshadcn/ui+@tanstack/react-tableで表示",
};

export default async function Page() {
  // UIのみ：モックから取得（論理削除は mock 側で除外）
  const roles = getRoles();

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
                <BreadcrumbLink href="/masters">マスタ管理</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>ロール一覧</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="max-w-full p-4 pt-0">
        <RolesDataTable
          columns={columns}
          data={roles}
          newPath="/masters/roles/new"
        />
      </div>
    </>
  );
}
