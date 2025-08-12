// src/components/mode-toggle.tsx
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils"; // クラス結合用
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  className?: string;
};

export function ModeToggle({ className }: Props) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // クライアントマウント後にのみ実行（SSRと一致）
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-8 w-8", className)}
        aria-label="テーマ切り替え（読み込み中）"
        disabled
      >
        <Sun className="size-4 animate-pulse opacity-50" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const button = (
    <Button
      variant="outline"
      size="icon"
      className={cn("h-8 w-8 cursor-pointer", className)}
      aria-label="ダークモード切り替え"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      disabled={!mounted}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="top">ダークモード切り替え</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
