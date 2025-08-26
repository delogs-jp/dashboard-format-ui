// src/lib/roles/schema.ts
import { z } from "zod";

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

/** 新規登録用のスキーマ */
export const roleCreateSchema = z.object({
  code: z
    .string()
    .regex(
      /^[A-Z][A-Z0-9_]*$/,
      "大文字英字と数字、アンダースコアのみ使用できます",
    )
    .min(2, "2文字以上で入力してください")
    .max(50, "50文字以内で入力してください"),
  displayName: z
    .string()
    .min(1, "表示名を入力してください")
    .max(100, "100文字以内で入力してください"),
  priority: z.coerce
    .number()
    .int("整数で入力してください")
    .min(0, "0以上で入力してください")
    .max(999, "999以下で入力してください"),
  badgeColor: z
    .string()
    .regex(
      /^#([0-9A-Fa-f]{6})$/,
      "カラーコードは #RRGGBB の形式で入力してください",
    ),
  isActive: z.boolean(),
  canDownloadData: z.boolean(),
  canEditData: z.boolean(),
});

/** 更新用のスキーマ */
export const roleUpdateSchema = roleCreateSchema.extend({
  displayId: z.string().min(1, "表示IDの取得に失敗しました"),
  isSystem: z.boolean(),
});

/** 追加: フォーム値の型を公開（RHF で使用） */
export type RoleCreateValues = z.infer<typeof roleCreateSchema>;
export type RoleUpdateValues = z.infer<typeof roleUpdateSchema>;
