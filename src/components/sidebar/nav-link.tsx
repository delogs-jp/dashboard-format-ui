/* src/components/sidebar/nav-link.tsx
   - Next.js の <Link> を“軽量に”包む
   - 受け取った active / ariaCurrent を素直に反映
   - 外部リンクや target="_blank" の安全対策もここで吸収
*/
"use client";

import * as React from "react";
import Link, { type LinkProps } from "next/link";

type AriaCurrent = "page" | undefined;

/** 使う側（NavMain）からは “結果” を渡してもらうだけ */
export type NavLinkProps = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    /** そのリンクが現在地なら true（useActive() 由来） */
    active?: boolean;
    /** そのリンクに付与すべき aria-current（通常は "page" か undefined） */
    ariaCurrent?: AriaCurrent;
  };

// かんたんなクラス結合
function cx(...v: Array<string | undefined>) {
  return v.filter(Boolean).join(" ");
}

/** “軽量ラッパー”本体：見た目ロジックは持たず、渡された結果を素直に出す */
export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  function NavLink(
    { active, ariaCurrent, className, href, target, rel, ...rest },
    ref,
  ) {
    // target="_blank" の安全対策（親から rel が来ていなければ付与）
    const safeRel =
      target === "_blank" ? (rel ? rel : "noopener noreferrer") : rel;

    return (
      <Link
        ref={ref}
        href={href}
        aria-current={ariaCurrent}
        data-active={active ? "true" : undefined}
        target={target}
        rel={safeRel}
        className={cx(
          // 基本形（SidebarMenuButton/SubButton の asChild でも単体でも崩れない）
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
          // data-active でも aria-current でも強調が効くように両方用意
          "data-[active=true]:bg-muted data-[active=true]:font-semibold",
          "aria-[current=page]:bg-muted aria-[current=page]:font-semibold",
          className, // ← 親（asChild）から渡ってくるクラスを必ず後ろでマージ
        )}
        {...rest}
      />
    );
  },
);

export default NavLink;
