// src/components/login/password-forgot-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { accountIdSchema } from "@/lib/users/schema";
import { emailSchema } from "@/lib/users/schema";

/* =========================
   スキーマ（合成）
   ========================= */
export const forgotRequestSchema = z.object({
  accountId: accountIdSchema,
  email: emailSchema,
  note: z.string().optional(),
});
export type ForgotRequestValues = z.infer<typeof forgotRequestSchema>;

/* =========================
   公開インターフェース（型）
   ========================= */
type Props = {
  onSubmit: (values: ForgotRequestValues) => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  /** 送信済み状態（true の間は入力不可・ボタン群の代わりにラベル表示） */
  submitted?: boolean;
};

/* =========================
   エクスポート本体
   ========================= */
export default function PasswordForgotForm({
  onSubmit,
  onCancel,
  loading,
  submitted,
}: Props) {
  const form = useForm<ForgotRequestValues>({
    resolver: zodResolver(forgotRequestSchema),
    defaultValues: { accountId: "", email: "", note: "" },
    mode: "onBlur",
  });

  const isBusy = loading || form.formState.isSubmitting || Boolean(submitted);

  return (
    <Form {...form}>
      <form
        data-testid="password-forgot-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card className="w-full rounded-md">
          <CardContent className="space-y-6 pt-1">
            <AccountIdField disabled={isBusy} />
            <EmailField disabled={isBusy} />
            <NoteField disabled={isBusy} />
            <FormDescription>
              送信後、管理者より新規のパスワードが発行されます。メールで再発行通知があるまでしばらくお待ち下さい。
            </FormDescription>
          </CardContent>

          <CardFooter className="mt-4 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              data-testid="cancel-btn"
              className="cursor-pointer"
            >
              キャンセル
            </Button>

            {submitted ? (
              // ラベル表示（ボタンの代替）
              <span
                role="status"
                aria-live="polite"
                className="bg-muted text-foreground inline-flex items-center rounded-md px-2 py-1 font-medium"
                data-testid="submitted-label"
              >
                再発行依頼完了
              </span>
            ) : (
              <Button
                type="submit"
                data-testid="submit-forgot"
                className="cursor-pointer"
                disabled={isBusy}
              >
                {isBusy ? "送信中..." : "依頼を送信"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

/* =========================
   小さなフィールド群
   ========================= */
function AccountIdField({ disabled }: { disabled: boolean }) {
  return (
    <FormField
      name="accountId"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">アカウントID *</FormLabel>
          <FormControl>
            <Input
              {...field}
              disabled={disabled}
              inputMode="text"
              placeholder="例: COMPANY012345678"
              autoComplete="username"
              aria-label="アカウントID"
              data-testid="accountId"
            />
          </FormControl>
          <FormMessage data-testid="accountId-error" />
        </FormItem>
      )}
    />
  );
}

function EmailField({ disabled }: { disabled: boolean }) {
  return (
    <FormField
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">メールアドレス *</FormLabel>
          <FormControl>
            <Input
              {...field}
              disabled={disabled}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-label="メールアドレス"
              data-testid="email"
            />
          </FormControl>
          <FormMessage data-testid="email-error" />
        </FormItem>
      )}
    />
  );
}

function NoteField({ disabled }: { disabled: boolean }) {
  return (
    <FormField
      name="note"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">備考（任意）</FormLabel>
          <FormControl>
            <Input
              {...field}
              disabled={disabled}
              placeholder="依頼の背景や担当者名など"
              inputMode="text"
              autoComplete="off"
              aria-label="備考"
              data-testid="note"
            />
          </FormControl>
          <FormMessage data-testid="note-error" />
        </FormItem>
      )}
    />
  );
}
