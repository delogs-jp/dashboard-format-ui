/* =========================
 * src/app/(protected)/masters/roles/new/client.tsx
 * - UIのみ：成功トースト→一覧へ。配列は触らない。
 * ========================= */
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import RoleForm from "@/components/roles/role-form";
import type { RoleCreateValues } from "@/lib/roles/schema";

export default function NewRoleClient() {
  const router = useRouter();

  return (
    <RoleForm
      mode="create"
      onSubmit={(values: RoleCreateValues) => {
        // ★ UIのみ：配列へ push しない。成功扱いのトーストだけ表示。
        toast.success("ロールを作成しました", {
          description: [
            `コード: ${values.code}`,
            `表示名: ${values.displayName}`,
            `優先度: ${values.priority}`,
            `ダウンロード: ${values.canDownloadData ? "可" : "不可"}`,
            `編集: ${values.canEditData ? "可" : "不可"}`,
          ].join(" / "),
          duration: 3500,
        });

        // 成功したら一覧へ戻す
        router.push("/masters/roles");
      }}
      onCancel={() => history.back()}
    />
  );
}
