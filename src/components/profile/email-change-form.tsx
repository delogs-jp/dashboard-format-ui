// src/components/profile/email-change-form.tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailChangeSchema, type EmailChangeValues } from "@/lib/users/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

/* =========================
   公開インターフェース
   ========================= */
type Props = {
  currentEmail: string; // 表示のみ
  onSubmit: (values: EmailChangeValues) => void; // ← トーストは親(client.tsx)で
  onCancel?: () => void;
};

/* =========================
   本体
   ========================= */
export default function EmailChangeForm({
  currentEmail,
  onSubmit,
  onCancel,
}: Props) {
  const form = useForm<EmailChangeValues>({
    resolver: zodResolver(emailChangeSchema(currentEmail)),
    defaultValues: { newEmail: "" },
    mode: "onBlur",
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} data-testid="email-change-form">
        <Card className="w-full rounded-md">
          <CardHeader className="pb-2">
            <CardTitle>メールアドレスの変更</CardTitle>
            <CardDescription>
              新しいメールアドレス宛に認証URLを送信します。本人確認後に切り替わります。
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <CurrentEmailField value={currentEmail} />
            <NewEmailField />
          </CardContent>

          <CardFooter className="mt-2 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel ?? (() => history.back())}
              className="cursor-pointer"
              data-testid="cancel-btn"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="cursor-pointer"
              data-testid="submit-email-change"
            >
              認証メールを送る
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

/* =========================
   小さなフィールド群（同ファイル内）
   ========================= */

// 現在のメール（表示のみ）
function CurrentEmailField({ value }: { value: string }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-sm font-semibold">現在のメールアドレス</div>
      <div className="text-muted-foreground truncate text-sm" title={value}>
        {value}
      </div>
    </div>
  );
}

// 新しいメール
function NewEmailField() {
  return (
    <FormField
      name="newEmail"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">
            新しいメールアドレス&nbsp;*
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type="email"
              inputMode="email"
              placeholder="new@example.com"
              aria-label="新しいメールアドレス"
              autoComplete="off"
              data-testid="new-email"
            />
          </FormControl>
          <FormMessage data-testid="new-email-error" />
        </FormItem>
      )}
    />
  );
}
