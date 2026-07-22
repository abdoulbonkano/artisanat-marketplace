import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10 lg:py-16">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
        <div className="flex flex-col gap-3 lg:w-1/2 lg:shrink-0">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="size-20 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6 lg:w-1/2">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-11 w-56" />
        </div>
      </div>
    </div>
  );
}
