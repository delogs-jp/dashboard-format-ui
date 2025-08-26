// src/app/(protected)/masters/roles/[displayId]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import Client from "./client";
import { getRoleById } from "@/lib/roles/mock";
import type { RoleUpdateValues } from "@/lib/roles/schema";

export const metadata: Metadata = {
  title: "ロール編集 | 管理画面レイアウト【DELOGs】",
  description: "ロールの確認・更新・削除（UIのみ・固定ロールは一部制限）",
};

export default async function Page({
  params,
}: {
  params: Promise<{ displayId: string }>;
}) {
  const { displayId } = await params;

  // モックから1件取得（存在しなければ 404）
  const role = getRoleById(displayId);
  if (!role) notFound();

  // Role -> RoleUpdateValues（型を明示的に整える）
  const initialValues: RoleUpdateValues = {
    displayId: role.displayId,
    code: role.code,
    displayName: role.displayName,
    priority: role.priority,
    badgeColor: role.badgeColor,
    isActive: role.isActive,
    canDownloadData: role.canDownloadData,
    canEditData: role.canEditData,
    isSystem: role.isSystem,
  };

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
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/masters/roles">
                  ロール管理
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>ロール編集（{displayId}）</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="max-w-xl p-4 pt-0">
        <Client initialValues={initialValues} />
      </div>
    </>
  );
}
