export function ShimmerCard() {
  return (
    <div className="rounded-lg overflow-hidden bg-card border border-border">
      <div className="aspect-square shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-1/3 shimmer rounded" />
        <div className="h-4 w-3/4 shimmer rounded" />
        <div className="h-4 w-1/2 shimmer rounded" />
      </div>
    </div>
  );
}

export function ShimmerGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ShimmerCard key={i} />
      ))}
    </div>
  );
}