"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { apiFetch } from "@/lib/api"
import {
  CreditCard,
  History,
  Lock,
  Star,
  Check,
  ChevronRight,
  Crown,
  ShieldCheck,
  Loader2,
  CheckCircle2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface BillingRecord {
  _id: string
  plan: string
  planName?: string
  amount: number
  currency?: string
  status: string
  createdAt: string
  stripeSessionId?: string
}

interface Plan {
  id: string
  name: string
  maxActiveServices: number | null
  hasPremiumBadge: boolean
  features: string[]
  price: string
  description: string
}

const planDetails: Record<string, { price: string; description: string }> = {
  free: { price: "৳0", description: "Everything you need to get started." },
  basic: {
    price: "৳1,900",
    description: "More room to grow your wedding business.",
  },
  premium: {
    price: "৳4,900",
    description: "Unlimited listings and premium vendor benefits.",
  },
}

export default function SubscriptionPage() {
  const router = useRouter()
  const { data: session } = authClient.useSession()

  // Seed from the session so the correct plan shows immediately instead of
  // flashing "Free" / "Loading..." while the API request is in flight.
  const sessionPlan =
    (session?.user as { plan?: string } | undefined)?.plan || "free"
  const [currentPlan, setCurrentPlan] = useState(sessionPlan)
  const [currentPlanData, setCurrentPlanData] = useState<Plan | null>(null)
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"plans" | "billing">("plans")
  const [confirmingPayment, setConfirmingPayment] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([])
  const [billingLoading, setBillingLoading] = useState(false)

  useEffect(() => {
    async function loadSubscription() {
      try {
        const response = await apiFetch(`/api/subscription`, {
          cache: "no-store",
        })

        const result = await response.json()

        if (response.ok && result.success) {
          setCurrentPlan(result.data.id)
          setCurrentPlanData(result.data)
        }
      } catch {
        // Fall back to the session value / free plan
        const session = await authClient.getSession()
        const plan = (session.data?.user as { plan?: string } | undefined)?.plan
        if (plan) setCurrentPlan(plan)
      }
    }

    void loadSubscription()
  }, [])

  // After returning from Stripe, poll the read-only status endpoint until the
  // server-side webhook confirms the payment, then refresh the session so the
  // purchased plan shows as current. This never activates a plan client-side.
  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    )

    if (!sessionId) return

    const paymentSessionId = sessionId
    let cancelled = false
    let attempts = 0

    async function pollForConfirmation() {
      if (!cancelled) setConfirmingPayment(true)

      try {
        const response = await apiFetch(
          `/api/payment/status?session_id=${encodeURIComponent(paymentSessionId)}`
        )

        const result = await response.json()

        if (!cancelled && result.status === "success") {
          await authClient.getSession()
          setCurrentPlan(result.data.plan)

          const subResponse = await apiFetch(`/api/subscription`, {
            cache: "no-store",
          })
          const subResult = await subResponse.json()

          if (subResult.success) setCurrentPlanData(subResult.data)

          if (!cancelled) {
            setConfirmingPayment(false)
            setPaymentConfirmed(true)
          }
          router.refresh()
          window.history.replaceState({}, "", window.location.pathname)
          return
        }
      } catch {
        // keep polling
      }

      if (!cancelled && attempts < 20) {
        attempts += 1
        window.setTimeout(() => void pollForConfirmation(), 2000)
      } else if (!cancelled) {
        setConfirmingPayment(false)
      }
    }

    void pollForConfirmation()

    return () => {
      cancelled = true
    }
  }, [router])

  // Load the vendor's own billing history (read-only from the server)
  useEffect(() => {
    let ignore = false

    async function loadBillingHistory() {
      try {
        const response = await apiFetch(`/api/payment/my-transactions`)

        const result = await response.json()

        if (response.ok && result.success && !ignore) {
          setBillingRecords(result.data)
        }
      } catch {
        // billing history is optional information
      } finally {
        if (!ignore) setBillingLoading(false)
      }
    }

    void loadBillingHistory()

    return () => {
      ignore = true
    }
  }, [])

  async function handleUpgrade(planId: string) {
    if (planId === currentPlan) return

    // Free requires no payment — cancel the paid subscription instead.
    if (planId === "free") {
      await handleCancelSubscription()
      return
    }

    setUpgrading(planId)

    try {
      const response = await apiFetch(`/api/payment/create-checkout-session`, {
        method: "POST",
        body: JSON.stringify({ plan: planId }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to start checkout.")
      }

      // Redirect to Stripe-hosted checkout. Plan activation happens only
      // after Stripe's verified webhook reaches the server.
      window.location.assign(result.sessionUrl)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      )
      setUpgrading(null)
    }
  }

  async function handleCancelSubscription() {
    setUpgrading("cancel")

    try {
      const response = await apiFetch(`/api/payment/cancel-subscription`, {
        method: "POST",
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to cancel subscription.")
      }

      await authClient.getSession()
      setCurrentPlan("free")
      toast.success("Subscription canceled. You are back on the Free plan.")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setUpgrading(null)
    }
  }

  const plans: Plan[] = ["free", "basic", "premium"].map((id) => {
    const features =
      id === "premium"
        ? [
            "Unlimited active services",
            "Premium Vendor Badge",
            "All Free Plan Features",
          ]
        : id === "basic"
          ? [
              "Maximum 10 active services",
              "Basic Vendor Dashboard",
              "Booking Request Management",
              "Email support",
            ]
          : [
              "Maximum 3 active services",
              "Basic Vendor Dashboard",
              "Booking Request Management",
            ]

    return {
      id,
      features,
      maxActiveServices: id === "free" ? 3 : id === "basic" ? 10 : null,
      hasPremiumBadge: id === "premium",
      price: planDetails[id].price,
      description: planDetails[id].description,
      name: id.charAt(0).toUpperCase() + id.slice(1),
    }
  })

  return (
    <section className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[#427D9D]" />
          <h1 className="text-3xl font-bold text-[#164863]">Subscription</h1>
        </div>
        <p className="text-[#164863]/70">
          Choose a plan that fits your wedding business and manage your billing.
        </p>
      </div>

      {/* Current plan */}
      {paymentConfirmed && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          Payment successful! Your new plan is now active below.
        </div>
      )}

      {confirmingPayment && (
        <div className="flex items-center gap-3 rounded-xl border border-[#427D9D]/30 bg-white/80 px-4 py-3 text-sm text-[#164863]">
          <Loader2 className="h-4 w-4 animate-spin text-[#427D9D]" />
          Confirming your payment with Stripe. Your plan will update as soon as
          the payment is verified.
        </div>
      )}

      <Card className="rounded-2xl border border-[#9BBEC8]/40 bg-[#164863]/5 p-6">
        <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="text-lg font-bold">Current Plan</CardTitle>
            <CardDescription className="text-sm text-[#164863]/70">
              Your active subscription
            </CardDescription>
          </div>
          <Badge className="bg-[#164863] px-4 py-1.5 text-xs tracking-wider text-[#DDF2FD] uppercase">
            {currentPlan}
          </Badge>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#9BBEC8]/30 bg-white/70 p-4">
              <p className="text-xs tracking-wider text-[#427D9D] uppercase">
                Active service limit
              </p>
              <p className="mt-1 text-2xl font-bold text-[#164863]">
                {currentPlanData
                  ? currentPlanData.maxActiveServices === null
                    ? "Unlimited"
                    : `${currentPlanData.maxActiveServices} services`
                  : currentPlan === "premium"
                    ? "Unlimited"
                    : currentPlan === "basic"
                      ? "10 services"
                      : "3 services"}
              </p>
            </div>
            <div className="rounded-xl border border-[#9BBEC8]/30 bg-white/70 p-4">
              <p className="text-xs tracking-wider text-[#427D9D] uppercase">
                Premium Vendor Badge
              </p>
              <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-[#164863]">
                {currentPlanData?.hasPremiumBadge ||
                currentPlan === "premium" ? (
                  <>
                    <ShieldCheck className="h-6 w-6 text-[#427D9D]" /> Active
                  </>
                ) : (
                  "Not included"
                )}
              </p>
            </div>
          </div>

          {currentPlan !== "free" && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#9BBEC8]/30 bg-white/70 px-4 py-3">
              <p className="text-sm text-[#427D9D]">
                Billed monthly through Stripe. You can cancel anytime.
              </p>
              <Button
                onClick={() => void handleCancelSubscription()}
                disabled={upgrading !== null}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                {upgrading === "cancel" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Canceling...
                  </>
                ) : (
                  "Cancel Subscription"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Choose a plan */}
      <div>
        <h2 className="mb-6 text-xl font-bold text-[#164863]">Choose a Plan</h2>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan
            const isPremium = plan.id === "premium"

            return (
              <div
                key={plan.id}
                className={`relative flex h-full ${
                  isPremium ? "sm:col-span-2 xl:col-span-1" : ""
                }`}
              >
                {isPremium && (
                  <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                    <Badge className="bg-[#164863] px-3 py-1 text-xs tracking-wider text-[#DDF2FD] uppercase shadow-md">
                      <Crown className="mr-1 h-3 w-3" />
                      Best value
                    </Badge>
                  </div>
                )}

                <Card
                  className={`relative h-full w-full rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
                    isPremium
                      ? "border-[#427D9D] shadow-[0_0_0_1px_rgba(66,125,157,0.2)]"
                      : isCurrent
                        ? "border-[#164863] bg-[#164863]/5"
                        : "border-[#9BBEC8]/40"
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold">
                      {plan.name}
                      {isPremium && (
                        <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                      )}
                    </CardTitle>
                    <CardDescription className="min-h-10">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 pt-0">
                    <div className="mb-6 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-[#164863]">
                        {plan.price}
                      </span>
                      <span className="text-sm text-[#427D9D]">/month</span>
                    </div>

                    <ul
                      className={`mb-6 ${
                        isPremium
                          ? "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1"
                          : "space-y-3"
                      }`}
                    >
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-[#164863]/80"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#427D9D]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={() => void handleUpgrade(plan.id)}
                      disabled={isCurrent || upgrading !== null}
                      className={`w-full ${
                        isPremium ? "sm:max-w-xs xl:max-w-none" : ""
                      } ${
                        isCurrent
                          ? "cursor-not-allowed bg-[#9BBEC8]/30 text-[#164863]"
                          : "bg-[#164863] text-[#DDF2FD] hover:bg-[#427D9D]"
                      }`}
                    >
                      {isCurrent ? (
                        "Current Plan"
                      ) : upgrading === plan.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Upgrading...
                        </>
                      ) : isPremium ? (
                        <>
                          Upgrade to Premium
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Choose {plan.name}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )
          })}
        </div>
      </div>

      <Separator className="border-[#9BBEC8]/30" />

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#9BBEC8]/30 pb-2">
        <button
          onClick={() => setActiveTab("plans")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "plans"
              ? "border-b-2 border-[#164863] text-[#164863]"
              : "text-[#427D9D]/70 hover:text-[#164863]"
          }`}
        >
          Plans
        </button>
        <button
          onClick={() => setActiveTab("billing")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "billing"
              ? "border-b-2 border-[#164863] text-[#164863]"
              : "text-[#427D9D]/70 hover:text-[#164863]"
          }`}
        >
          Billing History
        </button>
      </div>

      {activeTab === "plans" ? (
        <div className="mt-6">
          <h3 className="mb-4 text-lg font-bold text-[#164863]">
            Payment Method
          </h3>
          <Card className="rounded-xl border border-[#9BBEC8]/40 p-6">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#9BBEC8]/40 bg-[#164863]/10">
                <Lock className="h-5 w-5 text-[#164863]" />
              </div>
              <div>
                <div className="font-medium text-[#164863]">
                  No payment method on file
                </div>
                <div className="text-xs text-[#427D9D]/70">
                  Plan changes are applied instantly in this demo environment.
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="mt-6">
          <h3 className="mb-4 text-lg font-bold text-[#164863]">
            Billing History
          </h3>
          <Card className="overflow-hidden rounded-xl border border-[#9BBEC8]/40">
            {billingLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-[#427D9D]" />
              </div>
            ) : billingRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                <History className="mb-3 h-8 w-8 text-[#9BBEC8]/40" />
                <p className="text-sm text-[#164863]/60">
                  No billing records yet.
                </p>
                <p className="mt-1 text-xs text-[#427D9D]/50">
                  Your subscription payments will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-150 text-left">
                  <thead className="bg-[#F4F8FB]">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wider text-[#427D9D] uppercase">
                        Plan
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wider text-[#427D9D] uppercase">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wider text-[#427D9D] uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wider text-[#427D9D] uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#9BBEC8]/20">
                    {billingRecords.map((record) => (
                      <tr key={record._id} className="hover:bg-[#F8FBFD]">
                        <td className="px-4 py-3 text-sm font-semibold text-[#164863] capitalize">
                          {record.planName || record.plan}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-[#164863]">
                          ৳{Number(record.amount).toLocaleString("en-BD")}
                          <span className="ml-1 text-xs font-normal text-[#427D9D]">
                            {record.currency || "BDT"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 capitalize">
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#427D9D]">
                          {new Date(record.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}
    </section>
  )
}
