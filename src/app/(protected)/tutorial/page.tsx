/* src/app/(protected)/tutorial/page.tsx */
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

import { BookOpen, ExternalLink, Info, ListChecks, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "チュートリアル",
  description:
    "UIのみ版デモの主な機能とカスタマイズ方法です。mockデータを編集していただければ、簡単にカスタマイズ可能です。",
};

export default function Page() {
  const features = [
    "ログイン画面（UI、Zodバリデーション）",
    "ログイン後レイアウト（Sidebar・ダークモード）",
    "ユーザー管理：詳細・新規・編集フォーム（UI + バリデーション）",
    "サイドバー：アクティブ同期・3層メニュー",
    "プロフィール：情報確認・編集・パスワード変更（UI）",
    "マスタ：ロール管理（UI）",
    "メニュー管理：3層・並び順・priority可視制御",
    "ログイン後404 + ログイン前のパスワード忘れ導線",
  ];

  const mockFiles = [
    { path: "@/lib/users/mock.ts", purpose: "ユーザー一覧・詳細用の仮データ" },
    { path: "@/lib/roles/mock.ts", purpose: "ロール（権限）管理の仮データ" },
    {
      path: "@/lib/sidebar/menu.mock.ts",
      purpose: "サイドバー/メニュー管理の仮データ",
    },
  ];

  const exampleUserCode = `
/* @/lib/users/mock.ts */
export type MockUser = {
  displayId: string; // 例: U00000001（DBでは自動採番想定）
  accountCode: string; // テナント境界（ログインで決まる）
  name: string;
  email: string;
  roleCode: RoleCode;
  isActive: boolean;
  deletedAt?: Date | null; // 論理削除用
};

export const mockUsers: MockUser[] = [
  {
    displayId: "U00000001",
    accountCode: "testAccount0123",
    name: "山田 太郎",
    email: "admin@example.com",
    roleCode: "ADMIN",
    isActive: true,
  },
  // 追加や変更はここで
];

// 追加・更新・削除は配列操作で模擬（フォームのバリデーション通過＝成功表示）
`.trim();

  const exampleRoleCode = `
/* @/lib/roles/mock.ts */

/* 型定義は lib/roles/schema.ts に記載しています。
   ここでは、わかりやすく転記します */
export type Role = {
  displayId: string; // 表示用ID（自動採番）
  code: string; // ロール識別子（英大文字）
  displayName: string; // 日本語表示名
  priority: number; // 優先度
  badgeColor: string; // バッジ色（HEX）
  isActive: boolean; // 有効/無効
  isSystem: boolean; // 固定ロールかどうか
  canDownloadData: boolean; // データのダウンロード可否
  canEditData: boolean; // データの編集可否
  deletedAt?: Date | null; // 論理削除
};

export const mockRoles: Role[] = [
  {
    displayId: "R00000001",
    code: "ADMIN",
    displayName: "管理者",
    priority: 100,
    badgeColor: "#D32F2F", // 赤
    isActive: true,
    isSystem: true,
    canDownloadData: true,
    canEditData: true,
  },
// 追加や変更はここで
];
`.trim();

  const exampleMenuCode = `
/* @/lib/sidebar/menu.mock.ts */

/**
   * URL（href）との一致方法：
   * - "exact": 完全一致（例 /users と /users だけ一致）
   * - "prefix": 前方一致（例 /users 配下すべて）
   * - "regex": 正規表現で高度な一致（必要時のみ）
   * - pattern は "regex"のときに利用（現状は未使用）
*/
/**
   * order で 並び順
   * parentId で親メニューと紐づけ
   * minPriority は メニューを表示するロールのPriority値の下限を設定
   * isSection が true ならグループ見出し
*/

export const INITIAL_MENU_RECORDS: MenuRecord[] = [
  // ───────── ルート階層 ─────────
  {
    displayId: "M00000001",
    parentId: null,
    order: 0,
    title: "ダッシュボード",
    href: undefined, // 見出し
    iconName: "SquareTerminal", // 変換レイヤで LucideIcon に解決
    match: "prefix",
    pattern: undefined,
    minPriority: undefined, // 未選択＝全員表示
    isSection: true,
    isActive: true,
  },
  // 追加や変更はここで
];
`.trim();

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
                <BreadcrumbPage>チュートリアル</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="container flex flex-1 flex-col gap-6 p-4 pt-0">
        {/* ヘッダー */}
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            チュートリアル
          </h1>
          <Badge variant="secondary" className="rounded-full">
            UI Only
          </Badge>
        </div>
        <p className="text-muted-foreground">
          このページでは、UIのみ版デモの「できること」と「カスタマイズ方法（mock配列の更新）」をまとめます。
        </p>

        {/* できること */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="size-5" />
              実装済み（UI + バリデーション）
            </CardTitle>
            <CardDescription>
              DB未接続・フォーム通過で成功判定のみ行います。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid list-inside list-disc gap-2 sm:grid-cols-2">
              {features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* カスタマイズ方針 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="size-5" />
              カスタマイズ方法（mockファイルの配列を更新）
            </CardTitle>
            <CardDescription>
              mock配列を書き換えるだけで画面挙動を確認できます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Info className="size-5" />
              <AlertTitle>前提</AlertTitle>
              <AlertDescription>
                本デモでは{" "}
                <span className="font-medium">Zod + React Hook Form</span>{" "}
                による入力検証のみを行い、送信は行いません。画面の表示内容は
                <span className="font-medium">mock配列</span>に依存します。
              </AlertDescription>
            </Alert>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="size-5" />
                    mockファイルの場所
                  </CardTitle>
                  <CardDescription>代表的なファイルと用途</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="list-inside list-disc space-y-2">
                    {mockFiles.map((m) => (
                      <li key={m.path}>
                        <span className="font-mono text-sm">{m.path}</span>
                        <div className="text-muted-foreground text-xs">
                          {m.purpose}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    例：ユーザー配列を追加・更新・削除
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <pre className="bg-muted/40 overflow-x-auto rounded-lg border p-4 text-sm">
                    <code>{exampleUserCode}</code>
                  </pre>
                  <p className="text-muted-foreground text-sm">
                    追加は <code>mockUsers</code>{" "}
                    に要素を追記。編集は対象要素を更新、削除はフィルタで除外します。フォーム送信は保存されませんが、
                    バリデーション通過で「成功UI」を確認できます。
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>例：ロールの優先度（priority）で制御</CardTitle>
                  <CardDescription>
                    大きい数値ほど強い権限として扱います（UI上の説明）。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted/40 overflow-x-auto rounded-lg border p-4 text-sm">
                    <code>{exampleRoleCode}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>例：メニューの並び・可視状態を変更</CardTitle>
                  <CardDescription>
                    <span className="font-mono">order</span> と{" "}
                    <span className="font-mono">isActive</span> で制御します。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted/40 overflow-x-auto rounded-lg border p-4 text-sm">
                    <code>{exampleMenuCode}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* リポジトリ */}
        <Card>
          <CardHeader>
            <CardTitle>公開リポジトリ</CardTitle>
            <CardDescription>
              ソースコードはGitHubで公開しています。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button asChild>
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
      </div>
    </>
  );
}
