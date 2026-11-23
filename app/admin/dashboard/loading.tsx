export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-72 animate-pulse rounded-lg bg-[#9BBEC8]/30" />
      <div className="h-5 w-96 max-w-full animate-pulse rounded bg-[#9BBEC8]/20" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-2xl bg-white/80"
          />
        ))}
      </div>
    </div>
  )
}
