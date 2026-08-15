# Prolingo

领域英语学习工具 — 按具体场景（程序员英语、金融英语等）积累专业词汇和例句，而不是通用词表。

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js (App Router) + TypeScript |
| 样式 | Tailwind CSS |
| 数据库 | Neon (Serverless Postgres)，实例名 `prolingo` |
| ORM | Drizzle ORM (`@neondatabase/serverless` HTTP driver) |

## 数据模型

- `domains` — 领域（如 `programmer` 程序员英语、`finance` 金融英语）
- `terms` — 词条，属于某个领域，含词汇、中文释义、例句

## 本地开发

```bash
cp .env.example .env.local
# 填入 Neon 的 DATABASE_URL（postgresql://...?sslmode=require）

npm install
npm run db:push    # 把 src/db/schema.ts 同步到数据库
npm run db:seed    # 写入示例领域和词条
npm run dev         # http://localhost:3000
```

## 接口

```
GET  /api/domains   ← 领域列表
GET  /api/terms      ← 全部词条（含所属领域）
POST /api/terms      ← 新增词条 { domainSlug, term, definitionZh, example? }
```

## 目录结构

```
prolingo/
├── src/
│   ├── app/
│   │   ├── page.tsx           # 首页：按领域展示词条 + 新增表单
│   │   └── api/
│   │       ├── domains/route.ts
│   │       └── terms/route.ts
│   ├── components/TermForm.tsx
│   └── db/
│       ├── schema.ts          # Drizzle schema
│       ├── index.ts           # DB client
│       └── seed.ts            # 种子数据
└── drizzle.config.ts
```
