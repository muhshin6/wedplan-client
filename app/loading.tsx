export default function Loading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#DDF2FD]/40 px-4">
      <div className="w-full max-w-5xl space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-[#9BBEC8]/30" />
        <div className="h-5 w-96 max-w-full animate-pulse rounded-lg bg-[#9BBEC8]/20" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-2xl border border-[#9BBEC8]/30 bg-white/70"
            />
          ))}
        </div>
      </div>
    </main>
  )
}
