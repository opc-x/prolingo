"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Domain = { id: number; slug: string; name: string };

export function TermForm({ domainList }: { domainList: Domain[] }) {
  const router = useRouter();
  const [domainSlug, setDomainSlug] = useState(domainList[0]?.slug ?? "");
  const [term, setTerm] = useState("");
  const [definitionZh, setDefinitionZh] = useState("");
  const [example, setExample] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const res = await fetch("/api/terms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domainSlug, term, definitionZh, example }),
    });

    setPending(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "提交失败");
      return;
    }

    setTerm("");
    setDefinitionZh("");
    setExample("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 max-w-md">
      <select
        value={domainSlug}
        onChange={(e) => setDomainSlug(e.target.value)}
        className="border rounded px-3 py-2"
      >
        {domainList.map((d) => (
          <option key={d.slug} value={d.slug}>
            {d.name}
          </option>
        ))}
      </select>
      <input
        required
        placeholder="词汇 / 短语"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <input
        required
        placeholder="中文释义"
        value={definitionZh}
        onChange={(e) => setDefinitionZh(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <input
        placeholder="例句（可选）"
        value={example}
        onChange={(e) => setExample(e.target.value)}
        className="border rounded px-3 py-2"
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-black text-white rounded px-3 py-2 disabled:opacity-50"
      >
        {pending ? "提交中…" : "添加词条"}
      </button>
    </form>
  );
}
