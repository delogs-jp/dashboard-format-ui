// src/components/profile/password-change-form.tsx（新規）
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  passwordChangeSchema,
  type PasswordChangeValues,
  PASSWORD_MIN,
} from "@/lib/users/schema";

import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

/* =========================
   公開インターフェース
   ========================= */
type Props = {
  onSubmit: (values: PasswordChangeValues) => void; // ← client.tsx でトースト＆遷移
  onCancel?: () => void;
};

/* =========================
   本体
   ========================= */
export default function PasswordChangeForm({ onSubmit, onCancel }: Props) {
  const form = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
    mode: "onBlur",
  });

  const handleSubmit = form.handleSubmit((values) => {
    // ※ このコンポーネント内ではトーストしない（/profile/email と同じ方針）
    onSubmit(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} data-testid="password-change-form">
        <Card className="w-full rounded-md">
          <CardContent className="space-y-6 pt-4">
            <CurrentPasswordField />
            <NewPasswordField />
          </CardContent>

          <CardFooter className="mt-2 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="cursor-pointer"
              data-testid="cancel-btn"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={form.formState.isSubmitting}
              data-testid="submit-password"
            >
              変更する
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

// 現在のパスワード
function CurrentPasswordField() {
  const [visible, setVisible] = React.useState(false);

  return (
    <FormField
      name="currentPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">
            現在のパスワード&nbsp;*
          </FormLabel>
          <div className="flex items-start gap-2">
            <FormControl>
              <Input
                {...field}
                type={visible ? "text" : "password"}
                autoComplete="off"
                aria-label="現在のパスワード"
                data-testid="current-password"
              />
            </FormControl>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => setVisible((v) => !v)}
              aria-label={
                visible ? "パスワードを非表示にする" : "パスワードを表示する"
              }
              className="shrink-0 cursor-pointer"
              data-testid="current-password-toggle"
            >
              {visible ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>
          <FormMessage data-testid="current-password-error" />
        </FormItem>
      )}
    />
  );
}

// 新しいパスワード
function NewPasswordField() {
  const [visible, setVisible] = React.useState(false);

  return (
    <FormField
      name="newPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">
            新しいパスワード&nbsp;*
          </FormLabel>
          <div className="flex items-start gap-2">
            <FormControl>
              <Input
                {...field}
                type={visible ? "text" : "password"}
                autoComplete="off"
                placeholder={`${PASSWORD_MIN}文字以上（英大/小/数字を含む）`}
                aria-label="新しいパスワード"
                data-testid="new-password"
              />
            </FormControl>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => setVisible((v) => !v)}
              aria-label={
                visible ? "パスワードを非表示にする" : "パスワードを表示する"
              }
              className="shrink-0 cursor-pointer"
              data-testid="new-password-toggle"
            >
              {visible ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>
          <FormMessage data-testid="new-password-error" />
        </FormItem>
      )}
    />
  );
}
