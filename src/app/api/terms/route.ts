import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { domains, terms } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const rows = await db
    .select({
      id: terms.id,
      term: terms.term,
      definitionZh: terms.definitionZh,
      example: terms.example,
      phonetic: terms.phonetic,
      pos: terms.pos,
      exampleZh: terms.exampleZh,
      sceneNote: terms.sceneNote,
      domainSlug: domains.slug,
      domainName: domains.name,
    })
    .from(terms)
    .innerJoin(domains, eq(terms.domainId, domains.id))
    .orderBy(terms.createdAt);

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { domainSlug, term, definitionZh, example } = body;

  if (!domainSlug || !term || !definitionZh) {
    return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
  }

  const [domain] = await db
    .select()
    .from(domains)
    .where(eq(domains.slug, domainSlug));

  if (!domain) {
    return NextResponse.json({ error: "领域不存在" }, { status: 404 });
  }

  const [created] = await db
    .insert(terms)
    .values({ domainId: domain.id, term, definitionZh, example })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
