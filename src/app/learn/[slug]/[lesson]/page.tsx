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
  const [domain] = await db.select().from(domains).where(eq(domains.slug, slug));
  if (!domain) notFound();

  const domainTerms = await db
    .select({
      id: terms.id,
      term: terms.term,
      definitionZh: terms.definitionZh,
      example: terms.example,
      phonetic: terms.phonetic,
      pos: terms.pos,
      exampleZh: terms.exampleZh,
      sceneNote: terms.sceneNote,
    })
    .from(terms)
    .where(eq(terms.domainId, domain.id))
    .orderBy(terms.createdAt);

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
