import { Term, Lesson } from "./types";

export const LESSON_SIZE = 2;

export function chunkIntoLessons(terms: Term[], size = LESSON_SIZE): Lesson[] {
  const lessons: Lesson[] = [];
  for (let i = 0; i < terms.length; i += size) {
    lessons.push({
      index: lessons.length,
      name: `第${lessons.length + 1}课`,
      terms: terms.slice(i, i + size),
    });
  }
  return lessons;
}

export function termsByDomain(terms: Term[], domainSlug: string): Term[] {
  return terms.filter((t) => t.domainSlug === domainSlug);
}
