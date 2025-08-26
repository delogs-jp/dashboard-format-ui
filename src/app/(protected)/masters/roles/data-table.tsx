/* ======================================================
   src/app/(protected)/masters/roles/data-table.tsx
   ====================================================== */
"use client";

import * as React from "react";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
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
import type { Role } from "@/lib/roles/schema";
import type { StatusFilter } from "./columns";

type Props<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  /** 新規作成への遷移先（例：/masters/roles/new） */
  newPath: string;
};

export default function RolesDataTable<TData extends Role>({
  columns,
  data,
  newPath,
}: Props<TData>) {
  // 検索/フィルタUIの状態
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("ALL");
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "priority", desc: true }, // 優先度の高い順で初期表示
  ]);

  // 前処理フィルタ（文字列検索・状態）
  const filteredData = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (data as Role[]).filter((r) => {
      const passQ =
        !needle ||
        `${r.displayId} ${r.code} ${r.displayName}`
          .toLowerCase()
          .includes(needle);
      const passStatus =
        status === "ALL" ||
        (status === "ACTIVE" ? r.isActive === true : r.isActive === false);
      return passQ && passStatus;
    }) as unknown as TData[];
  }, [data, q, status]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  const filteredCount = filteredData.length;

  return (
    <div className="space-y-3">
      {/* 検索/フィルタ */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          name="filter-q"
          data-testid="filter-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="表示ID・コード・表示名で検索"
          className="w-[240px] basis-full text-sm md:basis-auto"
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
          表示件数： {filteredCount} 件
        </div>
        <Button asChild>
          <Link href={newPath}>新規登録</Link>
        </Button>
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto rounded-md border pb-1">
        <Table data-testid="roles-table" className="w-full">
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
                  data-testid={`row-${(row.original as Role).displayId}`}
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
                  条件に一致するロールが見つかりませんでした。
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
