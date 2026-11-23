export default function CustomerDashboardLoading() {
  return (
    <main className="min-h-screen bg-[#F4F8FB] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-40 animate-pulse rounded-3xl bg-[#9BBEC8]/30" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-white" />
      </div>
    </main>
  )
}
