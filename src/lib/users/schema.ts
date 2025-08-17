// src/lib/users/schema.ts
import { z } from "zod";

/** ── 追加：ロールの定数と型 ── */
export const ROLE_CODES = ["ADMIN", "EDITOR", "VIEWER"] as const;
export type RoleCode = (typeof ROLE_CODES)[number];

/** ── 入力ルール（数字はあとから見直しやすいよう定数化） ── */
export const NAME_MAX = 100 as const;
export const PASSWORD_MIN = 15 as const;
export const PASSWORD_MAX = 128 as const;

/** 共通フィールドの最小ルール */
const nameSchema = z
  .string()
  .min(1, "氏名を入力してください")
  .max(NAME_MAX, `${NAME_MAX}文字以内で入力してください`);

// Zod v4 形式：z.email()
const emailSchema = z.email("メールアドレスの形式が正しくありません");

const roleCodeSchema = z.enum(ROLE_CODES, "ロールを選択してください"); // ← "ADMIN" | "EDITOR" | "VIEWER" になる

/** ── 新規作成用：password が必須 ── */
export const userCreateSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  roleCode: roleCodeSchema,
  password: z
    .string()
    .min(PASSWORD_MIN, `${PASSWORD_MIN}文字以上で入力してください`)
    .max(PASSWORD_MAX, `${PASSWORD_MAX}文字以内で入力してください`)
    .regex(/[A-Z]/, "大文字を1文字以上含めてください。")
    .regex(/[a-z]/, "小文字を1文字以上含めてください。")
    .regex(/[0-9]/, "数字を1文字以上含めてください。"),
  isActive: z.boolean(),
});

/** ── 編集用：displayId を表示専用で扱い、password は扱わない ── */
export const userUpdateSchema = z.object({
  displayId: z.string().min(1, "表示IDの取得に失敗しました"),
  name: nameSchema,
  email: emailSchema,
  roleCode: roleCodeSchema,
  isActive: z.boolean(),
});

/** ── Zod から型を派生（z.infer を使う） ── */
export type UserCreateValues = z.infer<typeof userCreateSchema>;
export type UserUpdateValues = z.infer<typeof userUpdateSchema>;
