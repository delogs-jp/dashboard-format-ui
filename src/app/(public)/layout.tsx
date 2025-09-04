// src/app/(public)/layout.tsx
import { Toaster } from "@/components/ui/sonner";

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
