// src/app/(protected)/dashboard/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  CheckCircle2,
  ExternalLink,
  Mail,
  ShieldCheck,
  StickyNote,
} from "lucide-react";

export const metadata: Metadata = {
  title: "ダッシュボード",
  description:
    "shadcn/uiを使用した管理画面レイアウトの概要をまとめています。制作過程のわかる記事やGithubへのリンクを記載しています。",
};

export default function Page() {
  const articles = [
    {
      title: "【管理画面フォーマット制作編 #1】 Shadcn/uiで作るログイン画面",
      href: "https://delogs.jp/next-js/shadcn-ui/login-form",
    },
    {
      title:
        "【管理画面フォーマット制作編 #2】 Shadcn/uiで作るログイン後の管理画面レイアウト",
      href: "https://delogs.jp/next-js/shadcn-ui/dashboard-layout",
    },
    {
      title:
        "【管理画面フォーマット制作編 #3】 ユーザ管理UI ─ 詳細・新規・編集フォーム実装",
      href: "https://delogs.jp/next-js/shadcn-ui/user-management-ui",
    },
    {
      title:
        "【管理画面フォーマット制作編 #4】 サイドバーのメニューと参照中ページの同期",
      href: "https://delogs.jp/next-js/shadcn-ui/sidebar-active-sync",
    },
    {
      title:
        "【管理画面フォーマット制作編 #5】 ユーザープロフィールUI ─ 情報確認・編集・パスワード変更",
      href: "https://delogs.jp/next-js/shadcn-ui/user-profile-ui",
    },
    {
      title:
        "【管理画面フォーマット制作編 #6】 マスタ管理-ロール管理（UIのみ）",
      href: "https://delogs.jp/next-js/shadcn-ui/format-role-ui",
    },
    {
      title:
        "【管理画面フォーマット制作編 #7】 サイドバーメニュー管理UI ─ 3層・並び順・priority可視制御まで",
      href: "https://delogs.jp/next-js/shadcn-ui/format-menu-ui",
    },
    {
      title:
        "【管理画面フォーマット制作編 #8】 ログイン後404ページ + ログイン前のパスワード忘れ導線UI",
      href: "https://delogs.jp/next-js/shadcn-ui/format-404-password-forgot",
    },
  ];

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
              <BreadcrumbItem>
                <BreadcrumbPage>概要</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* ==== ページ内容 ==== */}
      <div className="container flex flex-1 flex-col gap-6 p-4 pt-0">
        {/* ヘッダー */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              管理画面フォーマット（UIのみ版）のデモページ
            </h1>
            <Badge variant="secondary" className="rounded-full">
              Demo
            </Badge>
            <Badge className="rounded-full" variant="outline">
              UI Only
            </Badge>
          </div>
          <p className="text-muted-foreground">
            このデモはUIのみを構築したものです。DBとの連携はしていませんが、登録・更新・削除については
            <span className="font-medium">バリデーション</span>
            まで実装し、通過時に成功判定となるようにしています。
            DBと連携したバージョンは別途構築予定で、将来の連携を見据えた構成にしています。
          </p>
        </div>

        {/* 注意/概要 */}
        <Alert className="border-amber-200 bg-amber-50/70 dark:border-amber-800/50 dark:bg-amber-900/20">
          <ShieldCheck className="size-5" />
          <AlertTitle>構成について</AlertTitle>
          <AlertDescription>
            入力フォームは
            <span className="font-medium">Zod + React Hook Form</span>
            に準拠した基本形です。エンドポイントへは送信しないため、データは保存されません。
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* 左：記事の総括（タイムライン風） */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StickyNote className="size-5" />
                制作過程（記事まとめ）
              </CardTitle>
              <CardDescription>
                各ステップの詳細は以下の記事をご参照ください。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="relative ml-3 space-y-6 border-l pl-6">
                {articles.map((a) => (
                  <li key={a.href} className="group">
                    <span className="bg-primary text-primary-foreground ring-background absolute -left-[9px] mt-1.5 inline-flex items-center justify-center rounded-full ring-2">
                      <CheckCircle2 className="size-4" aria-hidden="true" />
                    </span>
                    <Link
                      href={a.href}
                      target="_blank"
                      rel="noreferrer"
                      prefetch={false}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {a.title}
                      <ExternalLink className="ml-1 inline size-3 align-text-top opacity-70" />
                    </Link>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* 右：クイックリンク */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  公開リポジトリ
                </CardTitle>
                <CardDescription>
                  ソースコードはGitHubで公開しています。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link
                    href="https://github.com/delogs-jp/dashboard-format-ui"
                    target="_blank"
                    rel="noreferrer"
                  >
                    delogs-jp/dashboard-format-ui
                    <ExternalLink className="ml-2 size-4 opacity-80" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ご意見・ご感想
                </CardTitle>
                <CardDescription>
                  お問い合わせ または X（旧Twitter）からどうぞ。
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3">
                <Button
                  asChild
                  variant="secondary"
                  className="w-full justify-start"
                >
                  <Link
                    href="https://delogs.jp/contact"
                    target="_blank"
                    prefetch={false}
                    rel="noreferrer"
                  >
                    <Mail className="mr-2 size-4" />
                    お問い合わせページへ
                    <ExternalLink className="ml-2 size-4 opacity-80" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link
                    href="https://x.com/DELOGs2506"
                    target="_blank"
                    rel="noreferrer"
                  >
                    @DELOGs2506 へ
                    <ExternalLink className="ml-2 size-4 opacity-80" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
