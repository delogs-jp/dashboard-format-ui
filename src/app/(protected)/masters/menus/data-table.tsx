/* =======================================================
   src/app/(protected)/masters/menus/data-table.tsx
   ======================================================= */
"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { MenuRecord } from "@/lib/sidebar/menu.schema";
import type { StatusFilter } from "./columns";
import { getMenus, swapOrder } from "@/lib/sidebar/menu.mock";

function orderHierarchically(list: MenuRecord[]): MenuRecord[] {
  // parentId -> children[] の索引を作る（order順で保持）
  const byParent = new Map<string | null, MenuRecord[]>();
  for (const r of list) {
    const key = r.parentId ?? null;
    const arr = byParent.get(key) ?? [];
    arr.push(r);
    byParent.set(key, arr);
  }
  for (const [, arr] of byParent) {
    arr.sort((a, b) => a.order - b.order);
  }

  const out: MenuRecord[] = [];
  const walk = (parentId: string | null) => {
    const children = byParent.get(parentId) ?? [];
    for (const c of children) {
      out.push(c);
      walk(c.displayId); // 孫以降も辿る（最大3層想定）
    }
  };
  walk(null);
  return out;
}

/** 深さ（0/1/2）を計算するユーティリティ（既存） */
function calcDepthMap(rows: MenuRecord[]): Map<string, number> {
  const parentById = new Map<string, string | null>();
  rows.forEach((r) => parentById.set(r.displayId, r.parentId));

  const depthById = new Map<string, number>();
  const depthOf = (id: string | null | undefined): number => {
    if (!id) return 0; // ← ルートは 0 にする
    if (depthById.has(id)) return depthById.get(id)!;
    const p = parentById.get(id);
    const d = p ? 1 + depthOf(p) : 0; // ← 親がいれば +1、なければ 0
    depthById.set(id, d);
    return d;
  };

  rows.forEach((r) => depthOf(r.displayId));
  return depthById;
}

/** 兄弟内の ↑↓ 可否を付与（既存） */
function withMoveFlags(rows: MenuRecord[]) {
  const byParent = new Map<string | null, MenuRecord[]>();
  rows.forEach((r) => {
    const key = r.parentId ?? null;
    const arr = byParent.get(key) ?? [];
    arr.push(r);
    byParent.set(key, arr);
  });
  const flags = new Map<string, { canUp: boolean; canDown: boolean }>();
  for (const [, arr] of byParent) {
    arr
      .slice()
      .sort((a, b) => a.order - b.order)
      .forEach((r, i, list) => {
        flags.set(r.displayId, {
          canUp: i > 0,
          canDown: i < list.length - 1,
        });
      });
  }
  return rows.map((r) => ({
    ...r,
    ...(flags.get(r.displayId) ?? { canUp: false, canDown: false }),
  }));
}

type Props<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: MenuRecord[]; // SSR 初期データ
  newPath: string;
};

export default function MenusDataTable<TData extends MenuRecord>({
  columns,
  data,
  newPath,
}: Props<TData>) {
  const router = useRouter();

  // 初期データを階層順に整列してからセット
  const [rows, setRows] = React.useState<MenuRecord[]>(
    orderHierarchically(data),
  );

  // UI 状態
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("ALL");

  // ① フィルタを復活（並びは rows のまま＝階層順を維持）
  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      const passQ =
        !needle ||
        `${r.displayId} ${r.title} ${r.href ?? ""}`
          .toLowerCase()
          .includes(needle);
      const passStatus =
        status === "ALL" ||
        (status === "ACTIVE" ? r.isActive === true : r.isActive === false);
      return passQ && passStatus;
    });
  }, [rows, q, status]);

  // ② 深さ＆↑↓可否は filtered を入力にする（順序は rows と同じまま）
  const enriched = React.useMemo(() => {
    const depthMap = calcDepthMap(rows); // 深さ計算は全体の親子関係でOK
    const withDepth = filtered.map((r) => ({
      ...r,
      depth: Math.min(depthMap.get(r.displayId) ?? 0, 2),
    }));
    return withMoveFlags(withDepth);
  }, [rows, filtered]);

  // 並び替え
  const handleMoveUp = (id: string) => {
    swapOrder(id, "up"); // ストア更新
    setRows(orderHierarchically(getMenus())); // ★ 階層順で再整列
    router.refresh();
  };

  const handleMoveDown = (id: string) => {
    swapOrder(id, "down");
    setRows(orderHierarchically(getMenus())); // ★
    router.refresh();
  };
  // ★ 並び替えモデルを使わない（ストア順＝表示順）
  const table = useReactTable({
    data: enriched as unknown as TData[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // ✅ 初期ページサイズを30に
    initialState: { pagination: { pageIndex: 0, pageSize: 30 } },
    // コールバックを meta に載せる（型は table-core の宣言マージで拡張済み）
    meta: {
      onMoveUp: handleMoveUp,
      onMoveDown: handleMoveDown,
    },
  });

  return (
    <div className="space-y-3">
      {/* 検索/フィルタ */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          name="filter-q"
          data-testid="filter-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="表示ID・タイトル・Pathで検索"
          className="w-[260px] basis-full text-sm md:basis-auto"
          aria-label="検索キーワード"
        />

        <Select
          value={status}
          onValueChange={(v) => setStatus(v as StatusFilter)}
          name="filter-status"
        >
          <SelectTrigger className="w-auto" data-testid="filter-status">
            <SelectValue placeholder="状態" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">
              <span className="text-muted-foreground">すべての状態</span>
            </SelectItem>
            <SelectItem value="ACTIVE">有効のみ</SelectItem>
            <SelectItem value="INACTIVE">無効のみ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm" data-testid="count">
          表示件数： {filtered.length} 件
        </div>
        <Button asChild>
          <Link href={newPath}>新規登録</Link>
        </Button>
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto rounded-md border pb-1">
        <Table data-testid="menus-table" className="w-full">
          <TableHeader className="bg-muted/50 text-xs">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.column.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-testid={`row-${(row.original as MenuRecord).displayId}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground py-10 text-center text-sm"
                >
                  条件に一致するメニューが見つかりませんでした。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ページング */}
      <div className="flex items-center justify-end gap-2">
        <span className="text-muted-foreground text-sm">
          Page {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount() || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          data-testid="page-prev"
          className="cursor-pointer"
        >
          前へ
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          data-testid="page-next"
          className="cursor-pointer"
        >
          次へ
        </Button>
      </div>
    </div>
  );
}
