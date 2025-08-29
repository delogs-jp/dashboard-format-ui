/* ==================================================
   src/app/(protected)/masters/menus/page.tsx
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

import MenusDataTable from "./data-table";
import { columns } from "./columns";
import { getMenus } from "@/lib/sidebar/menu.mock";

export const metadata: Metadata = {
  title: "メニュー一覧 | 管理画面レイアウト【DELOGs】",
  description:
    "サイドバーメニューの一覧。階層表示と兄弟間の↑↓入れ替えに対応（UIのみ、モックストア連携）。",
};

export default async function Page() {
  // UIのみ：モックから取得（親→子→孫の安定ソートは mock 側の getMenus() に準拠）
  const menus = getMenus();

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
                <BreadcrumbPage>メニュー一覧</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="max-w-full p-4 pt-0">
        <MenusDataTable
          columns={columns}
          data={menus}
          newPath="/masters/menus/new"
        />
      </div>
    </>
  );
}
