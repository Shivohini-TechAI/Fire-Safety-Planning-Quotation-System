"use client";
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-[#11203e] rounded-lg ${className}`} />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-red-800/40 bg-red-900/15 px-4 py-3">
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-7 w-16 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function FileRowSkeleton() {
  return (
    <div className="flex items-center gap-3 bg-[#11203e] border border-[#16294e] rounded-lg px-3 py-2.5">
      <Skeleton className="w-5 h-5 rounded" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-2.5 w-32" />
      </div>
      <Skeleton className="h-4 w-12 rounded-full" />
    </div>
  );
}

export function QuotationRowSkeleton() {
  return (
    <div className="flex items-center gap-3 bg-[#11203e] border border-[#16294e] rounded-lg px-3 py-2.5">
      <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-2.5 w-28" />
      </div>
      <Skeleton className="h-4 w-16 rounded-full" />
    </div>
  );
}
