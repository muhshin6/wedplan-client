"use client"

import Link from "next/link"
import { XCircle, ArrowRight, CreditCard } from "lucide-react"

import AuthRedirect from "@/components/auth/auth-redirect"
import { Button } from "@/components/ui/button"

function PaymentCancelContent() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#DDF2FD]/40 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-[#9BBEC8]/40 bg-white p-8 text-center shadow-xl shadow-[#164863]/5 sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
          <XCircle className="h-10 w-10" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-[#164863]">
          Payment Cancelled
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#427D9D]">
          Your payment was cancelled and no charges were made. Your current plan
          is unchanged.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/vendor/dashboard/subscription">
            <Button className="w-full bg-[#164863] text-[#DDF2FD] hover:bg-[#427D9D] sm:w-auto">
              <CreditCard className="mr-2 h-4 w-4" />
              Back to Plans
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button variant="outline" className="w-full sm:w-auto">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function PaymentCancelPage() {
  return (
    <AuthRedirect>
      <PaymentCancelContent />
    </AuthRedirect>
  )
}
