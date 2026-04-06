import Skeleton from "@/components/ui/Skeleton";

function SectionHeadingSkeleton() {
  return (
    <div className="mb-6 flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-xl bg-[#DBEAFE]" />
      <Skeleton className="h-8 w-56 rounded-full" />
    </div>
  );
}

function SelectionCardSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-[#e2e8f0] bg-[#f8fafc] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 items-start gap-2.5">
          <Skeleton className="mt-0.5 h-5 w-5 rounded-full bg-[#DBEAFE]" />
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

export default function HotelDetailSkeleton() {
  return (
    <main className="bg-[#FAFAFA]">
      <section className="w-full px-3 pt-20 pb-10 md:px-5">
        <div className="mx-auto max-w-[1600px]">
          <div className="relative mb-3 h-[58vh] overflow-hidden rounded-[2rem] bg-white shadow-2xl sm:h-[65vh] md:h-[78vh]">
            <Skeleton className="absolute inset-0 rounded-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

            <div className="absolute bottom-0 z-10 w-full max-w-[900px] px-5 pt-32 pb-8 md:px-14 md:pt-48 md:pb-12">
              <Skeleton className="mb-4 h-11 w-3/4 rounded-full bg-white/80 md:h-14" />
              <Skeleton className="mb-3 h-5 w-36 rounded-full bg-white/60" />
              <div className="mb-8 flex gap-2">
                <Skeleton className="h-11 w-36 rounded-full bg-white/80" />
                <Skeleton className="h-11 w-32 rounded-full bg-white/50" />
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-hidden px-2 py-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-[60px] w-[90px] shrink-0 rounded-xl bg-white"
              />
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1100px] px-4 md:px-8 lg:px-12">
        <div className="border-b border-[#e2e8f0] py-10 md:py-14">
          <section className="mb-10">
            <SectionHeadingSkeleton />
            <div className="max-w-3xl space-y-3">
              <Skeleton className="h-5 w-full rounded-full bg-[#F1F5F9]" />
              <Skeleton className="h-5 w-11/12 rounded-full bg-[#F1F5F9]" />
              <Skeleton className="h-5 w-4/5 rounded-full bg-[#F1F5F9]" />
            </div>
          </section>

          <section>
            <SectionHeadingSkeleton />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2.5 px-1 py-2">
                  <Skeleton className="h-4 w-4 rounded-full bg-[#D1FAE5]" />
                  <Skeleton className="h-4 w-28 rounded-full" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="scroll-mt-24 py-10 md:py-14">
          <div className="overflow-visible rounded-3xl border border-[#e2e8f0] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-5 md:px-8">
              <Skeleton className="h-10 w-10 shrink-0 rounded-xl bg-[#DBEAFE]" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-52 rounded-full" />
                <Skeleton className="h-3 w-64 rounded-full bg-[#F1F5F9]" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 border-b border-[#e2e8f0] px-6 py-7 md:px-8 lg:grid-cols-2">
              <div>
                <Skeleton className="mb-4 h-5 w-24 rounded-full" />
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <SelectionCardSkeleton key={index} />
                  ))}
                </div>
              </div>

              <div>
                <Skeleton className="mb-4 h-5 w-28 rounded-full" />
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <SelectionCardSkeleton key={index} />
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                <Skeleton className="mb-4 h-5 w-32 rounded-full" />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24 rounded-full bg-[#F1F5F9]" />
                    <Skeleton className="h-12 w-full rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-28 rounded-full bg-[#F1F5F9]" />
                    <Skeleton className="h-12 w-full rounded-2xl" />
                  </div>
                </div>
                <Skeleton className="mt-4 h-11 w-40 rounded-xl bg-[#FEF3C7]" />
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 px-6 py-6 md:px-8 sm:flex-row">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 rounded-full bg-[#F1F5F9]" />
                <Skeleton className="h-10 w-48 rounded-full bg-[#E0F2FE]" />
              </div>
              <Skeleton className="h-14 w-full rounded-2xl bg-[#DBEAFE] sm:w-52" />
            </div>
          </div>
        </div>

        <section className="border-t border-[#e2e8f0] py-10 md:py-14">
          <SectionHeadingSkeleton />
          <div className="grid gap-4 md:auto-rows-[280px] md:grid-cols-2 xl:grid-cols-3">
            <Skeleton className="min-h-[320px] rounded-[24px] md:row-span-2" />
            <Skeleton className="rounded-[24px]" />
            <Skeleton className="rounded-[24px]" />
            <Skeleton className="rounded-[24px]" />
            <Skeleton className="rounded-[24px]" />
          </div>
        </section>
      </div>
    </main>
  );
}
