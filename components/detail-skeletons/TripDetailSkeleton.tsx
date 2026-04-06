import Skeleton from "@/components/ui/Skeleton";

function SectionHeadingSkeleton() {
  return (
    <div className="mb-6 flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-xl bg-[#DBEAFE]" />
      <Skeleton className="h-8 w-48 rounded-full" />
    </div>
  );
}

function OptionCardSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-[#e2e8f0] bg-[#f8fafc] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 items-start gap-2.5">
          <Skeleton className="mt-0.5 h-5 w-5 rounded-md bg-[#DBEAFE]" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3 rounded-full" />
            <Skeleton className="h-3 w-full rounded-full bg-[#F1F5F9]" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full bg-[#E0F2FE]" />
      </div>
    </div>
  );
}

export default function TripDetailSkeleton() {
  return (
    <main className="bg-[#FAFAFA]">
      <section className="w-full px-3 pt-20 pb-10 md:px-5">
        <div className="relative mx-auto flex h-[75vh] max-w-[1600px] flex-col justify-end overflow-hidden rounded-[2rem] bg-white shadow-2xl sm:h-[70vh] md:h-[85vh]">
          <Skeleton className="absolute inset-0 rounded-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

          <div className="relative z-10 w-full max-w-[900px] px-5 pt-32 pb-8 md:px-14 md:pt-48 md:pb-12">
            <Skeleton className="mb-4 h-11 w-3/4 rounded-full bg-white/80 md:h-14" />
            <Skeleton className="mb-6 h-5 w-2/3 rounded-full bg-white/60" />
            <div className="mb-6 flex gap-3">
              <Skeleton className="h-11 w-36 rounded-full bg-white/80" />
              <Skeleton className="h-11 w-32 rounded-full bg-white/50" />
            </div>
            <div className="flex gap-6 border-t border-white/10 pt-5">
              <Skeleton className="h-4 w-28 rounded-full bg-white/60" />
              <Skeleton className="h-4 w-24 rounded-full bg-white/60" />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1100px] px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 border-b border-[#e2e8f0] py-10 md:py-14 lg:grid-cols-[1fr_320px]">
          <div>
            <SectionHeadingSkeleton />
            <div className="space-y-3">
              <Skeleton className="h-5 w-full rounded-full bg-[#F1F5F9]" />
              <Skeleton className="h-5 w-11/12 rounded-full bg-[#F1F5F9]" />
              <Skeleton className="h-5 w-4/5 rounded-full bg-[#F1F5F9]" />
            </div>
          </div>

          <div className="rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <Skeleton className="mb-5 h-6 w-36 rounded-full" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between gap-4">
                  <Skeleton className="h-4 w-24 rounded-full bg-[#F1F5F9]" />
                  <Skeleton className="h-4 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-b border-[#e2e8f0] py-10 md:py-14">
          <SectionHeadingSkeleton />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3">
                <Skeleton className="h-4 w-4 rounded-full bg-[#D1FAE5]" />
                <Skeleton className="h-4 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="py-10 md:py-14">
          <div className="overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-5 md:px-8">
              <Skeleton className="h-10 w-10 rounded-xl bg-[#DBEAFE]" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-56 rounded-full" />
                <Skeleton className="h-3 w-64 rounded-full bg-[#F1F5F9]" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 border-b border-[#e2e8f0] px-6 py-7 md:px-8 lg:grid-cols-2 lg:gap-10">
              <div>
                <Skeleton className="mb-4 h-5 w-28 rounded-full" />
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <OptionCardSkeleton key={index} />
                  ))}
                </div>
              </div>

              <div>
                <Skeleton className="mb-4 h-5 w-24 rounded-full" />
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <OptionCardSkeleton key={index} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 bg-[#f8fafc] px-6 py-5 md:px-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-40 rounded-full bg-[#F1F5F9]" />
                <Skeleton className="h-9 w-44 rounded-full bg-[#E0F2FE]" />
              </div>
              <Skeleton className="h-14 w-full rounded-2xl bg-[#DBEAFE] sm:w-52" />
            </div>
          </div>
        </div>

        <section className="scroll-mt-24 border-b border-[#e2e8f0] py-10 md:py-14">
          <SectionHeadingSkeleton />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            <Skeleton className="col-span-2 row-span-2 aspect-square rounded-2xl md:col-span-2" />
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="aspect-square rounded-2xl" />
          </div>
        </section>
      </div>
    </main>
  );
}
