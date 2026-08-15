import { db } from "@/db";
import { domains, terms } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { chunkIntoLessons, termsByDomain } from "@/lib/lessons";
import type { Term } from "@/lib/types";

export const dynamic = "force-dynamic";

const BADGE = [
  { glyph: "</>", bg: "bg-cyan-100", fg: "text-cyan-800" },
  { glyph: "$", bg: "bg-pink-100", fg: "text-pink-800" },
  { glyph: "★", bg: "bg-neutral-200", fg: "text-neutral-800" },
];

export default async function Home() {
  const [domainList, rows] = await Promise.all([
    db.select().from(domains),
    db
      .select({
        id: terms.id,
        term: terms.term,
        definitionZh: terms.definitionZh,
        example: terms.example,
        domainName: domains.name,
        domainSlug: domains.slug,
      })
      .from(terms)
      .innerJoin(domains, eq(terms.domainId, domains.id))
      .orderBy(terms.createdAt),
  ]);

  return (
    <main className="px-5 pb-10 pt-8">
      <h1 className="font-serif text-3xl font-bold">Prolingo</h1>
      <p className="mt-1 text-sm text-neutral-500">
        选择领域，按课时刷完专业词汇与场景例句
      </p>

      <div className="mt-7 flex flex-col gap-3.5">
        {domainList.map((d, i) => {
          const domainTerms = termsByDomain(rows as Term[], d.slug);
          const lessons = chunkIntoLessons(domainTerms);
          const badge = BADGE[i % BADGE.length];
          return (
            <Link
              key={d.slug}
              href={`/domains/${d.slug}`}
              className="flex items-center gap-4 rounded-xl bg-neutral-50 p-4"
            >
              <div className={`flex h-13 w-13 flex-none items-center justify-center rounded-full text-lg font-bold ${badge.bg} ${badge.fg}`} style={{ width: 52, height: 52 }}>
                {badge.glyph}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-serif text-lg font-bold">{d.name}</div>
                <div className="text-sm text-neutral-500">
                  {lessons.length} 课时 · {domainTerms.length} 词
                </div>
              </div>
              <div className="flex-none text-sm text-neutral-400">›</div>
            </Link>
          );
        })}
        {domainList.length === 0 && (
          <div className="py-10 text-center text-sm text-neutral-400">暂无领域，先在数据库里 seed 一些</div>
        )}
      </div>
    </main>
  );
}
