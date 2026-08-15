import { db } from "@/db";
import { domains, terms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { chunkIntoLessons } from "@/lib/lessons";
import DomainDetailClient from "./DomainDetailClient";

export const dynamic = "force-dynamic";

export default async function DomainDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [domain] = await db.select().from(domains).where(eq(domains.slug, slug));
  if (!domain) notFound();

  const domainTerms = await db
    .select({
      id: terms.id,
      term: terms.term,
      definitionZh: terms.definitionZh,
      example: terms.example,
    })
    .from(terms)
    .where(eq(terms.domainId, domain.id))
    .orderBy(terms.createdAt);

  const lessons = chunkIntoLessons(
    domainTerms.map((t) => ({ ...t, domainName: domain.name, domainSlug: domain.slug }))
  );

  return <DomainDetailClient domain={domain} lessons={lessons} />;
}
