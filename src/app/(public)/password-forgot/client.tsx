// src/app/(public)/password-forgot/client.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import PasswordForgotForm from "@/components/login/password-forgot-form";

export default function PasswordForgotClient() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (submitted) return; // 二重送信ガード（念のため）
    setLoading(true);
    try {
      // 将来: Server Action に置換
      await new Promise((r) => setTimeout(r, 700));
      setSubmitted(true);
      toast.success("依頼を受け付けました。登録メールをご確認ください。");
    } catch {
      // エラー時も秘匿（受付メッセージは同一）
      setSubmitted(true);
      toast.success("依頼を受け付けました。登録メールをご確認ください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PasswordForgotForm
      onSubmit={handleSubmit}
      loading={loading}
      submitted={submitted}
      onCancel={() => history.back()}
    />
  );
}
