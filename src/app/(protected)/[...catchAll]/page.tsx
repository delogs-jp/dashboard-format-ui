// src/app/(protected)/[...catchAll]/page.tsx
import { notFound } from "next/navigation";

/**
 * (protected) 配下でマッチしない全ルートを捕捉し、HTTP 404 を返す。
 * レンダリングされるUIは同セグメントの not-found.tsx。
 */
export default function ProtectedCatchAllPage() {
  notFound(); // ← ここで 404 を返す
}
