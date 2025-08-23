// src/app/(protected)/users/new/client.tsx
"use client";
import { useRouter } from "next/navigation";

import UserForm, { type RoleOption } from "@/components/users/user-form";
import { composeCreatePayload } from "@/lib/users/mock";
import { toast } from "sonner";

type Props = {
  roleOptions: RoleOption[];
  accountCode: string;
};

export default function NewUserClient({ roleOptions, accountCode }: Props) {
  const router = useRouter();
  return (
    <UserForm
      mode="create"
      roleOptions={roleOptions}
      onSubmit={(values) => {
        // UIのみ：フォーム値 + accountCode を合成して擬似レコード生成
        const payload = composeCreatePayload(values, accountCode);
        // トースト通知
        toast.success("ユーザを作成しました", {
          description: `ID: ${payload.displayId} / ${payload.email} / ロール: ${payload.roleCode}`,
          duration: 3500,
        });
        // 成功したら、一覧ページへ遷移（まだ遷移先が未作成なので一旦コメントアウト
        router.push("/users");
      }}
      onCancel={() => history.back()}
    />
  );
}
