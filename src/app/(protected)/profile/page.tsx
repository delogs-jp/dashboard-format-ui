// src/app/(protected)/profile/page.tsx
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "プロフィール | 管理画面レイアウト【DELOGs】",
  description:
    "ユーザのプロフィール（氏名・アバター）を編集し、メール／パスワード変更画面へ遷移",
};

export default async function Page() {
  // 本人限定のため、SSR側で displayId は不要（セッション前提）。
  // UI記事ではモックに任せ、ここでは何も取得しない。
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
                <BreadcrumbLink href="/profile">プロフィール</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>プロフィール編集</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* ← コンテナは SSR 側に集約 */}
      <div className="max-w-xl p-4 pt-0">
        <Client />
      </div>
    </>
  );
}
