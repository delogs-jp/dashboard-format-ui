// src/app/(protected)/masters/roles/[displayId]/client.tsx
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import RoleForm from "@/components/roles/role-form";
import type { RoleUpdateValues } from "@/lib/roles/schema";

type Props = {
  initialValues: RoleUpdateValues;
};

export default function RoleEditClient({ initialValues }: Props) {
  const router = useRouter();

  return (
    <RoleForm
      mode="edit"
      initialValues={initialValues}
      onSubmit={(values: RoleUpdateValues) => {
        // UIのみ：成功扱い（実データは変更しない）
        toast.success("ロールを更新しました", {
          description: `ID: ${values.displayId} / ${values.code} / 優先度: ${values.priority} / 有効: ${values.isActive ? "ON" : "OFF"} / DL: ${values.canDownloadData ? "✔" : "✘"} / 編集: ${values.canEditData ? "✔" : "✘"}`,
          duration: 3500,
        });
        // 一覧へ戻す（設計上の戻り先を統一）
        router.push("/masters/roles");
      }}
      onCancel={() => history.back()}
      onDelete={() => {
        // UIのみ：成功扱い（実データは変更しない）
        toast.success("ロールを論理削除しました", {
          description: `ID: ${initialValues.displayId}`,
          duration: 3000,
        });
        router.push("/masters/roles");
      }}
    />
  );
}
