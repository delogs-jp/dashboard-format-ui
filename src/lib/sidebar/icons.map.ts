// src/lib/sidebar/icons.map.ts
// Lucide のアイコン名文字列を LucideIcon に解決する辞書
import type { LucideIcon } from "lucide-react";
import { SquareTerminal, BookOpen, Settings2 } from "lucide-react";

// 値の型を LucideIcon にするのがポイント
export const ICONS: Record<string, LucideIcon> = {
  SquareTerminal,
  BookOpen,
  Settings2,
};
