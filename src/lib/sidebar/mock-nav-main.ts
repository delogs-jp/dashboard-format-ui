import {
  BookOpen,
  Settings2,
  SquareTerminal,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}[];

export const mockNavMain: NavItem = [
  {
    title: "ダッシュボード",
    url: "/dashboard",
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: "全体進捗",
        url: "#",
      },
      {
        title: "Myプロジェクト",
        url: "#",
      },
      {
        title: "Myタスク",
        url: "#",
      },
    ],
  },
  {
    title: "ドキュメント",
    url: "#",
    icon: BookOpen,
    items: [
      { title: "チュートリアル", url: "#" },
      { title: "更新履歴", url: "#" },
    ],
  },
  {
    title: "設定",
    url: "#",
    icon: Settings2,
    items: [
      {
        title: "プロジェクト管理",
        url: "#",
      },
      {
        title: "マスタ管理",
        url: "#",
      },
      {
        title: "ユーザ管理",
        url: "#",
      },
    ],
  },
];
