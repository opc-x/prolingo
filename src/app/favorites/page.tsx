"use client";

import { useEffect, useState } from "react";
import { getFavorites, toggleFavorite } from "@/lib/storage";
import type { Term } from "@/lib/types";

export default function FavoritesPage() {
  const [allTerms, setAllTerms] = useState<Term[]>([]);
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch("/api/terms")
      .then((r) => r.json())
      .then(setAllTerms);
    // localStorage is unavailable during SSR, so this can't be a lazy initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorites(getFavorites());
  }, []);

  const favTerms = allTerms.filter((t) => favorites[t.id]);

  return (
    <main className="px-5 pb-10 pt-8">
      <h1 className="font-serif text-2xl font-bold">我的收藏</h1>
      <div className="mb-5 mt-1 text-sm text-neutral-500">{favTerms.length} 个词条待复习</div>

      {favTerms.length === 0 ? (
        <div className="py-16 text-center text-sm text-neutral-400">还没有收藏，学习时点 ♡ 收藏词条</div>
      ) : (
        <div className="flex flex-col gap-3">
          {favTerms.map((t) => (
            <div key={t.id} className="rounded-xl bg-neutral-50 p-4">
              <div className="flex items-baseline justify-between">
                <div className="font-serif text-lg font-bold">{t.term}</div>
                <button
                  onClick={() => setFavorites(() => ({ ...favorites, [t.id]: toggleFavorite(t.id) }))}
                  className="text-lg text-pink-700"
                >
                  ♥
                </button>
              </div>
              {t.phonetic && <div className="mt-0.5 text-sm italic text-neutral-500">{t.phonetic}</div>}
              <div className="mt-2 text-sm">{t.definitionZh}</div>
              {t.example && <div className="mt-2 text-sm text-neutral-500">{t.example}</div>}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
