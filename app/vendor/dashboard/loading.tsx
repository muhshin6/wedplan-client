export default function DashboardLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-5xl space-y-6">
        <div className="h-40 animate-pulse rounded-3xl bg-[#164863]/20" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-2xl bg-[#9BBEC8]/30"
            />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-2xl bg-white/80" />
          <div className="h-64 animate-pulse rounded-2xl bg-white/80" />
        </div>
      </div>
    </div>
  )
}
