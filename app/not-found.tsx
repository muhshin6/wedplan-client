import Link from "next/link"
import { ArrowLeft, Compass, Sparkles } from "lucide-react"

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#DDF2FD]/40 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-[#9BBEC8]/40 bg-white p-8 text-center shadow-xl shadow-[#164863]/5 sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#DDF2FD] text-[#427D9D]">
          <Compass className="h-10 w-10" />
        </div>

        <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#DDF2FD]/70 px-4 py-2 text-xs font-bold tracking-wider text-[#427D9D] uppercase">
          <Sparkles className="h-3.5 w-3.5" />
          Lost in the details
        </span>

        <h1 className="mt-5 text-4xl font-extrabold text-[#164863]">404</h1>
        <p className="mt-2 text-lg font-semibold text-[#164863]">
          This page could not be found
        </p>
        <p className="mt-3 text-sm leading-6 text-[#427D9D]">
          The address may be outdated, or the page may have moved. Let&apos;s
          get you back on track.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#164863] px-5 py-3 text-sm font-semibold text-[#DDF2FD] transition hover:bg-[#427D9D]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9BBEC8] px-5 py-3 text-sm font-semibold text-[#164863] transition hover:bg-[#DDF2FD]/50"
          >
            Browse Services
          </Link>
        </div>
      </div>
    </main>
  )
}
