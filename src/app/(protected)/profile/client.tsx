// src/app/(protected)/profile/client.tsx
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ProfileForm from "@/components/profile/profile-form";
import { mockUser } from "@/lib/sidebar/mock-user";
import type { ProfileUpdateValues } from "@/lib/users/schema";

export default function ProfileClient() {
  const router = useRouter();

  // 実運用では認証セッションから本人情報を取得する想定
  const initial = {
    name: mockUser.name,
    email: mockUser.email,
    roleCode: mockUser.roleCode,
    currentAvatarUrl: mockUser.avatar,
  } as const;

  return (
    <ProfileForm
      initial={initial}
      onSubmit={(values: ProfileUpdateValues) => {
        // UIのみ：擬似成功でトースト（保存はサーバアクション回で実装）
        toast.success("プロフィールを更新しました", {
          description: `氏名: ${values.name}${values.avatarFile ? " / 画像選択あり" : ""}`,
          duration: 3500,
        });
        // 任意で戻すなら：router.push("/profile");
      }}
      onCancel={() => history.back()}
      onNavigateEmail={() => router.push("/profile/email")}
      onNavigatePassword={() => router.push("/profile/password")}
    />
  );
}
