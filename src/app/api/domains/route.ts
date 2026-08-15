import { NextResponse } from "next/server";
import { db } from "@/db";
import { domains } from "@/db/schema";

export async function GET() {
  const rows = await db.select().from(domains);
  return NextResponse.json(rows);
}
