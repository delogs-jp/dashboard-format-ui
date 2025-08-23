// src/app/(protected)/profile/password/client.tsx（新規）
"use client";

import { useRouter } from "next/navigation";
import PasswordChangeForm from "@/components/profile/password-change-form";
import { toast } from "sonner";

export default function PasswordChangeClient() {
  const router = useRouter();

  return (
    <div className="max-w-xl p-4 pt-0">
      <PasswordChangeForm
        onSubmit={() => {
          // UIのみ：成功トースト → /profile へ遷移
          toast.success("パスワードを変更しました", {
            description: "次回ログインから新しいパスワードをご利用ください。",
            duration: 3500,
          });
          router.push("/profile");
        }}
        onCancel={() => history.back()}
      />
    </div>
  );
}
