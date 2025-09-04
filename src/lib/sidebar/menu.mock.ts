// src/lib/sidebar/menu.mock.ts
// 初期データ（UI唯一ソース）：将来はAPIレスポンスに置き換え
import type { MenuRecord } from "./menu.schema";

export const INITIAL_MENU_RECORDS: MenuRecord[] = [
  // ───────── ルート階層 ─────────
  {
    displayId: "M00000001",
    parentId: null,
    order: 0,
    title: "ダッシュボード",
    href: undefined, // 見出し
    iconName: "SquareTerminal", // 変換レイヤで LucideIcon に解決
    match: "prefix",
    pattern: undefined,
    minPriority: undefined, // 未選択＝全員表示
    isSection: true,
    isActive: true,
  },
  {
    displayId: "M00000002",
    parentId: null,
    order: 1,
    title: "ドキュメント",
    href: undefined, // 見出し
    iconName: "BookOpen",
    match: "prefix",
    pattern: undefined,
    minPriority: undefined,
    isSection: true,
    isActive: true,
  },
  {
    displayId: "M00000003",
    parentId: null,
    order: 2,
    title: "設定",
    href: undefined, // 見出し
    iconName: "Settings2",
    match: "prefix",
    pattern: undefined,
    minPriority: 100, // 親minPriorityは子に継承（仕様：上書き不可）
    isSection: true,
    isActive: true,
  },

  // ───────── ダッシュボード配下 ─────────
  {
    displayId: "M00000004",
    parentId: "M00000001",
    order: 0,
    title: "概要",
    href: "/dashboard",
    iconName: undefined,
    match: "exact",
    pattern: undefined,
    minPriority: undefined,
    isSection: false,
    isActive: true,
  },
  // ───────── ドキュメント配下 ─────────
  {
    displayId: "M00000007",
    parentId: "M00000002",
    order: 0,
    title: "チュートリアル",
    href: "/tutorial",
    iconName: undefined,
    match: "exact",
    pattern: undefined,
    minPriority: undefined,
    isSection: false,
    isActive: true,
  },
  {
    displayId: "M00000008",
    parentId: "M00000002",
    order: 1,
    title: "更新履歴",
    href: "/changelog",
    iconName: undefined,
    match: "exact",
    pattern: undefined,
    minPriority: undefined,
    isSection: false,
    isActive: true,
  },

  // ───────── 設定配下 ─────────
  {
    displayId: "M00000010",
    parentId: "M00000003",
    order: 0,
    title: "マスタ管理",
    href: "/masters",
    iconName: undefined,
    match: "prefix",
    pattern: undefined,
    minPriority: undefined,
    isSection: false,
    isActive: true,
  },
  {
    displayId: "M00000011",
    parentId: "M00000003",
    order: 1,
    title: "ユーザ管理",
    href: "/users",
    iconName: undefined,
    match: "prefix",
    pattern: undefined,
    minPriority: undefined,
    isSection: false,
    isActive: true,
  },

  // ───────── マスタ管理の子 ─────────
  {
    displayId: "M00000012",
    parentId: "M00000010",
    order: 0,
    title: "マスタ一覧",
    href: "/masters",
    iconName: undefined,
    match: "exact",
    pattern: undefined,
    minPriority: undefined,
    isSection: false,
    isActive: true,
  },
  {
    displayId: "M00000013",
    parentId: "M00000010",
    order: 1,
    title: "ロール管理",
    href: "/masters/roles",
    iconName: undefined,
    match: "prefix",
    pattern: undefined,
    minPriority: undefined,
    isSection: false,
    isActive: true,
  },
  {
    displayId: "M00000014",
    parentId: "M00000010",
    order: 2,
    title: "メニュー管理",
    href: "/masters/menus",
    iconName: undefined,
    match: "prefix",
    pattern: undefined,
    minPriority: undefined,
    isSection: false,
    isActive: true,
  },

  // ───────── ユーザ管理の子 ─────────
  {
    displayId: "M00000015",
    parentId: "M00000011",
    order: 0,
    title: "一覧",
    href: "/users",
    iconName: undefined,
    match: "exact",
    pattern: undefined,
    minPriority: undefined,
    isSection: false,
    isActive: true,
  },
  {
    displayId: "M00000016",
    parentId: "M00000011",
    order: 1,
    title: "新規登録",
    href: "/users/new",
    iconName: undefined,
    match: "exact",
    pattern: undefined,
    minPriority: undefined,
    isSection: false,
    isActive: true,
  },
  // 追加
  {
    displayId: "M00000017",
    parentId: "M00000011",
    order: 1,
    title: "パスワード再発行",
    href: "/users/password-request",
    iconName: undefined,
    match: "exact",
    pattern: undefined,
    minPriority: undefined,
    isSection: false,
    isActive: true,
  },
];

// ストア本体とCRUD・並び替え・参照ユーティリティ
// ミュータブルなストア（UI操作で更新）
let store: MenuRecord[] = INITIAL_MENU_RECORDS.map((r) => ({ ...r }));

