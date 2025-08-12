"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/login/schema"; // ログインスキーマ
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      accountId: "",
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log("送信データ：", values);
    // ここにAPI連携を実装予定
    router.push("/dashboard");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-md space-y-4 pt-4 pb-10"
      >
        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>アカウントID</FormLabel>
              <FormControl>
                <Input
                  data-testid="accountId"
                  placeholder="CORP000123456"
                  autoFocus
                  {...field}
                />
              </FormControl>
              <FormMessage data-testid="accountId-error" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input
                  data-testid="email"
                  type="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage data-testid="email-error" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>パスワード</FormLabel>
              <div className="flex items-start gap-2">
                <FormControl>
                  <Input
                    {...field}
                    data-testid="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="半角英数字15文字以上"
                  />
                </FormControl>
                <Button
                  data-testid="password-toggle"
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword
                      ? "パスワードを非表示にする"
                      : "パスワードを表示する"
                  }
                  className="shrink-0 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
              <FormMessage data-testid="password-error" />
            </FormItem>
          )}
        />
        <Button
          data-testid="submit"
          type="submit"
          className="mt-4 w-full cursor-pointer"
        >
          ログイン
        </Button>
      </form>
    </Form>
  );
}
