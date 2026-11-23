"use client"

import { useEffect } from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#DDF2FD]/40 px-4 dark:bg-[#0B1922]">
      <div className="w-full max-w-lg rounded-2xl border border-[#9BBEC8]/40 bg-white p-8 text-center shadow-xl shadow-[#164863]/5 sm:p-10 dark:bg-[#122B3A]">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle className="h-10 w-10" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-[#164863] dark:text-[#DDF2FD]">
          Something went wrong
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#427D9D]">
          We could not load this page. Please try again — if the problem
          continues, check your connection or contact support.
        </p>

        {error.message && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-left text-xs break-words text-red-600">
            {error.message}
          </p>
        )}

        <Button
          onClick={reset}
          className="mt-7 inline-flex items-center gap-2 bg-[#164863] text-[#DDF2FD] hover:bg-[#427D9D]"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </Button>
      </div>
    </main>
  )
}
