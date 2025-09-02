// src/app/(protected)/users/password-request/data-table.tsx
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
import { toast } from "sonner";

import type { PasswordRequest } from "@/lib/users/password-request.mock";
import { markIssued, markRejected } from "@/lib/users/password-request.mock";
import type { RoleOption } from "@/lib/users/mock";

type ReqStatusFilter = "ALL" | "PENDING" | "ISSUED" | "REJECTED";
type RoleFilter = "ALL" | string;

type Props<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  roleOptions: RoleOption[];
};

export default function DataTable<TData extends PasswordRequest>({
  columns,
  data,
  roleOptions,
}: Props<TData>) {
  const [tableData, setTableData] = React.useState<PasswordRequest[]>(
    () => data as PasswordRequest[],
  );

  const [q, setQ] = React.useState("");
  const [role, setRole] = React.useState<RoleFilter>("ALL");
  const [status, setStatus] = React.useState<ReqStatusFilter>("ALL");
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "requestedAt", desc: true },
  ]);

  const filteredData = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return tableData.filter((r) => {
      const passQ =
        !needle ||
        `${r.accountId} ${r.email} ${r.userName} ${r.note ?? ""}`
          .toLowerCase()
          .includes(needle);
      const passRole = role === "ALL" || r.userRole === role;
      const passStatus = status === "ALL" || r.status === status;
      return passQ && passRole && passStatus;
    }) as unknown as TData[];
  }, [tableData, q, role, status]);

  const onIssue = React.useCallback(
    async (id: string) => {
      // 将来: Server Action に置換
      markIssued(id, "Admin User");
      setTableData((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "ISSUED",
                processedAt: new Date(),
                processedBy: "Admin User",
              }
            : r,
        ),
      );
      toast.success("再発行を実行しました。", { duration: 2400 });
    },
    [setTableData],
  );

  const onReject = React.useCallback(
    async (id: string) => {
      // 将来: Server Action に置換（理由入力などは別UIで拡張可能）
      markRejected(id, "Admin User");
      setTableData((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "REJECTED",
                processedAt: new Date(),
                processedBy: "Admin User",
              }
            : r,
        ),
      );
      toast.message("依頼を拒否しました。", { duration: 2400 });
    },
    [setTableData],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    meta: { onIssue, onReject }, // ← 追加
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
          placeholder="アカウントID・メール・氏名・備考で検索"
          className="w-[220px] basis-full text-sm md:basis-auto"
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
          onValueChange={(v) => setStatus(v as ReqStatusFilter)}
          name="filter-status"
        >
          <SelectTrigger className="w-auto" data-testid="filter-status">
            <SelectValue placeholder="状態" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">
              <span className="text-muted-foreground">すべての状態</span>
            </SelectItem>
            <SelectItem value="PENDING">未処理のみ</SelectItem>
            <SelectItem value="ISSUED">再発行済みのみ</SelectItem>
            <SelectItem value="REJECTED">拒否のみ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm" data-testid="count">
          表示件数： {filteredCount} 件
        </div>
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto rounded-md border pb-1">
        <Table data-testid="requests-table" className="w-full">
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
                  data-testid={`row-${(row.original as PasswordRequest).id}`}
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
                  条件に一致する依頼が見つかりませんでした。
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
