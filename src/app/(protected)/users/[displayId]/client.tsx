// src/app/(protected)/users/[displayId]/client.tsx
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import UserForm, { type RoleOption } from "@/components/users/user-form";
import type { UserUpdateValues } from "@/lib/users/schema";
import { markDeleted } from "@/lib/users/mock";

type Props = {
  initialValues: UserUpdateValues;
  roleOptions: RoleOption[];
  accountCode: string;
};

export default function EditUserClient({
  initialValues,
  roleOptions,
  accountCode,
}: Props) {
  const router = useRouter();
  return (
    <UserForm
      mode="edit"
      initialValues={initialValues}
      roleOptions={roleOptions}
      onSubmit={(values) => {
        // UIのみ：成功扱いでトースト
        toast.success("ユーザを更新しました", {
          description: `ID: ${values.displayId} / ${values.email} / ロール: ${values.roleCode} / 有効: ${values.isActive ? "ON" : "OFF"}`,
          duration: 3500,
        });
        // 例：router.push(`/users/${values.displayId}`) などは一覧/詳細実装後に
      }}
      onCancel={() => history.back()}
      onDelete={() => {
        const ok = markDeleted(accountCode, initialValues.displayId);
        if (ok) {
          toast.success("ユーザを論理削除しました", {
            description: `ID: ${initialValues.displayId}`,
          });
          router.push("/users");
        } else {
          toast.error("削除に失敗しました");
        }
      }}
    />
  );
}
