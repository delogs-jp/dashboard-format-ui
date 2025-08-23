// src/lib/sidebar/mock-user.ts
// ← 「ログイン中ユーザ」を擬似的に提供（UIのみ）
export type User = {
  displayId: string;
  name: string;
  email: string;
  avatar: string; // 例: "/user-avatar.png"（public配下のダミー）
  roleCode: "ADMIN" | "EDITOR" | "VIEWER";
};

export const mockUser: User = {
  displayId: "U00000001",
  name: "山田 太郎",
  email: "yamada@example.com",
  avatar: "/user-avatar.png",
  roleCode: "ADMIN",
};
