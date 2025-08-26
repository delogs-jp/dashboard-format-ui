// src/app/(protected)/users/columns.tsx
"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SquarePen } from "lucide-react";
import type { MockUser } from "@/lib/users/mock";
import { getRoles } from "@/lib/roles/mock";

/** ロールの表示名と色を mock から集約 */
const roleInfoMap: Record<string, { label: string; color: string }> =
  Object.fromEntries(
    getRoles().map((r) => [
      r.code,
      { label: r.displayName, color: r.badgeColor },
    ]),
  );

/** DataTable 側のフィルタ値型（列の filterFn と揃える） */
export type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";
export type RoleFilter = "ALL" | string; // コードを動的取得するため string に緩める

export const columns: ColumnDef<MockUser>[] = [
  {
    id: "actions",
    header: "操作",
    enableResizing: false,
    size: 40,
    enableSorting: false,
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            size="icon"
            variant="outline"
            data-testid={`edit-${row.original.displayId}`}
            className="size-8 cursor-pointer"
          >
            <Link href={`/users/${row.original.displayId}`}>
              <SquarePen />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>参照・編集</p>
        </TooltipContent>
      </Tooltip>
    ),
  },

  {
    accessorKey: "displayId",
    header: "表示ID",
    cell: ({ row }) => (
      <span className="font-mono">{row.original.displayId}</span>
    ),
  },
  { accessorKey: "name", header: "氏名" },
  { accessorKey: "email", header: "メール" },
  {
    accessorKey: "roleCode",
    header: "ロール",
    enableResizing: false,
    size: 56,
    cell: ({ row }) => {
      const info = roleInfoMap[row.original.roleCode];
      const label = info?.label ?? row.original.roleCode;
      const style = info
        ? { backgroundColor: info.color, color: "#fff", border: "none" }
        : undefined;
      return (
        <Badge variant="secondary" style={style} title={row.original.roleCode}>
          {label}
        </Badge>
      );
    }, // ロールフィルタ（"ALL"なら素通し）
    filterFn: (row, _id, value: RoleFilter) =>
      value === "ALL" ? true : row.original.roleCode === value,
  },

  {
    accessorKey: "isActive",
    header: "状態",
    enableResizing: false,
    size: 50,
    cell: ({ row }) =>
      row.original.isActive ? (
        <Badge data-testid="badge-active">有効</Badge>
      ) : (
        <Badge variant="outline" data-testid="badge-inactive">
          無効
        </Badge>
      ),
    // 状態フィルタ
    filterFn: (row, _id, value: StatusFilter) =>
      value === "ALL"
        ? true
        : value === "ACTIVE"
          ? row.original.isActive
          : !row.original.isActive,
  },
  // 検索用の hidden 列（displayId/name/email を結合）
  {
    id: "q",
    accessorFn: (row) =>
      `${row.displayId} ${row.name} ${row.email}`.toLowerCase(),
    enableHiding: true,
    enableSorting: false,
    enableResizing: false,
    size: 0,
    header: () => null,
    cell: () => null,
  },
];