/** 参照：一覧（親→子→孫の順で安定ソート） */
export function getMenus(): MenuRecord[] {
  return store.slice().sort((a, b) => {
    const pa = a.parentId ?? "";
    const pb = b.parentId ?? "";
    return pa === pb ? a.order - b.order : pa.localeCompare(pb);
  });
}

/** 参照：1件取得 */
export function getMenuByDisplayId(displayId: string): MenuRecord | undefined {
  return store.find((r) => r.displayId === displayId);
}

/** 参照：子ノード一覧 */
export function getChildren(parentId: string | null): MenuRecord[] {
  return getMenus().filter((r) => r.parentId === parentId);
}

/** 参照：子が存在するか（削除ガード用） */
export function hasChildren(displayId: string): boolean {
  return store.some((r) => r.parentId === displayId);
}

/** 採番：次の表示ID（M00000001 形式） */
export function nextDisplayId(): string {
  const max = store
    .map((r) => Number(r.displayId.slice(1)))
    .reduce((acc, n) => Math.max(acc, n), 0);
  return `M${String(max + 1).padStart(8, "0")}`;
}

/** 追加：兄弟末尾に追加し order を付与 */
export function addMenu(
  input: Omit<MenuRecord, "displayId" | "order">,
): MenuRecord {
  const displayId = nextDisplayId();
  const siblings = store.filter((r) => r.parentId === input.parentId);
  const rec: MenuRecord = { ...input, displayId, order: siblings.length };
  store.push(rec);
  normalizeOrder(store);
  return rec;
}

/** 更新：存在すれば置換（親変更も可）。整合のため order 正規化 */
export function updateMenu(updated: MenuRecord): boolean {
  const i = store.findIndex((r) => r.displayId === updated.displayId);
  if (i === -1) return false;
  store[i] = { ...updated };
  normalizeOrder(store);
  return true;
}

/** 削除：子がいれば不可（UI側で警告表示を想定） */
export function deleteMenu(displayId: string): boolean {
  if (hasChildren(displayId)) return false;
  const i = store.findIndex((r) => r.displayId === displayId);
  if (i === -1) return false;
  store.splice(i, 1);
  normalizeOrder(store);
  return true;
}

/** 並び替え：兄弟内で ↑↓ を入れ替え */
export function swapOrder(displayId: string, dir: "up" | "down"): boolean {
  const me = getMenuByDisplayId(displayId);
  if (!me) return false;

  const siblings = store
    .filter((r) => r.parentId === me.parentId)
    .sort((a, b) => a.order - b.order);

  const idx = siblings.findIndex((s) => s.displayId === me.displayId);
  const targetIdx = dir === "up" ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= siblings.length) return false;

  const a = siblings[idx];
  const b = siblings[targetIdx];
  const tmp = a.order;
  a.order = b.order;
  b.order = tmp;

  normalizeOrder(store);
  return true;
}

/** 兄弟ごとに order を 0..N へ正規化（欠番防止） */
export function normalizeOrder(list: MenuRecord[]): void {
  const byParent = new Map<string | null, MenuRecord[]>();
  for (const r of list) {
    const key = r.parentId ?? null;
    const arr = byParent.get(key) ?? [];
    arr.push(r);
    byParent.set(key, arr);
  }
  for (const [, arr] of byParent) {
    arr.sort((a, b) => a.order - b.order);
    arr.forEach((r, i) => (r.order = i));
  }
}

/** リセット（テストや開発用） */
export function resetMenus(next?: MenuRecord[]): void {
  store = next
    ? next.map((r) => ({ ...r }))
    : INITIAL_MENU_RECORDS.map((r) => ({ ...r }));
}

export type ParentOption = { value: string | null; label: string };

/**
 * 親セレクト用の候補を返す
 * - ルート: (ルート) を先頭で固定（value=null）
 * - それ以外: “各親の直下の子” だけを親の直後に並べる（孫は除外）
 * - 表示: 親はそのまま、子はインデント付き（例：　└ ラベル）
 */
export function getParentOptions(): ParentOption[] {
  const opts: ParentOption[] = [{ value: null, label: "(ルート)" }];
  const all = getMenus(); // parentId→order で安定している
  // 親IDごとにグルーピング
  const byParent = new Map<string | null, MenuRecord[]>();
  for (const r of all) {
    const key = r.parentId ?? null;
    const arr = byParent.get(key) ?? [];
    arr.push(r);
    byParent.set(key, arr);
  }
  // 親 → 直下の子（孫は出さない）
  const roots = byParent.get(null) ?? [];
  for (const parent of roots) {
    opts.push({ value: parent.displayId, label: parent.title });
    const children = byParent.get(parent.displayId) ?? [];
    for (const c of children) {
      opts.push({ value: c.displayId, label: `　└ ${c.title}` });
    }
  }
  return opts;
}
