/* ===============================================
   src/app/(protected)/masters/menus/columns.tsx
   =============================================== */
"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, SquarePen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { MenuRecord, MatchMode } from "@/lib/sidebar/menu.schema";

/** 状態フィルタ型（列の filterFn と揃える） */
export type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

/** インデント表示（0/1/2） */
// 孫レベルを強めに、子は中くらいに
function IndentedTitle({ title, depth }: { title: string; depth: number }) {
  const cls = depth === 0 ? "" : depth === 1 ? "pl-4" : "pl-10";
  return <div className={cls}>{title}</div>;
}

/** 一致方法の短縮バッジ表示 */
function MatchBadge({ mode }: { mode: MatchMode | undefined }) {
  const m = mode ?? "prefix";
  if (m === "exact") return <Badge variant="secondary">exact</Badge>;
  if (m === "regex") return <Badge variant="outline">regex</Badge>;
  return <Badge>prefix</Badge>;
}

export const columns: ColumnDef<
  MenuRecord & { depth: number; canUp: boolean; canDown: boolean }
>[] = [
  {
    id: "actions",
    header: "操作",
    size: 40,
    enableResizing: false,
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
            <Link href={`/masters/menus/${row.original.displayId}`}>
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
    size: 80,
    enableResizing: false,
    cell: ({ row }) => (
      <span className="font-mono">{row.original.displayId}</span>
    ),
  },
  {
    accessorKey: "title",
    header: "タイトル",
    cell: ({ row }) => (
      <IndentedTitle title={row.original.title} depth={row.original.depth} />
    ),
  },
  {
    accessorKey: "href",
    header: "Path",
    cell: ({ row }) =>
      row.original.isSection ? (
        <span className="text-muted-foreground">—</span>
      ) : (
        <span className="font-mono">{row.original.href}</span>
      ),
  },
  {
    id: "match",
    header: "一致",
    size: 80,
    enableResizing: false,
    enableSorting: false,
    cell: ({ row }) =>
      row.original.isSection ? (
        <span className="text-muted-foreground">—</span>
      ) : (
        <MatchBadge mode={row.original.match} />
      ),
  },
  {
    accessorKey: "minPriority",
    header: "しきい値",
    size: 80,
    enableResizing: false,
    cell: ({ row }) =>
      row.original.minPriority === undefined ? (
        <span className="text-muted-foreground">（全員）</span>
      ) : (
        <span className="font-mono tabular-nums">
          {row.original.minPriority}
        </span>
      ),
    sortingFn: (a, b, id) => {
      const av = a.getValue(id) as number | undefined;
      const bv = b.getValue(id) as number | undefined;
      if (av === undefined && bv === undefined) return 0;
      if (av === undefined) return -1; // 未設定（全員）を小さく
      if (bv === undefined) return 1;
      return av === bv ? 0 : av > bv ? 1 : -1;
    },
  },
  {
    id: "order",
    header: "順序",
    size: 90,
    enableResizing: false,
    enableSorting: false,
    cell: ({ row, table }) => {
      const { canUp, canDown } = row.original;
      const onUp = table.options.meta?.onMoveUp;
      const onDown = table.options.meta?.onMoveDown;
      return (
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="outline"
            className="size-8 cursor-pointer"
            onClick={() => onUp?.(row.original.displayId)}
            disabled={!canUp}
            aria-label="ひとつ上へ"
          >
            <ArrowUp />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="size-8 cursor-pointer"
            onClick={() => onDown?.(row.original.displayId)}
            disabled={!canDown}
            aria-label="ひとつ下へ"
          >
            <ArrowDown />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "状態",
    size: 70,
    enableResizing: false,
    cell: ({ row }) =>
      row.original.isActive ? (
        <Badge data-testid="badge-active">有効</Badge>
      ) : (
        <Badge variant="outline" data-testid="badge-inactive">
          無効
        </Badge>
      ),
    filterFn: (row, _id, value: StatusFilter) =>
      value === "ALL"
        ? true
        : value === "ACTIVE"
          ? row.original.isActive
          : !row.original.isActive,
  },
  // 検索用の hidden 列（displayId / title / href を結合）
  {
    id: "q",
    accessorFn: (r) =>
      `${r.displayId} ${r.title} ${r.href ?? ""}`.toLowerCase(),
    enableHiding: true,
    enableSorting: false,
    enableResizing: false,
    size: 0,
    header: () => null,
    cell: () => null,
  },
];
