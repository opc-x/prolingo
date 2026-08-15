import { db } from "./index";
import { domains, terms } from "./schema";

async function main() {
  const [programmer, finance] = await db
    .insert(domains)
    .values([
      { slug: "programmer", name: "程序员英语" },
      { slug: "finance", name: "金融英语" },
    ])
    .returning();

  await db.insert(terms).values([
    {
      domainId: programmer.id,
      term: "idempotent",
      definitionZh: "幂等的：同一操作执行多次和执行一次效果相同",
      example: "Make sure the PUT endpoint is idempotent.",
    },
    {
      domainId: programmer.id,
      term: "race condition",
      definitionZh: "竞态条件：多个线程/进程并发访问共享状态导致的时序错误",
      example: "The bug was caused by a race condition between two goroutines.",
    },
    {
      domainId: finance.id,
      term: "amortization",
      definitionZh: "摊销：把成本或债务分摊到多个会计期间",
      example: "The loan is repaid through monthly amortization.",
    },
    {
      domainId: finance.id,
      term: "liquidity",
      definitionZh: "流动性：资产快速变现而不明显影响价格的能力",
      example: "The fund maintains high liquidity to meet redemptions.",
    },
  ]);

  console.log("Seed done.");
}

main().then(() => process.exit(0));
