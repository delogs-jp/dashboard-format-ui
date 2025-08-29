// src/lib/sidebar/menu.transform.ts
import type { MenuRecord, MenuTree, MenuNode } from "./menu.schema";
import { ICONS } from "./icons.map";

/** MenuRecord[] → MenuTree に変換 */
export function toMenuTree(records: MenuRecord[]): MenuTree {
  // displayId をキーにマップ化
  const map = new Map<string, MenuNode>();
  const roots: MenuNode[] = [];

  // 一旦フラットに作成
  for (const r of records) {
    const icon = r.iconName ? ICONS[r.iconName] : undefined;
    const node: MenuNode = {
      id: r.displayId,
      title: r.title,
      href: r.isSection ? undefined : r.href,
      icon,
      match: r.match ?? "prefix",
      pattern:
        r.match === "regex" && r.pattern ? new RegExp(r.pattern) : undefined,
      children: [],
    };
    map.set(r.displayId, node);
  }

  // 階層を組み立て
  for (const r of records) {
    const node = map.get(r.displayId)!;
    if (r.parentId) {
      const parent = map.get(r.parentId);
      if (parent) {
        parent.children = parent.children ?? [];
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  // order順にソート
  function sortChildren(list: MenuNode[]) {
    for (const n of list) {
      if (n.children?.length) {
        n.children.sort((a, b) => {
          const ra = records.find((r) => r.displayId === a.id)!;
          const rb = records.find((r) => r.displayId === b.id)!;
          return ra.order - rb.order;
        });
        sortChildren(n.children);
      }
    }
  }
  sortChildren(roots);

  return roots;
}
