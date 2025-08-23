// src/lib/roles/preset.ts
export type RolePreset = {
  label: string;
  badgeClass: string; // Tailwind のユーティリティで簡易色付け
};

export const ROLE_PRESETS: Record<"ADMIN" | "EDITOR" | "VIEWER", RolePreset> = {
  ADMIN: {
    label: "管理者",
    badgeClass: "bg-red-800 text-white border-none",
  },
  EDITOR: {
    label: "編集者",
    badgeClass: "bg-blue-800 text-white border-none",
  },
  VIEWER: {
    label: "閲覧専用",
    badgeClass: "bg-gray-800 text-white border-none",
  },
};

export function getRolePreset(code: "ADMIN" | "EDITOR" | "VIEWER"): RolePreset {
  return ROLE_PRESETS[code];
}
