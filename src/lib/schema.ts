import { z } from "zod";

export const loginSchema = z.object({
  accountId: z
    .string()
    .min(15, { message: "アカウントIDは15文字以上で入力してください。" })
    .regex(/[A-Z]/, "大文字を1文字以上含めてください。")
    .regex(/[a-z]/, "小文字を1文字以上含めてください。")
    .regex(/[0-9]/, "数字を1文字以上含めてください。"),
  email: z.email({ message: "有効なメールアドレスを入力してください。" }),
  password: z
    .string()
    .min(15, { message: "パスワードは15文字以上で入力してください。" })
    .regex(/[A-Z]/, "大文字を1文字以上含めてください。")
    .regex(/[a-z]/, "小文字を1文字以上含めてください。")
    .regex(/[0-9]/, "数字を1文字以上含めてください。"),
});
