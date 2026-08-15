export default function Loading() {
  return (
    <main className="px-5 pb-10 pt-8">
      <div className="h-4 w-20 animate-pulse rounded-lg bg-neutral-100" />
      <div className="mt-3 h-7 w-40 animate-pulse rounded-lg bg-neutral-100" />
      <div className="mt-6 h-3 w-24 animate-pulse rounded-lg bg-neutral-100" />
      <div className="mt-3 flex flex-col gap-2.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[62px] animate-pulse rounded-xl bg-neutral-50" />
        ))}
      </div>
    </main>
  );
}
