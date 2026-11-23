"use client"

import { useEffect, useState } from "react"
import RoleGuard from "@/components/auth/role-guard"
import { authClient } from "@/lib/auth-client"
import { API_URL } from "@/lib/api"
import Link from "next/link"
import { motion } from "framer-motion"

import {
  BriefcaseBusiness,
  CalendarCheck,
  Clock,
  Plus,
  ArrowUpRight,
  BadgeCheck,
  ClipboardList,
  Settings,
  LogOut,
  Crown,
  Loader2,
} from "lucide-react"

// Service Type
interface Service {
  _id: string
  name: string
  status: string
  isActive?: boolean
}

// Booking Type
interface Booking {
  _id: string
  customerName: string
  customerEmail: string
  eventDate: string
  status: string
  message?: string
  serviceId: string
}

function VendorDashboardContent() {
  const { data: session } = authClient.useSession()

  const user = session?.user as
    | { name?: string; email?: string; businessName?: string; plan?: string }
    | undefined

  const businessName = user?.businessName
  const currentPlan = user?.plan || "free"
  const planName =
    currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1) + " Plan"

  // States
  const [totalServices, setTotalServices] = useState(0)
  const [activeServices, setActiveServices] = useState(0)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [bookingLoading, setBookingLoading] = useState(true)

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  )
  const acceptedBookings = bookings.filter(
    (booking) => booking.status === "accepted"
  )

  // Fetch Vendor Services
  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch(
          `${API_URL}/api/services/vendor/my-services`,
          {
            method: "GET",
            credentials: "include",
          }
        )

        const result = await response.json()

        if (response.ok && result.success && Array.isArray(result.data)) {
          const services: Service[] = result.data
          setTotalServices(services.length)
          setActiveServices(
            services.filter(
              (service) =>
                service.isActive === true && service.status === "approved"
            ).length
          )
        }
      } catch (error) {
        console.error("Failed to fetch vendor services:", error)
      }
    }

    fetchServices()
  }, [])

  // Fetch Vendor Bookings
  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch(
          `${API_URL}/api/bookings/vendor/my-bookings`,
          {
            method: "GET",
            credentials: "include",
          }
        )

        const result = await response.json()

        if (response.ok && result.success && Array.isArray(result.data)) {
          setBookings(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error)
      } finally {
        setBookingLoading(false)
      }
    }

    fetchBookings()
  }, [])

  async function handleLogout() {
    await authClient.signOut()
  }

  // Dashboard Statistics
  const stats = [
    {
      title: "Total Services",
      value: String(totalServices),
      description: "Services listed",
      icon: BriefcaseBusiness,
      color: "bg-[#DDF2FD] text-[#164863]",
    },
    {
      title: "Active Services",
      value: String(activeServices),
      description: "Approved & available",
      icon: BadgeCheck,
      color: "bg-[#E0F2FE] text-[#427D9D]",
    },
    {
      title: "Pending Booking Requests",
      value: String(pendingBookings.length),
      description: "Awaiting response",
      icon: Clock,
      color: "bg-[#FEF3C7] text-[#B45309]",
    },
    {
      title: "Accepted Bookings",
      value: String(acceptedBookings.length),
      description: "Confirmed events",
      icon: CalendarCheck,
      color: "bg-[#DCFCE7] text-[#15803D]",
    },
  ]

  // Quick Actions
  const quickActions = [
    {
      title: "Add New Service",
      description: "Showcase your wedding services",
      href: "/vendor/dashboard/add-service",
      icon: Plus,
    },
    {
      title: "Manage Services",
      description: "Update and manage your services",
      href: "/vendor/dashboard/my-services",
      icon: BriefcaseBusiness,
    },
    {
      title: "Booking Requests",
      description: "Manage customer inquiries",
      href: "/vendor/dashboard/booking-requests",
      icon: ClipboardList,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-[#164863] p-6 text-white shadow-xl shadow-[#164863]/15 sm:p-8"
      >
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#427D9D]/40 blur-3xl" />

        <div className="pointer-events-none absolute right-1/3 -bottom-24 h-48 w-48 rounded-full bg-[#9BBEC8]/20 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-[#DDF2FD]">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              Vendor Workspace
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, {user?.name?.split(" ")[0] || "Vendor"}!
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-[#DDF2FD]/75">
              {businessName
                ? `Manage ${businessName} and grow your wedding business with WedPlan.`
                : "Manage your services, connect with customers, and grow your wedding business with WedPlan."}
            </p>
          </div>

          <Link
            href="/vendor/dashboard/add-service"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#DDF2FD] px-5 py-3 text-sm font-semibold text-[#164863] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </Link>
        </div>
      </motion.section>

      {/* Statistics */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#164863] dark:text-[#DDF2FD]">
              Business Overview
            </h2>

            <p className="mt-1 text-sm text-[#427D9D] dark:text-[#9BBEC8]">
              Track your business performance
            </p>
          </div>

          <div className="flex items-center gap-2">
            {bookingLoading && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#427D9D]">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading data...
              </span>
            )}
            <span className="rounded-full bg-[#DDF2FD] px-3 py-1 text-xs font-medium text-[#164863] dark:bg-[#164863]/30 dark:text-[#DDF2FD]">
              Overview
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                }}
                whileHover={{ y: -5 }}
                className="group rounded-2xl border border-[#9BBEC8]/30 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-[#164863]/5 dark:bg-[#101B2A]"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <ArrowUpRight className="h-4 w-4 text-[#9BBEC8] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>

                <p className="mt-5 text-sm font-medium text-[#427D9D] dark:text-[#9BBEC8]">
                  {stat.title}
                </p>

                <h3 className="mt-1 text-3xl font-bold tracking-tight text-[#164863] dark:text-[#DDF2FD]">
                  {stat.value}
                </h3>

                <p className="mt-2 text-xs text-[#9BBEC8]">
                  {stat.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Current Subscription Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-4 flex flex-col justify-between gap-4 rounded-2xl border border-[#9BBEC8]/30 bg-white p-5 shadow-sm sm:flex-row sm:items-center dark:bg-[#101B2A]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#164863] text-[#DDF2FD]">
              <Crown className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-medium text-[#427D9D] dark:text-[#9BBEC8]">
                Current Subscription Plan
              </p>
              <h3 className="mt-1 text-xl font-bold text-[#164863] dark:text-[#DDF2FD]">
                {planName}
              </h3>
              <p className="mt-1 text-xs text-[#9BBEC8]">
                {currentPlan === "free"
                  ? "Maximum 3 active services"
                  : currentPlan === "basic"
                    ? "Maximum 10 active services"
                    : "Unlimited active services"}
              </p>
            </div>
          </div>

          <Link
            href="/vendor/dashboard/subscription"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9BBEC8]/40 px-4 py-2.5 text-sm font-semibold text-[#164863] transition-colors hover:bg-[#DDF2FD] dark:text-[#DDF2FD] dark:hover:bg-[#164863]/30"
          >
            Manage Subscription
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>

      {/* Quick Actions + Recent Booking Requests */}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="rounded-2xl border border-[#9BBEC8]/30 bg-white p-5 shadow-sm sm:p-6 dark:bg-[#101B2A]"
        >
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#164863] dark:text-[#DDF2FD]">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-[#427D9D] dark:text-[#9BBEC8]">
              Get things done faster
            </p>
          </div>

          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon

              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.3 + index * 0.08,
                  }}
                >
                  <Link
                    href={action.href}
                    className="group flex items-center gap-4 rounded-xl border border-[#9BBEC8]/20 p-4 transition-all duration-300 hover:border-[#427D9D]/40 hover:bg-[#DDF2FD]/40 dark:hover:bg-[#164863]/20"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDF2FD] text-[#164863] transition-transform duration-300 group-hover:scale-110 dark:bg-[#164863]/40 dark:text-[#DDF2FD]">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-[#164863] dark:text-[#DDF2FD]">
                        {action.title}
                      </h3>

                      <p className="mt-1 text-xs text-[#427D9D] dark:text-[#9BBEC8]">
                        {action.description}
                      </p>
                    </div>

                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[#9BBEC8] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Recent Booking Requests */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="rounded-2xl border border-[#9BBEC8]/30 bg-white p-5 shadow-sm sm:p-6 dark:bg-[#101B2A]"
        >
          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#164863] dark:text-[#DDF2FD]">
              Recent Booking Requests
            </h2>

            <p className="mt-1 text-sm text-[#427D9D] dark:text-[#9BBEC8]">
              Latest customer inquiries
            </p>
          </div>

          {bookingLoading ? (
            <div className="flex min-h-[180px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#9BBEC8] border-t-[#164863]" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-[#9BBEC8]/40 bg-[#DDF2FD]/20 px-5 text-center dark:bg-[#164863]/10">
              <ClipboardList className="h-10 w-10 text-[#427D9D]" />

              <h3 className="mt-4 text-sm font-semibold text-[#164863] dark:text-[#DDF2FD]">
                No booking requests yet
              </h3>

              <p className="mt-2 text-xs text-[#427D9D] dark:text-[#9BBEC8]">
                New booking requests will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#9BBEC8]/30 p-4"
                >
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-[#164863] dark:text-[#DDF2FD]">
                      {booking.customerName}
                    </h3>

                    <p className="mt-1 truncate text-xs text-[#427D9D] dark:text-[#9BBEC8]">
                      {booking.customerEmail}
                    </p>

                    <p className="mt-1 text-xs text-[#9BBEC8]">
                      Event: {new Date(booking.eventDate).toLocaleDateString()}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-semibold text-[#B45309] capitalize">
                    {booking.status}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>

      {/* Account Footer */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col justify-between gap-4 rounded-2xl border border-[#9BBEC8]/30 bg-white/70 p-5 backdrop-blur-xl sm:flex-row sm:items-center dark:bg-[#101B2A]/70"
      >
        <div>
          <p className="text-sm font-semibold text-[#164863] dark:text-[#DDF2FD]">
            {businessName || "Your Vendor Account"}
          </p>

          <p className="mt-1 text-xs text-[#427D9D] dark:text-[#9BBEC8]">
            {user?.email}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/vendor/dashboard/profile"
            className="inline-flex items-center gap-2 rounded-lg border border-[#9BBEC8]/40 px-4 py-2.5 text-xs font-medium text-[#164863] transition-colors hover:bg-[#DDF2FD] dark:text-[#DDF2FD] dark:hover:bg-[#164863]/30"
          >
            <Settings className="h-4 w-4" />
            Profile Settings
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </motion.section>
    </div>
  )
}

// Protected Vendor Dashboard
export default function VendorDashboard() {
  return (
    <RoleGuard allowedRole="vendor">
      <VendorDashboardContent />
    </RoleGuard>
  )
}
