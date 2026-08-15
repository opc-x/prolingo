export default function Loading() {
  return (
    <main className="px-5 pb-10 pt-8">
      <div className="h-8 w-32 animate-pulse rounded-lg bg-neutral-100" />
      <div className="mt-2 h-4 w-56 animate-pulse rounded-lg bg-neutral-100" />
      <div className="mt-7 flex flex-col gap-3.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[68px] animate-pulse rounded-xl bg-neutral-50" />
        ))}
      </div>
    </main>
  );
}
