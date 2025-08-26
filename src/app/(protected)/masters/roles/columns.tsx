/* ===========================================
   src/app/(protected)/masters/roles/columns.tsx
   =========================================== */
"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Role } from "@/lib/roles/schema";

/** 状態フィルタ型（列の filterFn と揃える） */
export type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

/** ✔ / ✘ を視覚＋SR両対応で出すユーティリティ */
function CheckX({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      aria-label={`${label}: ${ok ? "可" : "不可"}`}
      className={ok ? "text-foreground" : "text-muted-foreground"}
    >
      {ok ? "✔" : "✘"}
    </span>
  );
}

/** カラーセル（色チップ＋HEX） */
function ColorSwatch({ hex }: { hex: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden
        className="inline-block size-4 rounded-sm border"
        style={{ backgroundColor: hex }}
      />
      <span className="font-mono text-xs">{hex}</span>
    </div>
  );
}

export const columns: ColumnDef<Role>[] = [
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
            <Link href={`/masters/roles/${row.original.displayId}`}>
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
    size: 70,
    enableResizing: false,
    cell: ({ row }) => (
      <span className="font-mono">{row.original.displayId}</span>
    ),
  },
  {
    accessorKey: "isSystem",
    header: "種別",
    size: 70,
    enableResizing: false,
    cell: ({ row }) =>
      row.original.isSystem ? (
        <Badge variant="secondary">固定</Badge>
      ) : (
        <Badge>カスタム</Badge>
      ),
    // 種別で絞りたくなったら filterFn を追加予定
  },
  {
    accessorKey: "code",
    header: "コード",
    cell: ({ row }) => <span className="font-mono">{row.original.code}</span>,
  },
  { accessorKey: "displayName", header: "表示名" },
  {
    accessorKey: "priority",
    header: "優先度",
    size: 60,
    enableResizing: false,
    cell: ({ row }) => (
      <span className="font-mono tabular-nums">{row.original.priority}</span>
    ),
    sortingFn: (a, b, id) => {
      const av = Number(a.getValue(id));
      const bv = Number(b.getValue(id));
      return av === bv ? 0 : av > bv ? 1 : -1;
    },
  },
  {
    id: "canDownloadData",
    header: "DL",
    size: 40,
    enableResizing: false,
    enableSorting: false,
    cell: ({ row }) => (
      <CheckX ok={row.original.canDownloadData} label="データDL" />
    ),
  },
  {
    id: "canEditData",
    header: "編集",
    size: 40,
    enableResizing: false,
    enableSorting: false,
    cell: ({ row }) => <CheckX ok={row.original.canEditData} label="編集" />,
  },
  {
    accessorKey: "badgeColor",
    header: "バッジ色",
    enableSorting: false,
    size: 120,
    cell: ({ row }) => <ColorSwatch hex={row.original.badgeColor} />,
  },
  {
    accessorKey: "isActive",
    header: "状態",
    size: 60,
    enableResizing: false,
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
  // 検索用の hidden 列（displayId / code / displayName を結合）
  {
    id: "q",
    accessorFn: (r) =>
      `${r.displayId} ${r.code} ${r.displayName}`.toLowerCase(),
    enableHiding: true,
    enableSorting: false,
    enableResizing: false,
    size: 0,
    header: () => null,
    cell: () => null,
  },
];
