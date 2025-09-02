// src/app/(public)/password-forgot/page.tsx
import type { Metadata } from "next";
import Client from "./client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "パスワード再発行依頼",
};

export default function PasswordForgotPage() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-gray-800 p-6 md:p-10 dark:bg-neutral-800">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex flex-col justify-center gap-4">
            {/* light用ロゴ（＝ダークモード時に非表示） */}
            <Image
              src="/logo.svg"
              alt="サイトロゴ"
              width={160}
              height={40}
              priority
              className="h-[40px] w-[160px] dark:hidden"
            />

            {/* dark用ロゴ（＝ダークモード時に表示） */}
            <Image
              src="/logo-d.svg"
              alt="サイトロゴ（ダーク）"
              width={160}
              height={40}
              priority
              className="hidden h-[40px] w-[160px] dark:block"
            />

            <h1 className="text-2xl font-bold">パスワード再発行の依頼</h1>
            <p className="text-muted-foreground mt-1 text-left">
              アカウントIDとメールアドレスを入力して、管理者に再発行を依頼します。
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Client />
        </CardContent>
      </Card>
    </main>
  );
}
