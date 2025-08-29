// src/types/table-meta.d.ts
import "@tanstack/table-core";

declare module "@tanstack/table-core" {
  interface TableMeta<TData extends RowData> {
    onMoveUp?: (id: string, _row?: TData) => void;
    onMoveDown?: (id: string, _row?: TData) => void;
  }
}

export {};
