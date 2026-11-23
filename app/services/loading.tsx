export default function ServicesLoading() {
  return (
    <main className="min-h-screen bg-[#F4F8FB] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="h-80 animate-pulse rounded-[28px] bg-[#9BBEC8]/30" />
        <div className="h-8 w-72 animate-pulse rounded-lg bg-[#9BBEC8]/30" />
        <div className="h-24 animate-pulse rounded-2xl bg-white" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="space-y-4">
              <div className="h-56 animate-pulse rounded-2xl bg-[#9BBEC8]/30" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-[#9BBEC8]/20" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-[#9BBEC8]/20" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
