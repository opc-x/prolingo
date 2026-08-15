import { db } from "@/db";
import { domains, terms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { chunkIntoLessons } from "@/lib/lessons";
import DomainDetailClient from "./DomainDetailClient";

export const dynamic = "force-dynamic";

export default async function DomainDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rows = await db
    .select({
      domainId: domains.id,
      domainName: domains.name,
      domainSlug: domains.slug,
      id: terms.id,
      term: terms.term,
      definitionZh: terms.definitionZh,
      example: terms.example,
    })
    .from(domains)
    .leftJoin(terms, eq(terms.domainId, domains.id))
    .where(eq(domains.slug, slug))
    .orderBy(terms.createdAt);

  if (rows.length === 0) notFound();
  const domain = { id: rows[0].domainId, name: rows[0].domainName, slug: rows[0].domainSlug };
  const domainTerms = rows.filter((r) => r.id !== null) as Array<{
    id: number;
    term: string;
    definitionZh: string;
    example: string | null;
  }>;

  const lessons = chunkIntoLessons(
    domainTerms.map((t) => ({ ...t, domainName: domain.name, domainSlug: domain.slug }))
  );

  return <DomainDetailClient domain={domain} lessons={lessons} />;
}
