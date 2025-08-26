/**
 * src/lib/sidebar/menu.schema.ts
 * 「型」と「メニュー定義」を1ファイルに集約（単一出所）
 */
import type { LucideIcon } from "lucide-react";
import { SquareTerminal, BookOpen, Settings2 } from "lucide-react";

/** どのルールでURL一致を判定するか */
export type MatchMode = "exact" | "prefix" | "regex";

/** 1つのメニュー要素（ツリーの節） */
export type MenuNode = {
  /** 安定したキー（href が変わっても差分検知しやすくするなら独立ID推奨） */
  id: string;
  /** ラベル（サイドバーに表示） */
  title: string;
  /** 対応するURL（絶対パス。トレーリングスラッシュは付けない） */
  href: string;
  /** アイコン（任意） */
  icon?: LucideIcon;
  /**
   * URLの一致方法：
   * - "exact": 完全一致（例 /users と /users だけ一致）
   * - "prefix": 前方一致（例 /users 配下すべて）
   * - "regex": 正規表現で高度な一致（必要時のみ）
   *
   * 指定がなければ "prefix" を既定とするのが実務的です。
   */
  match?: MatchMode;
  /** match === "regex" のときに使うパターン（未使用なら省略） */
  pattern?: RegExp;
  /** 子ノード（グループやサブメニュー） */
  children?: MenuNode[];
};

/** ツリー全体 */
export type MenuTree = MenuNode[];

/**
 * 最小のメニュー定義
 * - ダッシュボード（/dashboard）
 * - 設定（/settings）配下に「ユーザ管理（/users）」グループ
 *   - 一覧（/users）… exact
 *   - 新規（/users/new）… exact
 *
 * 動的URL（/users/[displayId]）は子に列挙しません。
 * 親（/users）が "prefix" で受け止めます。
 */
export const MENU: MenuTree = [
  {
    id: "dashboard",
    title: "ダッシュボード",
    href: "",
    icon: SquareTerminal,
    match: "prefix", // /dashboard 配下すべてを受け持つ
    children: [
      {
        id: "dashboard-overview",
        title: "全体進捗",
        href: "/dashboard",
        match: "exact",
      },
      {
        id: "dashboard-my-project",
        title: "Myプロジェクト",
        href: "#",
        match: "prefix",
      },
      {
        id: "dashboard-my-task",
        title: "Myタスク",
        href: "#",
        match: "prefix",
      },
    ],
  },
  {
    id: "docs",
    title: "ドキュメント",
    href: "",
    icon: BookOpen,
    match: "prefix",
    children: [
      {
        id: "docs-tutorial",
        title: "チュートリアル",
        href: "#",
        match: "prefix",
      },
      {
        id: "docs-changelog",
        title: "更新履歴",
        href: "#",
        match: "prefix",
      },
    ],
  },
  {
    id: "settings",
    title: "設定",
    href: "",
    icon: Settings2,
    match: "prefix",
    children: [
      {
        id: "settings-projects",
        title: "プロジェクト管理",
        href: "#",
        match: "prefix",
      },
      {
        id: "settings-masters",
        title: "マスタ管理",
        href: "/masters",
        match: "prefix",
        children: [
          {
            id: "masters-list",
            title: "マスタ一覧",
            href: "/masters",
            match: "exact",
          },
          {
            id: "masters-roles",
            title: "ロール管理",
            href: "/masters/roles",
            match: "exact",
          },
        ],
      },
      {
        id: "settings-users",
        title: "ユーザ管理",
        href: "/users",
        match: "prefix", // /users 配下を親で受ける（動的URL対応）
        children: [
          { id: "users-list", title: "一覧", href: "/users", match: "exact" },
          {
            id: "users-new",
            title: "新規登録",
            href: "/users/new",
            match: "exact",
          },
          // /users/[displayId] は列挙しない → 親 "/users" が最長一致で勝つ
        ],
      },
    ],
  },
];
