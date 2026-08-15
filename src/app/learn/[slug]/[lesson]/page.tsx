import { db } from "@/db";
import { domains, terms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { chunkIntoLessons } from "@/lib/lessons";
import StudyFlow from "./StudyFlow";

export const dynamic = "force-dynamic";

export default async function LearnLesson({
  params,
}: {
  params: Promise<{ slug: string; lesson: string }>;
}) {
  const { slug, lesson: lessonParam } = await params;
  const rows = await db
    .select({
      domainId: domains.id,
      domainName: domains.name,
      domainSlug: domains.slug,
      id: terms.id,
      term: terms.term,
      definitionZh: terms.definitionZh,
      example: terms.example,
      phonetic: terms.phonetic,
      pos: terms.pos,
      exampleZh: terms.exampleZh,
      sceneNote: terms.sceneNote,
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
    phonetic: string | null;
    pos: string | null;
    exampleZh: string | null;
    sceneNote: string | null;
  }>;

  const lessons = chunkIntoLessons(
    domainTerms.map((t) => ({ ...t, domainName: domain.name, domainSlug: domain.slug }))
  );
  const lessonIdx = Number(lessonParam);
  const lesson = lessons[lessonIdx];
  if (!lesson) notFound();

  return (
    <StudyFlow
      domain={domain}
      lesson={lesson}
      hasNextLesson={lessonIdx < lessons.length - 1}
    />
  );
}
