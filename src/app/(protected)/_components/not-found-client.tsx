// src/app/(protected)/_components/not-found-client.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFoundClient() {
  const router = useRouter();

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button onClick={() => router.push("/dashboard")}>
        ダッシュボードへ戻る
      </Button>
      <Button variant="outline" onClick={() => router.back()}>
        前のページに戻る
      </Button>
    </div>
  );
}
