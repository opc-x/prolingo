import { db } from "@/db";
import { domains, terms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { TermForm } from "@/components/TermForm";

export const dynamic = "force-dynamic";

export default async function Home() {
  const domainList = await db.select().from(domains);
  const rows = await db
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
    .orderBy(terms.createdAt);

  const grouped = domainList.map((d) => ({
    domain: d,
    items: rows.filter((r) => r.domainSlug === d.slug),
  }));

  return (
    <main className="max-w-2xl mx-auto p-8 flex flex-col gap-10">
      <header>
        <h1 className="text-2xl font-bold">Prolingo</h1>
        <p className="text-neutral-500 mt-1">
          领域英语学习 — 程序员英语、金融英语等垂直场景词汇
        </p>
      </header>

      <section className="flex flex-col gap-6">
        {grouped.map(({ domain, items }) => (
          <div key={domain.slug}>
            <h2 className="text-lg font-semibold mb-2">{domain.name}</h2>
            <ul className="flex flex-col gap-2">
              {items.map((t) => (
                <li key={t.id} className="border rounded px-3 py-2">
                  <div className="font-medium">{t.term}</div>
                  <div className="text-sm text-neutral-600">
                    {t.definitionZh}
                  </div>
                  {t.example && (
                    <div className="text-sm text-neutral-400 italic mt-1">
                      {t.example}
                    </div>
                  )}
                </li>
              ))}
              {items.length === 0 && (
                <li className="text-sm text-neutral-400">暂无词条</li>
              )}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">添加新词条</h2>
        <TermForm domainList={domainList} />
      </section>
    </main>
  );
}
