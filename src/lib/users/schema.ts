// src/lib/users/schema.ts
import { z } from "zod";

/** ── 追加：ロールの定数と型 ── */
import type { Role } from "@/lib/roles/schema";
import { ROLE_CODES } from "@/lib/roles/mock"; // ← ロール一覧を取得
export type RoleCode = Role["code"]; // ← ロール実体に追随

/** ── 入力ルール（数字はあとから見直しやすいよう定数化） ── */
export const NAME_MAX = 100 as const;
export const PASSWORD_MIN = 15 as const;
export const PASSWORD_MAX = 128 as const;

/** 追記：── アバター画像のクライアント検証（UIのみ） ── */
export const MAX_IMAGE_MB = 1 as const; // Slackをまねて軽量運用
export const IMAGE_MAX_PX = 1024 as const; // 最大許容ピクセル（UIで非同期チェック）
export const IMAGE_RECOMMENDED_PX = 512 as const;

/** 共通フィールドの最小ルール */
const nameSchema = z
  .string()
  .min(1, "氏名を入力してください")
  .max(NAME_MAX, `${NAME_MAX}文字以内で入力してください`);

// Zod v4 形式：z.email()
const emailSchema = z.email("メールアドレスの形式が正しくありません");

// パスワード用
const passwordSchema = z
  .string()
  .min(PASSWORD_MIN, `${PASSWORD_MIN}文字以上で入力してください`)
  .max(PASSWORD_MAX, `${PASSWORD_MAX}文字以内で入力してください`)
  .regex(/[A-Z]/, "大文字を1文字以上含めてください。")
  .regex(/[a-z]/, "小文字を1文字以上含めてください。")
  .regex(/[0-9]/, "数字を1文字以上含めてください。");

const roleCodeSchema = z.enum(ROLE_CODES, "ロールを選択してください");

/** ── 新規作成用：password が必須 ── */
export const userCreateSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  roleCode: roleCodeSchema,
  password: passwordSchema, // パスワード変更でも使うので共通化
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

/** 追記：── プロフィール（本人用）: displayId は UI に出さない。role は「表示のみ」 ── */
export const profileUpdateSchema = z.object({
  name: nameSchema, //共通化したものを利用

  // UIのみ: 画像ファイルの基本チェック（拡張子・容量）
  avatarFile: z
    .instanceof(File)
    .optional()
    .refine(
      (file) =>
        !file ||
        ["image/png", "image/jpeg", "image/webp", "image/gif"].includes(
          file.type,
        ),
      "画像は png / jpeg / webp / gif のいずれかにしてください",
    )
    .refine(
      (file) => !file || file.size <= MAX_IMAGE_MB * 1024 * 1024,
      `画像サイズは ${MAX_IMAGE_MB}MB 以下にしてください`,
    ),
});

/** 追記：── プロフィール（本人用）のメール変更フォーム（本人用／確認メールを送るだけ） ── */
export const emailChangeSchema = (currentEmail: string) =>
  z.object({
    newEmail: z
      .email("メールアドレスの形式が正しくありません")
      .refine(
        (v) => v.trim().toLowerCase() !== currentEmail.trim().toLowerCase(),
        "現在のメールアドレスと同じです。別のメールアドレスを入力してください",
      ),
  });

/** ── パスワード変更（本人） ─────────────────── */
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "現在のパスワードを入力してください"),
  newPassword: passwordSchema, // 共通化したものを利用,
});

/** ── Zod から型を派生（z.infer を使う） ── */
export type UserCreateValues = z.infer<typeof userCreateSchema>;
export type UserUpdateValues = z.infer<typeof userUpdateSchema>;
// 追記
export type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;
// emailChangeSchema は「関数」なので ReturnType で返り値スキーマを取り出してから infer
export type EmailChangeValues = z.infer<ReturnType<typeof emailChangeSchema>>;
export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;
