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
      phonetic: "/ˌaɪdəmˈpoʊtənt/",
      pos: "adj. 形容词",
      exampleZh: "确保这个 PUT 接口是幂等的。",
      sceneNote: "常见于 API 设计评审：讨论重试、消息队列去重时会反复用到这个词。",
    },
    {
      domainId: programmer.id,
      term: "race condition",
      definitionZh: "竞态条件：多个线程/进程并发访问共享状态导致的时序错误",
      example: "The bug was caused by a race condition between two goroutines.",
      phonetic: "/reɪs kənˈdɪʃən/",
      pos: "n. 名词",
      exampleZh: "这个 bug 是由两个 goroutine 之间的竞态条件引起的。",
      sceneNote: "排查并发 bug、code review 时的高频词，常与 lock、mutex 一起出现。",
    },
    {
      domainId: finance.id,
      term: "amortization",
      definitionZh: "摊销：把成本或债务分摊到多个会计期间",
      example: "The loan is repaid through monthly amortization.",
      phonetic: "/əˌmɔːrtəˈzeɪʃən/",
      pos: "n. 名词",
      exampleZh: "这笔贷款通过每月摊销的方式偿还。",
      sceneNote: "财报分析、贷款合同中常见，和 depreciation（折旧）经常放在一起对比。",
    },
    {
      domainId: finance.id,
      term: "liquidity",
      definitionZh: "流动性：资产快速变现而不明显影响价格的能力",
      example: "The fund maintains high liquidity to meet redemptions.",
      phonetic: "/lɪˈkwɪdəti/",
      pos: "n. 名词",
      exampleZh: "该基金维持高流动性以应对赎回需求。",
      sceneNote: "投研讨论、基金季报中的核心词，常用来评估资产风险。",
    },
  ]);

  console.log("Seed done.");
}

main().then(() => process.exit(0));
