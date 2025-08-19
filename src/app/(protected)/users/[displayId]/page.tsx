// src/app/(protected)/users/[displayId]/page.tsx
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
import {
  CURRENT_ACCOUNT_CODE,
  getUserByDisplayId,
  toUpdateValues,
  mockRoleOptions,
} from "@/lib/users/mock";

export const metadata: Metadata = {
  title: "ユーザ編集 | 管理画面レイアウト【DELOGs】",
  description: "共通フォーム（shadcn/ui + RHF + Zod）でユーザ情報を編集",
};

export default async function Page({
  params,
}: {
  params: Promise<{ displayId: string }>;
}) {
  const accountCode = CURRENT_ACCOUNT_CODE; // UIのみの仮固定
  const { displayId } = await params;
  const user = getUserByDisplayId(accountCode, displayId);
  if (!user) notFound();

  const initialValues = toUpdateValues(user);

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
                <BreadcrumbPage>ユーザ情報編集（{displayId}）</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="max-w-xl p-4 pt-0">
        <Client
          initialValues={initialValues}
          roleOptions={mockRoleOptions}
          accountCode={accountCode}
        />
      </div>
    </>
  );
}
