import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <Skeleton className="aspect-[3/1] w-full rounded-none sm:aspect-[4/1]" />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6">
        <div className="flex items-end gap-4">
          <Skeleton className="relative -mt-10 size-24 shrink-0 rounded-full sm:size-28" />
          <div className="flex flex-col gap-2 pt-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 pb-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="aspect-square w-full rounded-3xl" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
