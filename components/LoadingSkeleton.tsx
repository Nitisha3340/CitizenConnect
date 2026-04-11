"use client";

export default function LoadingSkeleton({
  title = true,
  cards = 3,
  rows = 3,
}: {
  title?: boolean;
  cards?: number;
  rows?: number;
}) {
  return (
    <div className="space-y-6">
      {title ? (
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
          <div className="h-3 w-32 animate-pulse rounded-full bg-slate-700" />
          <div className="h-8 w-72 animate-pulse rounded-full bg-slate-700" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded-full bg-slate-700" />
        </div>
      ) : null}

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${Math.min(cards, 4)}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cards }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
            <div className="h-3 w-24 animate-pulse rounded-full bg-slate-700" />
            <div className="mt-4 h-8 w-20 animate-pulse rounded-full bg-slate-700" />
            <div className="mt-4 h-4 w-32 animate-pulse rounded-full bg-slate-700" />
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-700" />
        ))}
      </div>
    </div>
  );
}
