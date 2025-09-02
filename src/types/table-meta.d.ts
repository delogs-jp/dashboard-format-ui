// src/types/table-meta.d.ts
import "@tanstack/table-core";

declare module "@tanstack/table-core" {
  interface TableMeta<TData extends RowData> {
    onMoveUp?: (id: string, _row?: TData) => void;
    onMoveDown?: (id: string, _row?: TData) => void;

    /** 依頼を「再発行済み」にする */
    onIssue?: (id: string, _row?: TData) => void | Promise<void>;
    /** 依頼を「拒否」にする */
    onReject?: (id: string, _row?: TData) => void | Promise<void>;
  }
}

export {};
