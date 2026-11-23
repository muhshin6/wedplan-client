"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  CalendarDays,
  Clock3,
  ClipboardList,
  Search,
  ArrowLeft,
  RefreshCw,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { API_URL } from "@/lib/api"
import RoleGuard from "@/components/auth/role-guard"

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

type BookingFilter = "all" | "pending" | "accepted" | "rejected" | "cancelled"

const filters: { label: string; value: BookingFilter }[] = [
  { label: "All Bookings", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
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

function CustomerBookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeFilter, setActiveFilter] = useState<BookingFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchBookings() {
      try {
        const response = await fetch(
          `${API_URL}/api/bookings/customer/my-bookings`,
          {
            credentials: "include",
            signal: controller.signal,
          }
        )

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch bookings.")
        }

        setBookings(result.data)
        setError("")
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return
        }

        // 401/403 can occur if the session/role changes — show inline, don't log.
        setError(
          error instanceof Error ? error.message : "Something went wrong."
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void fetchBookings()

    return () => {
      controller.abort()
    }
  }, [])

  async function handleCancelBooking(bookingId: string) {
    const previousBookings = bookings

    // Immediately remove booking from the UI
    setBookings((prev) => prev.filter((booking) => booking._id !== bookingId))

    try {
      setCancellingId(bookingId)

      const response = await fetch(
        `${API_URL}/api/bookings/customer/my-bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        }
      )

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to cancel booking.")
      }

      toast.success("Booking cancelled successfully.")
    } catch (error) {
      // Restore booking if cancellation fails
      setBookings(previousBookings)

      console.error("Cancel booking error:", error)

      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setCancellingId(null)
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      activeFilter === "all"
        ? booking.status !== "cancelled"
        : activeFilter === "accepted"
          ? ["accepted", "approved", "confirmed"].includes(booking.status)
          : booking.status === activeFilter

    const search = searchQuery.toLowerCase()

    const matchesSearch =
      booking._id.toLowerCase().includes(search) ||
      booking.serviceId.toLowerCase().includes(search) ||
      booking.status.toLowerCase().includes(search)

    return matchesStatus && matchesSearch
  })

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F4F8FB] px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#DDF2FD]/70 blur-3xl" />

      <div className="relative mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/customer/dashboard"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#427D9D] transition-colors hover:text-[#164863]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-medium text-[#427D9D]">
                CUSTOMER PANEL
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-[#164863] sm:text-4xl">
                My Bookings
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Manage and track all your wedding service requests.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#DDF2FD] bg-white px-4 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DDF2FD] text-[#164863]">
                <ClipboardList className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-slate-500">Total Bookings</p>
                <p className="text-xl font-bold text-[#164863]">
                  {isLoading
                    ? "..."
                    : bookings.filter(
                        (booking) => booking.status !== "cancelled"
                      ).length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="space-y-4 rounded-2xl border border-[#DDF2FD] bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="relative">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by booking ID, service ID or status..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-[#F8FBFD] pr-4 pl-11 text-sm text-[#164863] transition-all outline-none placeholder:text-slate-400 focus:border-[#427D9D] focus:ring-4 focus:ring-[#DDF2FD]/70"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter.value
                    ? "bg-[#164863] text-white shadow-md shadow-[#164863]/15"
                    : "bg-[#F4F8FB] text-slate-500 hover:bg-[#DDF2FD] hover:text-[#164863]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-[#DDF2FD] bg-white p-6"
              >
                <div className="mb-5 h-5 w-32 rounded bg-slate-100" />
                <div className="mb-3 h-4 w-48 rounded bg-slate-100" />
                <div className="h-4 w-36 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-red-100 bg-white px-6 py-14 text-center">
            <RefreshCw className="mx-auto mb-4 h-8 w-8 text-red-500" />

            <h2 className="font-semibold text-[#164863]">
              Unable to load bookings
            </h2>

            <p className="mt-2 text-sm text-slate-500">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredBookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-[#DDF2FD] bg-white px-6 py-16 text-center shadow-sm"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DDF2FD] text-[#164863]">
              {searchQuery || activeFilter !== "all" ? (
                <Search className="h-7 w-7" />
              ) : (
                <CalendarDays className="h-7 w-7" />
              )}
            </div>

            <h2 className="text-lg font-semibold text-[#164863]">
              {searchQuery || activeFilter !== "all"
                ? "No matching bookings"
                : "No bookings yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              {searchQuery || activeFilter !== "all"
                ? "Try changing your search or selecting another status."
                : "Explore our wedding services and send your first booking request."}
            </p>

            {!searchQuery && activeFilter === "all" && (
              <Link
                href="/services"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#164863] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#427D9D]"
              >
                Browse Services
              </Link>
            )}
          </motion.div>
        )}

        {/* Booking Cards */}
        {!isLoading && !error && filteredBookings.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredBookings.map((booking, index) => (
              <motion.article
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.06,
                }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-[#DDF2FD] bg-white p-5 shadow-sm transition-shadow hover:shadow-lg hover:shadow-[#164863]/5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                      Booking Reference
                    </p>

                    <h2 className="mt-1 font-bold text-[#164863]">
                      #{booking._id.slice(-6).toUpperCase()}
                    </h2>
                  </div>

                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ring-1 ring-inset ${getStatusStyle(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F8FB] text-[#427D9D]">
                      <CalendarDays className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Event Date</p>
                      <p className="mt-1 text-sm font-medium text-[#164863]">
                        {formatDate(booking.eventDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F8FB] text-[#427D9D]">
                      <Clock3 className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Request Date</p>
                      <p className="mt-1 text-sm font-medium text-[#164863]">
                        {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs break-all text-slate-400">
                    Service ID:{" "}
                    <span className="font-medium text-slate-500">
                      {booking.serviceId}
                    </span>
                  </p>

                  {booking.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {cancellingId === booking._id ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          Cancel Booking
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CustomerBookingsPage() {
  return (
    <RoleGuard allowedRole="customer">
      <CustomerBookingsContent />
    </RoleGuard>
  )
}
