// src/app/(public)/layout.tsx
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "管理画面 | DELOGs",
  description: "ログイン前の共通レイアウト",
};

export default function PubulicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster richColors closeButton />
    </>
  );
}
