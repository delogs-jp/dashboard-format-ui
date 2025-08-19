// src/lib/sidebar/use-active.ts
"use client";

import { useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import type { MenuTree, MenuNode } from "./menu.schema";

/* ========== 公開インターフェース ========== */

export type ActiveState = {
  active: MenuNode | null;
  ancestors: Set<string>;
  isActive: (id: string) => boolean;
  isAncestor: (id: string) => boolean;
  ariaCurrentFor: (id: string) => "page" | undefined;
  openByDefault: (id: string) => boolean;
};

type FlatNode = {
  id: string;
  href: string;
  match: "exact" | "prefix" | RegExp; // "regex" は RegExp に正規化して持つ
  parentId: string | null;
  depth: number;
};

// "regex" 指定を実際の RegExp に正規化
function toFlatMatch(n: MenuNode): FlatNode["match"] {
  if (!n.match || n.match === "exact" || n.match === "prefix") {
    return n.match ?? "exact";
  }
  // n.match === "regex" の場合
  // パターン未指定なら絶対にマッチしないダミーを返す（. ^ はどれにも一致しない）
  return n.pattern ?? /.^/;
}

function flatten(
  tree: MenuTree,
  parentId: string | null,
  depth: number,
  out: FlatNode[],
) {
  for (const n of tree) {
    out.push({
      id: n.id,
      href: n.href,
      match: toFlatMatch(n), // ← ここで型を合わせる
      parentId,
      depth,
    });
    if (n.children?.length) flatten(n.children, n.id, depth + 1, out);
  }
}

export function useActive(menu: MenuTree) {
  const pathname = usePathname();

  // 1) フラット化
  const flat = useMemo(() => {
    const buf: FlatNode[] = [];
    flatten(menu, null, 0, buf);
    return buf;
  }, [menu]);

  // ★ 子参照に使う簡易インデックス（id -> node）
  const nodeById = useMemo(() => {
    const map = new Map<string, MenuNode>();
    const walk = (list: MenuNode[]) => {
      for (const n of list) {
        map.set(n.id, n);
        if (n.children?.length) walk(n.children);
      }
    };
    walk(menu);
    return map;
  }, [menu]);

  // 2) スコア計算
  const scoreFor = useCallback(
    /* 既存のまま */ (n: FlatNode): number => {
      const href = n.href.replace(/\/+$/, "");
      const current = pathname.replace(/\/+$/, "");
      if (n.match === "exact") {
        return current === href ? 1_000_000 + href.length : 0;
      }
      if (n.match === "prefix") {
        const pref = href === "" ? "/" : href + "/";
        return current.startsWith(pref) ? href.length : 0;
      }
      if (n.match instanceof RegExp) {
        const m = current.match(n.match);
        return m ? 500_000 + (m[0]?.length ?? 0) : 0;
      }
      return 0;
    },
    [pathname],
  );

  // 3) ベストを選ぶ
  const active = useMemo(() => {
    const scored = flat
      .map((n) => ({ ...n, score: scoreFor(n) }))
      .filter((n) => n.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          b.depth - a.depth ||
          b.href.length - a.href.length,
      );
    return scored[0] ?? null;
  }, [flat, scoreFor]);

  // 3.5) ★ 代表リンク（/users の exact 子）に振り替えるための pageId を確定
  const pageId = useMemo(() => {
    if (!active) return undefined;
    const node = nodeById.get(active.id);
    if (!node) return active.id;

    // 親が prefix で、自分と同じ href を持つ exact の子がいれば、それを代表にする
    const exactChild = node.children?.find(
      (c) =>
        (c.match ?? "exact") === "exact" &&
        c.href.replace(/\/+$/, "") === node.href.replace(/\/+$/, ""),
    );
    return exactChild?.id ?? active.id;
  }, [active, nodeById]);

  // 祖先判定
  const parentById = useMemo(() => {
    const map = new Map<string, string | null>();
    for (const n of flat) map.set(n.id, n.parentId);
    return map;
  }, [flat]);

  const isActive = useCallback((id: string) => active?.id === id, [active]);
  const isAncestor = useCallback(
    (id: string) => {
      let p = active?.parentId ?? null;
      while (p) {
        if (p === id) return true;
        p = parentById.get(p) ?? null;
      }
      return false;
    },
    [active, parentById],
  );

  // ★ aria-current は代表リンク（pageId）に付与
  const ariaCurrentFor = useCallback<(id: string) => "page" | undefined>(
    (id) => (pageId && pageId === id ? "page" : undefined),
    [pageId],
  );

  const openByDefault = useCallback(
    (id: string) => isAncestor(id) || isActive(id),
    [isAncestor, isActive],
  );

  return { isActive, isAncestor, ariaCurrentFor, openByDefault };
}
