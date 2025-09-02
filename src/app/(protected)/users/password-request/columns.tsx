// src/app/(protected)/users/password-request/columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PasswordRequest } from "@/lib/users/password-request.mock";
import { getRoles } from "@/lib/roles/mock";

function fmt(d?: Date) {
  if (!d) return "-";
  return format(d, "yyyy/MM/dd HH:mm", { locale: ja });
}

const roleInfoMap: Record<string, { label: string; color: string }> =
  Object.fromEntries(
    getRoles().map((r) => [
      r.code,
      { label: r.displayName, color: r.badgeColor },
    ]),
  );

export const columns: ColumnDef<PasswordRequest>[] = [
  {
    accessorKey: "requestedAt",
    header: "依頼日時",
    cell: ({ row }) => fmt(row.original.requestedAt),
  },
  { accessorKey: "accountId", header: "アカウントID" },
  { accessorKey: "email", header: "メール" },
  { accessorKey: "userName", header: "ユーザ名" },
  {
    accessorKey: "userRole",
    header: "ユーザロール",
    cell: ({ row }) => {
      const role = row.original.userRole;
      if (role === "-") return "-";
      const info = roleInfoMap[role];
      const label = info?.label ?? role;
      const style = info
        ? { backgroundColor: info.color, color: "#fff", border: "none" }
        : undefined;
      return (
        <Badge variant="secondary" style={style} title={role}>
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "状態",
    cell: ({ row }) => {
      const s = row.original.status;
      if (s === "ISSUED") return <Badge>再発行済み</Badge>;
      if (s === "REJECTED") return <Badge variant="destructive">拒否</Badge>;
      return <Badge variant="outline">未処理</Badge>;
    },
  },
  {
    accessorKey: "processedAt",
    header: "処理日時",
    cell: ({ row }) => fmt(row.original.processedAt),
  },
  { accessorKey: "processedBy", header: "処理者" },

  {
    id: "actions",
    header: "操作",
    enableSorting: false,
    enableResizing: false,
    cell: ({ row, table }) => {
      const r = row.original;
      const disabled = r.status !== "PENDING"; // 処理済みは操作不可
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            disabled={disabled}
            onClick={() => table.options.meta?.onIssue?.(r.id, r)}
            data-testid={`issue-btn-${r.id}`}
            className="cursor-pointer"
          >
            再発行
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={disabled}
            onClick={() => table.options.meta?.onReject?.(r.id, r)}
            data-testid={`reject-btn-${r.id}`}
            className="cursor-pointer"
          >
            拒否
          </Button>
        </div>
      );
    },
  },

  // 検索用 hidden 列
  {
    id: "q",
    accessorFn: (row) =>
      `${row.accountId} ${row.email} ${row.userName} ${row.note ?? ""}`.toLowerCase(),
    enableHiding: true,
    enableSorting: false,
    header: () => null,
    cell: () => null,
  },
];
