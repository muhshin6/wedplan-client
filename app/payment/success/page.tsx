"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  CheckCircle2,
  ArrowRight,
  CreditCard,
  Loader2,
  ShieldCheck,
} from "lucide-react"

import AuthRedirect from "@/components/auth/auth-redirect"
import { Button } from "@/components/ui/button"
import { API_URL } from "@/lib/api"
import { authClient } from "@/lib/auth-client"

interface PaymentInfo {
  planName?: string
  amount?: number
  currency?: string
  status?: string
  createdAt?: string
}

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  const [loading, setLoading] = useState(true)
  const [payment, setPayment] = useState<PaymentInfo | null>(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    let ignore = false

    async function checkPayment() {
      if (!sessionId) {
        setMessage("No payment session was found in the URL.")
        setLoading(false)
        return
      }

      try {
        // Read-only status lookup. The plan is activated only by Stripe's
        // verified webhook — this page cannot change subscription state.
        const response = await fetch(
          `${API_URL}/api/payment/status?session_id=${encodeURIComponent(sessionId)}`,
          { credentials: "include" }
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || "Could not verify payment.")
        }

        if (!ignore) {
          setPayment(result.data || null)
          setMessage(result.message || "")

          // Refresh the cached client session so the Navbar and other
          // components immediately reflect the webhook-activated plan.
          if (result.status === "success") {
            await authClient.getSession()
          }
        }
      } catch (error) {
        if (!ignore) {
          setMessage(
            error instanceof Error ? error.message : "Could not verify payment."
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    void checkPayment()

    return () => {
      ignore = true
    }
  }, [sessionId])

  const isVerified = payment?.status === "success"

  // After a verified payment, go straight back to the subscription page so
  // the newly purchased plan is shown as selected.
  useEffect(() => {
    if (!isVerified) return

    const timer = window.setTimeout(() => {
      router.replace("/vendor/dashboard/subscription")
    }, 2500)

    return () => window.clearTimeout(timer)
  }, [isVerified, router])

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#DDF2FD]/40 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-2xl border border-[#9BBEC8]/40 bg-white p-8 text-center shadow-xl shadow-[#164863]/5 sm:p-10"
      >
        <div
          className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
            loading
              ? "bg-[#DDF2FD] text-[#427D9D]"
              : isVerified
                ? "bg-green-100 text-green-600"
                : "bg-amber-100 text-amber-600"
          }`}
        >
          {loading ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : isVerified ? (
            <CheckCircle2 className="h-10 w-10" />
          ) : (
            <ShieldCheck className="h-10 w-10" />
          )}
        </div>

        <h1 className="mt-6 text-3xl font-bold text-[#164863]">
          {loading
            ? "Verifying your payment..."
            : isVerified
              ? "Payment Successful"
              : "Payment Received"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#427D9D]">
          {loading
            ? "Please wait while we confirm your payment with Stripe."
            : isVerified
              ? "Your subscription is active. Redirecting you to your subscription..."
              : message ||
                "Your payment is being verified. Your plan will update automatically once Stripe confirms it."}
        </p>

        {isVerified && payment && (
          <div className="mt-6 space-y-2 rounded-xl border border-[#9BBEC8]/40 bg-[#F4F8FB] p-5 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-[#427D9D]">Plan</span>
              <span className="font-semibold text-[#164863] capitalize">
                {payment.planName || "Premium"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#427D9D]">Amount</span>
              <span className="font-semibold text-[#164863]">
                ৳{Number(payment.amount).toLocaleString("en-BD")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#427D9D]">Status</span>
              <span className="font-semibold text-green-600 capitalize">
                {payment.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#427D9D]">Date</span>
              <span className="font-semibold text-[#164863]">
                {payment.createdAt
                  ? new Date(payment.createdAt).toLocaleString()
                  : "—"}
              </span>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/vendor/dashboard/subscription">
            <Button className="w-full bg-[#164863] text-[#DDF2FD] hover:bg-[#427D9D] sm:w-auto">
              <CreditCard className="mr-2 h-4 w-4" />
              View Subscription
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button variant="outline" className="w-full sm:w-auto">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </main>
  )
}

export default function PaymentSuccessPage() {
  return (
    <AuthRedirect>
      <PaymentSuccessContent />
    </AuthRedirect>
  )
}
