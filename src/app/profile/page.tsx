"use client";

import { useEffect, useState } from "react";
import { getKnownMap, getFavorites, getActiveDays } from "@/lib/storage";
import type { Domain, Term } from "@/lib/types";

export default function ProfilePage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [known, setKnown] = useState<Record<number, boolean>>({});
  const [favCount, setFavCount] = useState(0);
  const [activeDays, setActiveDays] = useState(0);

  useEffect(() => {
    fetch("/api/domains").then((r) => r.json()).then(setDomains);
    fetch("/api/terms").then((r) => r.json()).then(setTerms);
    // localStorage is unavailable during SSR, so this can't be a lazy initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setKnown(getKnownMap());
    setFavCount(Object.values(getFavorites()).filter(Boolean).length);
    setActiveDays(getActiveDays());
  }, []);

  const totalMastered = Object.values(known).filter(Boolean).length;

  return (
    <main className="px-5 pb-10 pt-8">
      <h1 className="font-serif text-2xl font-bold">我的</h1>

      <div className="mt-5 flex gap-3">
        <div className="flex-1 rounded-xl bg-neutral-50 p-4 text-center">
          <div className="font-serif text-2xl font-bold text-cyan-700">{activeDays}</div>
          <div className="mt-1 text-xs text-neutral-500">累计天数</div>
        </div>
        <div className="flex-1 rounded-xl bg-neutral-50 p-4 text-center">
          <div className="font-serif text-2xl font-bold text-cyan-700">{totalMastered}</div>
          <div className="mt-1 text-xs text-neutral-500">已掌握词条</div>
        </div>
        <div className="flex-1 rounded-xl bg-neutral-50 p-4 text-center">
          <div className="font-serif text-2xl font-bold text-pink-700">{favCount}</div>
          <div className="mt-1 text-xs text-neutral-500">收藏</div>
        </div>
      </div>

      <div className="mt-7">
        <div className="mb-3 text-xs uppercase tracking-wide text-neutral-500">领域进度</div>
        <div className="flex flex-col gap-4">
          {domains.map((d) => {
            const domainTerms = terms.filter((t) => t.domainSlug === d.slug);
            const done = domainTerms.filter((t) => known[t.id]).length;
            const pct = domainTerms.length ? Math.round((done / domainTerms.length) * 100) : 0;
            return (
              <div key={d.slug}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-semibold">{d.name}</span>
                  <span className="text-neutral-500">
                    {done}/{domainTerms.length}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
                  <div className="h-full bg-cyan-600" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
