"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ClipboardList,
  RefreshCw,
  Sparkles,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import AuthRedirect from "@/components/auth/auth-redirect"

interface Booking {
  _id: string
  serviceId: string
  customerId: string
  customerName: string
  customerEmail: string
  eventDate: string
  status: string
  createdAt: string
}

interface DashboardStats {
  totalBookings: number
  pendingBookings: number
  approvedBookings: number
  cancelledBookings: number
}

type StatKey = keyof DashboardStats

const statsCards: {
  title: string
  value: StatKey
  description: string
  icon: typeof ClipboardList
  color: string
  bg: string
  gradient: string
}[] = [
  {
    title: "Total Bookings",
    value: "totalBookings",
    description: "All your booking requests",
    icon: ClipboardList,
    color: "#164863",
    bg: "#DDF2FD",
    gradient: "from-[#DDF2FD] to-white",
  },
  {
    title: "Pending Bookings",
    value: "pendingBookings",
    description: "Waiting for confirmation",
    icon: Clock3,
    color: "#D97706",
    bg: "#FEF3C7",
    gradient: "from-amber-50 to-white",
  },
  {
    title: "Approved Bookings",
    value: "approvedBookings",
    description: "Your confirmed bookings",
    icon: CheckCircle2,
    color: "#15803D",
    bg: "#DCFCE7",
    gradient: "from-green-50 to-white",
  },
  {
    title: "Cancelled Bookings",
    value: "cancelledBookings",
    description: "Cancelled requests",
    icon: XCircle,
    color: "#DC2626",
    bg: "#FEE2E2",
    gradient: "from-red-50 to-white",
  },
]

function formatDate(date: string) {
  if (!date) return "Date unavailable"

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable"
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "approved":
    case "accepted":
    case "confirmed":
      return "bg-green-50 text-green-700 ring-green-200"

    case "pending":
      return "bg-amber-50 text-amber-700 ring-amber-200"

    case "cancelled":
      return "bg-red-50 text-red-700 ring-red-200"

    case "rejected":
      return "bg-slate-100 text-slate-600 ring-slate-200"

    default:
      return "bg-blue-50 text-blue-700 ring-blue-200"
  }
}

function CustomerDashboardContent() {
  const [bookings, setBookings] = useState<Booking[]>([])

  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    cancelledBookings: 0,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()

    async function fetchCustomerBookings() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/bookings/customer/my-bookings",
          {
            credentials: "include",
            signal: controller.signal,
          }
        )

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch bookings.")
        }

        const customerBookings: Booking[] = result.data

        setBookings(customerBookings)

        setStats({
          totalBookings: customerBookings.length,

          pendingBookings: customerBookings.filter(
            (booking) => booking.status === "pending"
          ).length,

          approvedBookings: customerBookings.filter(
            (booking) =>
              booking.status === "approved" ||
              booking.status === "accepted" ||
              booking.status === "confirmed"
          ).length,

          cancelledBookings: customerBookings.filter(
            (booking) => booking.status === "cancelled"
          ).length,
        })

        setError("")
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return
        }

        console.error("Customer bookings error:", error)

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void fetchCustomerBookings()

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F4F8FB] px-4 py-8 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#DDF2FD]/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#9BBEC8]/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl space-y-8">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#164863] via-[#205D7D] to-[#427D9D] p-6 text-white shadow-xl shadow-[#164863]/15 sm:p-8 lg:p-10"
        >
          <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full border border-white/10 bg-white/5" />
          <div className="pointer-events-none absolute -top-12 -right-4 h-48 w-48 rounded-full border border-white/10" />

          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Your Wedding Journey
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Welcome to WedPlan
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                Your special day deserves something extraordinary. Manage your
                bookings and bring your wedding vision to life.
              </p>
            </div>

            <Link
              href="/services"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-[#164863] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#DDF2FD] hover:shadow-xl"
            >
              Explore Services
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* Statistics */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold tracking-tight text-[#164863] sm:text-2xl">
              Booking Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Keep track of your wedding service requests.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon
              const value = stats[stat.value]

              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -5 }}
                  className={`group relative overflow-hidden rounded-2xl border border-[#DDF2FD] bg-linear-to-br ${stat.gradient} p-5 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-[#164863]/5`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {stat.title}
                      </p>

                      <h3 className="mt-3 text-3xl font-bold tracking-tight text-[#164863]">
                        {isLoading ? (
                          <span className="inline-block h-9 w-12 animate-pulse rounded-md bg-slate-200" />
                        ) : (
                          value
                        )}
                      </h3>
                    </div>

                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: stat.bg,
                        color: stat.color,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-slate-400">
                    {stat.description}
                  </p>

                  <div
                    className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full opacity-20 blur-2xl"
                    style={{ backgroundColor: stat.color }}
                  />
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Recent Bookings */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="overflow-hidden rounded-2xl border border-[#DDF2FD] bg-white/90 shadow-sm backdrop-blur-sm"
        >
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#164863]">
                Recent Bookings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest wedding service requests
              </p>
            </div>

            <Link
              href="/customer/bookings"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#427D9D] transition-colors hover:text-[#164863]"
            >
              View All
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="space-y-4 p-5 sm:p-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-100" />

                    <div className="space-y-2">
                      <div className="h-4 w-32 rounded bg-slate-100" />
                      <div className="h-3 w-24 rounded bg-slate-100" />
                    </div>
                  </div>

                  <div className="h-7 w-20 rounded-full bg-slate-100" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="flex flex-col items-center px-6 py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <RefreshCw className="h-6 w-6" />
              </div>

              <h3 className="font-semibold text-[#164863]">
                Could not load bookings
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-500">{error}</p>

              <p className="mt-2 text-xs text-slate-400">
                Please refresh the page and try again.
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && bookings.length === 0 && (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#DDF2FD] text-[#164863] shadow-inner"
              >
                <CalendarDays className="h-9 w-9" />
              </motion.div>

              <h3 className="text-lg font-semibold text-[#164863]">
                No bookings yet
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Your wedding journey starts here. Explore our services and find
                the perfect team for your special day.
              </p>

              <Link
                href="/services"
                className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-[#164863] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#164863]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#427D9D]"
              >
                Explore Services
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}

          {/* Booking List */}
          {!isLoading && !error && bookings.length > 0 && (
            <div className="divide-y divide-slate-100">
              {bookings.slice(0, 5).map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.06,
                  }}
                  className="flex flex-col gap-4 p-5 transition-colors duration-200 hover:bg-[#F8FBFD] sm:flex-row sm:items-center sm:justify-between sm:p-6"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DDF2FD] text-[#164863]">
                      <CalendarDays className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-[#164863]">
                        Booking #{booking._id.slice(-6).toUpperCase()}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                        Event date: {formatDate(booking.eventDate)}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Requested: {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold capitalize ring-1 ring-inset ${getStatusStyle(booking.status)}`}
                    >
                      {booking.status}
                    </span>

                    <Link
                      href="/customer/bookings"
                      aria-label={`View booking ${booking._id}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all hover:border-[#427D9D] hover:bg-[#DDF2FD] hover:text-[#164863]"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  )
}

export default function CustomerDashboardPage() {
  return (
    <AuthRedirect>
      <CustomerDashboardContent />
    </AuthRedirect>
  )
}
