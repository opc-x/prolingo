export default function Loading() {
  return (
    <main className="px-5 pb-10 pt-8">
      <div className="flex items-center justify-between">
        <div className="h-4 w-16 animate-pulse rounded-lg bg-neutral-100" />
        <div className="h-4 w-12 animate-pulse rounded-lg bg-neutral-100" />
      </div>
      <div className="my-4 h-[3px] rounded-full bg-neutral-100" />
      <div className="h-3 w-28 animate-pulse rounded-lg bg-neutral-100" />
      <div className="mt-2 h-10 w-48 animate-pulse rounded-lg bg-neutral-100" />
      <div className="mt-7 flex gap-3">
        <div className="h-14 flex-1 animate-pulse rounded-xl bg-neutral-100" />
        <div className="h-14 flex-1 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    </main>
  );
}
