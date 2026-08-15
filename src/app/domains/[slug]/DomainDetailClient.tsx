"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getKnownMap } from "@/lib/storage";
import type { Lesson } from "@/lib/types";

export default function DomainDetailClient({
  domain,
  lessons,
}: {
  domain: { slug: string; name: string };
  lessons: Lesson[];
}) {
  const [known, setKnownState] = useState<Record<number, boolean>>({});
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    // localStorage is unavailable during SSR, so this can't be a lazy initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setKnownState(getKnownMap());
  }, []);

  return (
    <main className="px-5 pb-10 pt-8">
      <Link href="/" className="text-sm font-semibold text-cyan-700">
        ← 全部领域
      </Link>
      <h1 className="mt-3 font-serif text-2xl font-bold">{domain.name}</h1>

      <div className="mt-6 text-xs uppercase tracking-wide text-neutral-500">教材总览 · 按课时刷</div>
      <div className="mt-3 flex flex-col gap-2.5">
        {lessons.map((l) => {
          const doneCount = l.terms.filter((t) => known[t.id] !== undefined).length;
          const complete = doneCount === l.terms.length;
          const open = openIdx === l.index;
          return (
            <div key={l.index} className="rounded-xl bg-neutral-50">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setOpenIdx(open ? null : l.index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setOpenIdx(open ? null : l.index);
                }}
                className="flex w-full cursor-pointer items-center gap-3.5 px-4 py-3.5 text-left"
              >
                <div
                  className={`flex h-8.5 w-8.5 flex-none items-center justify-center rounded-full text-xs font-bold ${
                    complete ? "bg-cyan-600 text-white" : "bg-neutral-200 text-neutral-600"
                  }`}
                  style={{ width: 34, height: 34 }}
                >
                  {complete ? "✓" : l.index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold">{l.name}</div>
                  <div className="mt-0.5 text-xs text-neutral-500">
                    {l.terms.length} 词 ·{" "}
                    {complete ? "已完成" : doneCount > 0 ? `进行中 ${doneCount}/${l.terms.length}` : "未开始"}
                  </div>
                </div>
                <Link
                  href={`/learn/${domain.slug}/${l.index}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-none text-sm font-semibold text-cyan-700"
                >
                  {complete ? "重练" : doneCount > 0 ? "继续" : "开始"} →
                </Link>
              </div>

              {open && (
                <div className="flex flex-col border-t border-neutral-200 px-4">
                  {l.terms.map((t) => {
                    const state = known[t.id];
                    return (
                      <Link
                        key={t.id}
                        href={`/learn/${domain.slug}/${l.index}?term=${t.id}`}
                        className="flex items-center justify-between gap-2 border-b border-neutral-200 py-3 last:border-b-0"
                      >
                        <div className="text-sm font-semibold">{t.term}</div>
                        <div
                          className={`flex-none text-sm ${
                            state === true ? "text-cyan-700" : state === false ? "text-pink-700" : "text-neutral-300"
                          }`}
                        >
                          {state === true ? "✓" : state === false ? "↻" : "›"}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
