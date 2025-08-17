// src/lib/users/mock.ts
import type { UserCreateValues, UserUpdateValues, RoleCode } from "./schema";

/** モックのユーザ型（DBレコードのイメージ） */
export type MockUser = {
  displayId: string; // 例: U00000001（DBでは自動採番想定）
  accountCode: string; // テナント境界（ログインで決まる）
  name: string;
  email: string;
  roleCode: RoleCode;
  isActive: boolean;
  deletedAt?: Date | null; // 論理削除用
};

/** ログイン中アカウント（UIのみなので定数で擬似） */
export const CURRENT_ACCOUNT_CODE = "testAccount0123" as const;

/** ロールの選択肢（セレクト用） */
export type RoleOption = { value: RoleCode; label: string };

export const mockRoleOptions: RoleOption[] = [
  { value: "ADMIN", label: "管理者（ADMIN）" },
  { value: "EDITOR", label: "編集者（EDITOR）" },
  { value: "VIEWER", label: "閲覧者（VIEWER）" },
];

/** サンプルユーザ（他アカウント混在 = フィルタ確認用） */
export const mockUsers: MockUser[] = [
  {
    displayId: "U00000001",
    accountCode: "testAccount0123",
    name: "山田 太郎",
    email: "admin@example.com",
    roleCode: "ADMIN",
    isActive: true,
  },
  {
    displayId: "U00000002",
    accountCode: "testAccount0123",
    name: "佐藤 花子",
    email: "editor@example.com",
    roleCode: "EDITOR",
    isActive: true,
  },
  {
    displayId: "U00000003",
    accountCode: "testAccount0123",
    name: "鈴木 一郎",
    email: "viewer@example.com",
    roleCode: "VIEWER",
    isActive: true,
  },
  // 別アカウント（一覧などで “除外される” ことを確認するため）
  {
    displayId: "U00000011",
    accountCode: "anotherAccount",
    name: "別アカウント ユーザ",
    email: "other@example.com",
    roleCode: "VIEWER",
    isActive: true,
  },
];

/** ── 便利ユーティリティ ───────────────────────────── */

/** 指定アカウント配下のユーザ一覧を取得（テナント境界の代用） */
export function getUsersByAccount(accountCode: string): MockUser[] {
  return mockUsers.filter((u) => u.accountCode === accountCode);
}

/** 指定アカウント配下で displayId に一致するユーザを1件取得 */
export function getUserByDisplayId(
  accountCode: string,
  displayId: string,
): MockUser | undefined {
  return mockUsers.find(
    (u) => u.accountCode === accountCode && u.displayId === displayId,
  );
}

/** 編集フォームの初期値へ変換（accountCode はフォームでは扱わない） */
export function toUpdateValues(user: MockUser): UserUpdateValues {
  return {
    displayId: user.displayId,
    name: user.name,
    email: user.email,
    roleCode: user.roleCode,
    isActive: user.isActive,
  };
}

// 論理削除の擬似処理
export function markDeleted(accountCode: string, displayId: string): boolean {
  const u = mockUsers.find(
    (x) => x.accountCode === accountCode && x.displayId === displayId,
  );
  if (!u) return false;
  u.deletedAt = new Date();
  return true;
}

/** 次の displayId をモック発番（本番はDBで採番） */
function pad(n: number, width = 8) {
  return n.toString().padStart(width, "0");
}
export function nextDisplayIdFor(accountCode: string): string {
  const seq =
    getUsersByAccount(accountCode)
      .map((u) => Number(u.displayId.slice(1)))
      .filter((n) => !Number.isNaN(n))
      .reduce((max, n) => Math.max(max, n), 0) + 1;
  return `U${pad(seq)}`;
}

/** 新規作成の擬似ペイロード作成（displayIdはモック発番、accountCode を注入） */
export function composeCreatePayload(
  values: UserCreateValues,
  accountCode: string,
): MockUser {
  return {
    displayId: nextDisplayIdFor(accountCode),
    accountCode,
    name: values.name,
    email: values.email,
    roleCode: values.roleCode,
    isActive: values.isActive ?? true,
  };
}
