"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { setKnown, bumpActiveDays } from "@/lib/storage";
import type { Lesson, Term } from "@/lib/types";

function splitExample(example?: string | null, term?: string) {
  if (!example) return { before: "", word: term ?? "", after: "" };
  const idx = example.toLowerCase().indexOf((term ?? "").toLowerCase());
  if (idx === -1) return { before: example, word: "", after: "" };
  return {
    before: example.slice(0, idx),
    word: example.slice(idx, idx + (term?.length ?? 0)),
    after: example.slice(idx + (term?.length ?? 0)),
  };
}

export default function StudyFlow({
  domain,
  lesson,
  hasNextLesson,
}: {
  domain: { slug: string; name: string };
  lesson: Lesson;
  hasNextLesson: boolean;
}) {
  const [cardIdx, setCardIdx] = useState(0);
  const [phase, setPhase] = useState<"ask" | "feedback">("ask");
  const [known, setKnownLocal] = useState<Record<number, boolean>>({});
  const [expanded, setExpanded] = useState(false);
  const [senseShown, setSenseShown] = useState(false);
  const [sceneShown, setSceneShown] = useState(false);
  const [stage, setStage] = useState<"card" | "end">("card");
  const touchStartX = useRef<number | null>(null);

  const term: Term = lesson.terms[cardIdx];
  const ex = useMemo(() => splitExample(term.example, term.term), [term]);

  function answer(val: boolean) {
    setKnown(term.id, val);
    setKnownLocal((prev) => ({ ...prev, [term.id]: val }));
    setPhase("feedback");
  }

  function next() {
    if (cardIdx >= lesson.terms.length - 1) {
      bumpActiveDays();
      setStage("end");
      return;
    }
    setCardIdx((i) => i + 1);
    setPhase("ask");
    setExpanded(false);
    setSenseShown(false);
    setSceneShown(false);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 60) return;
    if (phase === "ask") answer(dx > 0);
    else next();
  }

  if (stage === "end") {
    const knownCount = lesson.terms.filter((t) => known[t.id] === true).length;
    const unknownCount = lesson.terms.filter((t) => known[t.id] === false).length;
    return (
      <main className="px-5 pb-10 pt-10 text-center">
        <div className="text-4xl">🎉</div>
        <h1 className="mt-3 font-serif text-2xl font-bold">完成 {lesson.name}</h1>
        <div className="mt-2 text-sm text-neutral-500">
          {domain.name} · 本课 {lesson.terms.length} 词
        </div>
        <div className="mt-6 flex gap-3">
          <div className="flex-1 rounded-xl bg-neutral-50 p-4">
            <div className="font-serif text-2xl font-bold text-cyan-700">{knownCount}</div>
            <div className="mt-1 text-xs text-neutral-500">认识</div>
          </div>
          <div className="flex-1 rounded-xl bg-neutral-50 p-4">
            <div className="font-serif text-2xl font-bold text-pink-700">{unknownCount}</div>
            <div className="mt-1 text-xs text-neutral-500">还需巩固</div>
          </div>
        </div>
        <div className="mt-7 flex flex-col gap-3">
          {hasNextLesson && (
            <Link
              href={`/learn/${domain.slug}/${lesson.index + 1}`}
              className="rounded-full bg-cyan-600 py-3.5 font-bold text-white"
            >
              下一课 →
            </Link>
          )}
          <button
            onClick={() => {
              setCardIdx(0);
              setKnownLocal({});
              setStage("card");
              setPhase("ask");
            }}
            className="rounded-full bg-neutral-200 py-3.5 font-bold text-neutral-800"
          >
            再练一次
          </button>
          <Link href={`/domains/${domain.slug}`} className="py-2 text-sm font-semibold text-cyan-700">
            返回课时总览
          </Link>
        </div>
      </main>
    );
  }

  const isKnown = known[term.id];

  return (
    <main className="px-5 pb-10 pt-8" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="flex items-center justify-between">
        <Link href={`/domains/${domain.slug}`} className="text-sm font-semibold text-cyan-700">
          ← {domain.name}
        </Link>
        <div className="font-serif text-base font-bold">{lesson.name}</div>
        <div className="text-sm text-neutral-500">
          {cardIdx + 1}/{lesson.terms.length}
        </div>
      </div>
      <div className="my-4 h-[3px] overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-cyan-600"
          style={{ width: `${((cardIdx + 1) / lesson.terms.length) * 100}%` }}
        />
      </div>

      <div className="text-xs uppercase tracking-wide text-neutral-500">这个词你认识吗？</div>
      <div className="mt-2 font-serif text-4xl font-bold">{term.term}</div>
      {term.pos && <div className="mt-1.5 text-sm text-neutral-500">{term.pos}</div>}

      <button
        onClick={() => {
          try {
            const u = new SpeechSynthesisUtterance(term.term);
            speechSynthesis.speak(u);
          } catch {}
        }}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cyan-100 px-3.5 py-2 text-sm font-semibold text-cyan-800"
      >
        ♪ 发音
      </button>

      <div className="mt-7 flex gap-3">
        <button
          onClick={() => answer(true)}
          className={`flex-1 rounded-xl py-4 text-sm font-bold ${
            isKnown === true ? "bg-cyan-600 text-white" : "bg-neutral-200 text-neutral-800"
          }`}
        >
          认识 ✓
        </button>
        <button
          onClick={() => answer(false)}
          className={`flex-1 rounded-xl py-4 text-sm font-bold ${
            isKnown === false ? "bg-pink-600 text-white" : "bg-neutral-200 text-neutral-800"
          }`}
        >
          不认识
        </button>
      </div>
      <div className="mt-2.5 text-center text-[11px] text-neutral-400">左右滑动也可以判断</div>

      {phase === "feedback" && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-5 w-full rounded-xl bg-neutral-50 py-3.5 text-sm font-semibold text-neutral-600"
        >
          查看讲解与例句 ›
        </button>
      )}

      {phase === "feedback" && expanded && (
        <>
          <div className={`mt-5 rounded-xl p-4 ${isKnown ? "bg-cyan-50" : "bg-pink-50"}`}>
            <div className={`mb-1.5 text-xs font-bold ${isKnown ? "text-cyan-700" : "text-pink-700"}`}>
              {isKnown ? "判断正确 · 巩固一下" : "一起学一下"}
            </div>
            {term.phonetic && <div className="italic text-cyan-800">{term.phonetic}</div>}
            <div className="mt-2 text-base leading-relaxed">{term.definitionZh}</div>
          </div>

          <div className="mt-5">
            <div className="mb-3 text-xs uppercase tracking-wide text-neutral-500">场景例句</div>
            <div className="text-[17px] leading-relaxed">
              {ex.before}
              <b className="text-cyan-700">{ex.word}</b>
              {ex.after}
            </div>
            <div className="mt-4 flex gap-2.5">
              <button
                onClick={() => setSenseShown((v) => !v)}
                className="rounded-full bg-neutral-200 px-3.5 py-2 text-xs font-semibold"
              >
                句意解析
              </button>
              <button
                onClick={() => setSceneShown((v) => !v)}
                className="rounded-full bg-neutral-200 px-3.5 py-2 text-xs font-semibold"
              >
                场景解析
              </button>
            </div>
            {senseShown && (
              <div className="mt-3.5 rounded-xl bg-neutral-50 p-4">
                <div className="mb-1.5 text-xs font-bold text-cyan-700">句意</div>
                <div className="text-sm leading-relaxed">{term.exampleZh ?? "（待补充）"}</div>
              </div>
            )}
            {sceneShown && (
              <div className="mt-3 rounded-xl bg-pink-50 p-4">
                <div className="mb-1.5 text-xs font-bold text-pink-700">场景</div>
                <div className="text-sm leading-relaxed">{term.sceneNote ?? "（待补充）"}</div>
              </div>
            )}
          </div>
        </>
      )}

      {phase === "feedback" && (
        <button onClick={next} className="mt-7 w-full rounded-full bg-cyan-600 py-3.5 font-bold text-white">
          {cardIdx >= lesson.terms.length - 1 ? "完成本课" : isKnown ? "已掌握" : "继续"} →
        </button>
      )}
    </main>
  );
}
