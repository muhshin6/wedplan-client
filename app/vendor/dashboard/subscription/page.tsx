"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { API_URL } from "@/lib/api"
import {
  CreditCard,
  History,
  Lock,
  Star,
  Check,
  ChevronRight,
  Crown,
  ShieldCheck,
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
  const [currentPlan, setCurrentPlan] = useState("free")
  const [currentPlanData, setCurrentPlanData] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"plans" | "billing">("plans")

  useEffect(() => {
    async function loadSubscription() {
      try {
        const response = await fetch(`${API_URL}/api/subscription`, {
          credentials: "include",
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
      } finally {
        setLoading(false)
      }
    }

    void loadSubscription()
  }, [])

  async function handleUpgrade(planId: string) {
    if (planId === currentPlan) return

    setUpgrading(planId)
    const toastId = toast.loading(`Upgrading to ${planId}...`)

    try {
      const response = await fetch(`${API_URL}/api/subscription/upgrade`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to upgrade plan.")
      }

      await authClient.getSession()
      setCurrentPlan(planId)
      setCurrentPlanData(result.data)

      toast.success(`Upgraded to ${result.data.name} plan!`, { id: toastId })
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
        { id: toastId }
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
      <Card className="rounded-2xl border border-[#9BBEC8]/40 bg-[#164863]/5 p-6">
        <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="text-lg font-bold">Current Plan</CardTitle>
            <CardDescription className="text-sm text-[#164863]/70">
              Your active subscription
            </CardDescription>
          </div>
          <Badge className="bg-[#164863] px-4 py-1.5 text-xs tracking-wider text-[#DDF2FD] uppercase">
            {loading ? "Loading..." : currentPlan}
          </Badge>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#9BBEC8]/30 bg-white/70 p-4">
              <p className="text-xs tracking-wider text-[#427D9D] uppercase">
                Active service limit
              </p>
              <p className="mt-1 text-2xl font-bold text-[#164863]">
                {currentPlanData?.maxActiveServices === null
                  ? "Unlimited"
                  : `${currentPlanData?.maxActiveServices ?? 3} services`}
              </p>
            </div>
            <div className="rounded-xl border border-[#9BBEC8]/30 bg-white/70 p-4">
              <p className="text-xs tracking-wider text-[#427D9D] uppercase">
                Premium Vendor Badge
              </p>
              <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-[#164863]">
                {currentPlanData?.hasPremiumBadge ? (
                  <>
                    <ShieldCheck className="h-6 w-6 text-[#427D9D]" /> Active
                  </>
                ) : (
                  "Not included"
                )}
              </p>
            </div>
          </div>
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
                        "Upgrading..."
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
          <Card className="rounded-xl border border-[#9BBEC8]/40 p-6">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <History className="mb-3 h-8 w-8 text-[#9BBEC8]/40" />
              <p className="text-sm text-[#164863]/60">
                No billing records yet.
              </p>
              <p className="mt-1 text-xs text-[#427D9D]/50">
                Invoices will appear here after payments are enabled.
              </p>
            </div>
          </Card>
        </div>
      )}
    </section>
  )
}
