// src/lib/roles/mock.ts
import type { Role } from "./schema";

export const mockRoles: Role[] = [
  {
    displayId: "R00000001",
    code: "ADMIN",
    displayName: "管理者",
    priority: 100,
    badgeColor: "#D32F2F", // 赤
    isActive: true,
    isSystem: true,
    canDownloadData: true,
    canEditData: true,
  },
  {
    displayId: "R00000002",
    code: "EDITOR",
    displayName: "編集者",
    priority: 50,
    badgeColor: "#1976D2", // 青
    isActive: true,
    isSystem: true,
    canDownloadData: true,
    canEditData: true,
  },
  {
    displayId: "R00000003",
    code: "VIEWER",
    displayName: "閲覧者",
    priority: 10,
    badgeColor: "#616161", // グレー
    isActive: true,
    isSystem: true,
    canDownloadData: false,
    canEditData: false,
  },
  {
    displayId: "R00000010",
    code: "ANALYST",
    displayName: "分析担当",
    priority: 20,
    badgeColor: "#388E3C", // 緑
    isActive: true,
    isSystem: false,
    canDownloadData: true,
    canEditData: false,
  },
];

const roles = [...mockRoles];

export function getRoles(): Role[] {
  return roles.filter((r) => !r.deletedAt);
}

export function getRoleById(displayId: string): Role | undefined {
  return roles.find((r) => r.displayId === displayId);
}

function pad(num: number, width = 8) {
  return num.toString().padStart(width, "0");
}

export function nextDisplayId(): string {
  const max = roles
    .map((r) => Number(r.displayId.slice(1)))
    .reduce((acc, n) => Math.max(acc, n), 0);
  return `R${pad(max + 1)}`;
}

export function addRole(role: Omit<Role, "displayId">): Role {
  const newRole: Role = { ...role, displayId: nextDisplayId() };
  roles.push(newRole);
  return newRole;
}

export function updateRole(updated: Role): boolean {
  const index = roles.findIndex((r) => r.displayId === updated.displayId);
  if (index === -1) return false;

  if (roles[index].isSystem) {
    // 固定ロールは displayName と badgeColor のみ更新可
    roles[index].displayName = updated.displayName;
    roles[index].badgeColor = updated.badgeColor;
    return true;
  }

  roles[index] = updated;
  return true;
}

export function deleteRole(displayId: string): boolean {
  const role = getRoleById(displayId);
  if (!role || role.isSystem) return false;
  role.deletedAt = new Date();
  return true;
}

/** code からロールを取得（存在しなければ undefined） */
export function getRoleByCode(code: string): Role | undefined {
  return getRoles().find((r) => r.code === code);
}

/** Usersのセレクト等で使うラベル "管理者（ADMIN）" 形式 */
export function getRoleOptions(): {
  value: Role["code"];
  label: string;
}[] {
  return getRoles()
    .filter((r) => r.isActive) // ← アクティブのみ
    .map((r) => ({
      value: r.code,
      label: `${r.displayName}（${r.code}）`,
    }));
}

/** バッジ表示向けの小ユーティリティ（label と style を返す） */
export function getRoleBadgeProps(code: string): {
  label: string;
  style: React.CSSProperties;
} {
  const r = getRoleByCode(code);
  return {
    label: r?.displayName ?? code,
    // 文字色は白固定・枠線なしでOKという要望に合わせる
    style: {
      backgroundColor: r?.badgeColor ?? "#666",
      color: "#fff",
      border: "none",
    },
  };
}

// すべてのロールコード一覧
export const ROLE_CODES = mockRoles.map((r) => r.code) as [
  Role["code"],
  ...Role["code"][],
];
