"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "首页", glyph: "⌂" },
  { href: "/learn", label: "学习", glyph: "词" },
  { href: "/favorites", label: "收藏", glyph: "♥" },
  { href: "/profile", label: "我的", glyph: "☺" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex border-t border-neutral-200 bg-white px-2 pb-6 pt-2 mx-auto max-w-md">
      {items.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 text-center ${active ? "text-cyan-700" : "text-neutral-400"}`}
          >
            <div className="text-xl leading-none">{item.glyph}</div>
            <div className="mt-1 text-[11px] font-semibold">{item.label}</div>
          </Link>
        );
      })}
    </nav>
  );
}
