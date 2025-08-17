// src/app/(protected)/users/data-table.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
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

import type { MockUser, RoleOption } from "@/lib/users/mock";
import type { RoleFilter, StatusFilter } from "./columns";

type Props<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  roleOptions: RoleOption[];
};

export default function DataTable<TData extends MockUser>({
  columns,
  data,
  roleOptions,
}: Props<TData>) {
  // 検索/フィルタUIの状態
  const [q, setQ] = React.useState("");
  const [role, setRole] = React.useState<RoleFilter>("ALL");
  const [status, setStatus] = React.useState<StatusFilter>("ALL");
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "displayId", desc: false },
  ]);

  // ❶ ここで前処理フィルタ（文字列検索・ロール・状態）
  const filteredData = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (data as MockUser[]).filter((u) => {
      const passQ =
        !needle ||
        `${u.displayId} ${u.name} ${u.email}`.toLowerCase().includes(needle);

      const passRole = role === "ALL" || u.roleCode === role;

      const passStatus =
        status === "ALL" ||
        (status === "ACTIVE" ? u.isActive === true : u.isActive === false);

      return passQ && passRole && passStatus;
    }) as unknown as TData[];
  }, [data, q, role, status]);

  const table = useReactTable({
    data: filteredData, // ❷ フィルタ済みデータを渡す
    columns,
    state: { sorting }, // ❸ フィルタ関連の state は渡さない
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
          placeholder="氏名・メール・表示IDで検索"
          className="w-[192px] basis-full text-sm md:basis-auto"
          aria-label="検索キーワード"
        />

        <Select
          value={role}
          onValueChange={(v) => setRole(v as RoleFilter)}
          name="filter-role"
        >
          <SelectTrigger className="w-auto" data-testid="filter-role">
            <SelectValue placeholder="ロール" />
          </SelectTrigger>
          <SelectContent className="text-xs">
            <SelectItem value="ALL">
              <span className="text-muted-foreground">すべてのロール</span>
            </SelectItem>
            {roleOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
          <Link href="/users/new">新規登録</Link>
        </Button>
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto rounded-md border pb-1">
        <Table data-testid="users-table" className="w-full">
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
                  data-testid={`row-${(row.original as MockUser).displayId}`}
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
                  条件に一致するユーザが見つかりませんでした。
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
