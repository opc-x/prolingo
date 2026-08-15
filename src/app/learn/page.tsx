import { db } from "@/db";
import { domains } from "@/db/schema";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Entry point for the bottom-nav "学习" tab: sends the user to the first
// domain's overview. Swap for "last opened lesson" (read from localStorage
// via a client redirect) once that's worth the complexity.
export default async function LearnEntry() {
  const [first] = await db.select().from(domains).limit(1);
  redirect(first ? `/domains/${first.slug}` : "/");
}
