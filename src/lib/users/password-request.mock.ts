// src/lib/users/password-request.mock.ts

import { z } from "zod";
import { mockUsers, CURRENT_ACCOUNT_CODE } from "@/lib/users/mock";
import type { RoleCode } from "@/lib/users/schema";

/* =========================
   型定義
   ========================= */
export const PasswordRequestStatus = z.enum(["PENDING", "ISSUED", "REJECTED"]);
export type PasswordRequestStatus = z.infer<typeof PasswordRequestStatus>;

export type PasswordRequest = {
  id: string;
  accountId: string;
  email: string;
  note?: string;
  status: PasswordRequestStatus;
  requestedAt: Date;
  processedAt?: Date;
  processedBy?: string;

  userName: string;
  userRole: RoleCode | "-";
};

function resolveUser(accountId: string, email: string) {
  const u = mockUsers.find(
    (x) =>
      x.accountCode === accountId &&
      x.email.toLowerCase() === email.toLowerCase(),
  );
  return u
    ? { userName: u.name, userRole: u.roleCode as RoleCode }
    : { userName: "-", userRole: "-" as const };
}

/* モックデータ */
export const passwordRequests: PasswordRequest[] = [
  {
    id: "PR000001",
    accountId: CURRENT_ACCOUNT_CODE,
    email: "admin@example.com",
    note: "本人からの電話申請",
    status: "PENDING",
    requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    ...resolveUser(CURRENT_ACCOUNT_CODE, "admin@example.com"),
  },
  {
    id: "PR000002",
    accountId: CURRENT_ACCOUNT_CODE,
    email: "editor@example.com",
    note: "",
    status: "ISSUED",
    requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    processedBy: "Admin User",
    ...resolveUser(CURRENT_ACCOUNT_CODE, "editor@example.com"),
  },
];

export function listPasswordRequests(accountId: string): PasswordRequest[] {
  return passwordRequests.filter((r) => r.accountId === accountId);
}

export function markIssued(
  id: string,
  processedBy: string,
): PasswordRequest | undefined {
  const r = passwordRequests.find((x) => x.id === id);
  if (!r) return undefined;
  if (r.status !== "PENDING") return r;
  r.status = "ISSUED";
  r.processedAt = new Date();
  r.processedBy = processedBy;
  return r;
}

export function markRejected(
  id: string,
  processedBy: string,
): PasswordRequest | undefined {
  const r = passwordRequests.find((x) => x.id === id);
  if (!r) return undefined;
  if (r.status !== "PENDING") return r;
  r.status = "REJECTED";
  r.processedAt = new Date();
  r.processedBy = processedBy;
  return r;
}
