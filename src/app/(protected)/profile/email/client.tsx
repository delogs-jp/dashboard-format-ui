// src/app/(protected)/profile/email/client.tsx
"use client";
import { useRouter } from "next/navigation";

import EmailChangeForm from "@/components/profile/email-change-form";
import { mockUser } from "@/lib/sidebar/mock-user";
import { toast } from "sonner";
import type { EmailChangeValues } from "@/lib/users/schema";

export default function EmailChangeClient() {
  const router = useRouter();
  // 実運用ではセッションから本人のメールを取得
  return (
    <EmailChangeForm
      currentEmail={mockUser.email}
      onSubmit={(values: EmailChangeValues) => {
        // トースト通知
        toast.success("認証メールを送信しました", {
          description: `送信先：${values.newEmail}`,
          duration: 3500,
        });
        // 成功したら、一覧ページへ遷移（まだ遷移先が未作成なので一旦コメントアウト
        router.push("/profile");
      }}
      onCancel={() => history.back()}
    />
  );
}
