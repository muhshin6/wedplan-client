"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  CalendarDays,
  Clock,
  Mail,
  MessageSquare,
  ClipboardList,
  RefreshCw,
  Check,
  X,
  MapPin,
  BriefcaseBusiness,
  Wallet,
} from "lucide-react"

import { toast } from "sonner"
import { API_URL } from "@/lib/api"

interface BookingService {
  _id: string
  name: string
  category: string
  price: number
  location: string
}

interface Booking {
  _id: string
  customerName: string
  customerEmail: string
  eventDate: string
  eventLocation?: string
  status: string
  message?: string
  serviceId: string
  service?: BookingService | null
  createdAt?: string
}

export default function BookingRequestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(
    null
  )

  async function loadBookings(refreshing = false) {
    if (refreshing) setLoading(true)

    try {
      const response = await fetch(
        `${API_URL}/api/bookings/vendor/my-bookings`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      )

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch bookings.")
      }

      setBookings(Array.isArray(result.data) ? result.data : [])
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    async function initialLoad() {
      try {
        const response = await fetch(
          `${API_URL}/api/bookings/vendor/my-bookings`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        )

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch bookings.")
        }

        if (!ignore) {
          setBookings(Array.isArray(result.data) ? result.data : [])
        }
      } catch (error) {
        if (!ignore) {
          console.error("Booking Fetch Error:", error)
          toast.error(
            error instanceof Error ? error.message : "Something went wrong."
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    void initialLoad()

    return () => {
      ignore = true
    }
  }, [])

  async function handleBookingStatus(
    bookingId: string,
    status: "accepted" | "rejected"
  ) {
    try {
      setUpdatingBookingId(bookingId)

      const response = await fetch(
        `${API_URL}/api/bookings/vendor/${bookingId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      )

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update booking status.")
      }

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status } : booking
        )
      )

      toast.success(
        status === "accepted"
          ? "Booking accepted successfully!"
          : "Booking rejected successfully!"
      )
    } catch (error) {
      console.error("Booking Status Update Error:", error)

      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setUpdatingBookingId(null)
    }
  }

  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending"
  ).length

  const acceptedCount = bookings.filter(
    (booking) => booking.status === "accepted"
  ).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#427D9D] dark:text-[#9BBEC8]">
            <ClipboardList className="h-4 w-4" />
            Vendor Workspace
          </div>

          <h1 className="text-2xl font-bold text-[#164863] sm:text-3xl dark:text-[#DDF2FD]">
            Booking Requests
          </h1>

          <p className="mt-2 text-sm text-[#427D9D] dark:text-[#9BBEC8]">
            Manage customer requests for your services.
          </p>
        </div>

        <button
          onClick={() => void loadBookings(true)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9BBEC8]/40 bg-white px-4 py-2.5 text-sm font-semibold text-[#164863] transition-all hover:bg-[#DDF2FD] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#101B2A] dark:text-[#DDF2FD]"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </motion.div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#9BBEC8]/30 bg-white p-5 shadow-sm dark:bg-[#101B2A]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#427D9D] dark:text-[#9BBEC8]">
                Pending Requests
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#164863] dark:text-[#DDF2FD]">
                {pendingCount}
              </h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-[#9BBEC8]/30 bg-white p-5 shadow-sm dark:bg-[#101B2A]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#427D9D] dark:text-[#9BBEC8]">
                Accepted Bookings
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#164863] dark:text-[#DDF2FD]">
                {acceptedCount}
              </h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <CalendarDays className="h-6 w-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Booking List */}
      <section className="rounded-2xl border border-[#9BBEC8]/30 bg-white p-5 shadow-sm sm:p-6 dark:bg-[#101B2A]">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#164863] dark:text-[#DDF2FD]">
            All Booking Requests
          </h2>
          <p className="mt-1 text-sm text-[#427D9D] dark:text-[#9BBEC8]">
            {bookings.length} total booking requests
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#9BBEC8] border-t-[#164863]" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-[#9BBEC8]/50 bg-[#DDF2FD]/20 px-5 text-center dark:bg-[#164863]/10">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DDF2FD] text-[#164863] dark:bg-[#164863]/40 dark:text-[#DDF2FD]">
              <ClipboardList className="h-8 w-8" />
            </div>
            <h3 className="mt-5 text-base font-bold text-[#164863] dark:text-[#DDF2FD]">
              No Booking Requests Yet
            </h3>
            <p className="mt-2 max-w-sm text-sm text-[#427D9D] dark:text-[#9BBEC8]">
              When customers book your services, their requests will appear
              here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-[#9BBEC8]/30 p-5 transition-all hover:border-[#427D9D]/50 hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-[#164863] dark:text-[#DDF2FD]">
                      {booking.customerName}
                    </h3>
                    <div className="mt-3 flex items-center gap-2 text-sm text-[#427D9D] dark:text-[#9BBEC8]">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="break-all">{booking.customerEmail}</span>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                      booking.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : booking.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-[#DDF2FD] text-[#164863]"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Service Information */}
                <div className="mt-5 rounded-xl border border-[#9BBEC8]/25 bg-[#DDF2FD]/30 p-4 dark:bg-[#164863]/10">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#164863] dark:text-[#DDF2FD]">
                    <BriefcaseBusiness className="h-4 w-4" />
                    Service Information
                  </div>
                  <p className="text-sm font-semibold text-[#164863] dark:text-[#DDF2FD]">
                    {booking.service?.name || "Service information unavailable"}
                  </p>
                  {booking.service && (
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#427D9D] dark:text-[#9BBEC8]">
                      <span>Category: {booking.service.category}</span>
                      <span className="inline-flex items-center gap-1">
                        <Wallet className="h-3.5 w-3.5" />৳
                        {Number(booking.service.price).toLocaleString("en-BD")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Event details */}
                <div className="mt-4 grid gap-2 text-sm text-[#427D9D] sm:grid-cols-2 dark:text-[#9BBEC8]">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    Event Date:{" "}
                    {new Date(booking.eventDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0" />
                    Event Location:{" "}
                    {booking.eventLocation ||
                      booking.service?.location ||
                      "Not specified"}
                  </div>
                </div>

                {booking.message && (
                  <div className="mt-5 rounded-xl bg-[#DDF2FD]/50 p-4 dark:bg-[#164863]/20">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#164863] dark:text-[#DDF2FD]">
                      <MessageSquare className="h-4 w-4" />
                      Customer Message
                    </div>
                    <p className="text-sm leading-6 text-[#427D9D] dark:text-[#9BBEC8]">
                      {booking.message}
                    </p>
                  </div>
                )}

                <p className="mt-4 text-xs text-[#9BBEC8]">
                  Booking ID: {booking._id}
                </p>

                {booking.status === "pending" ? (
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        void handleBookingStatus(booking._id, "accepted")
                      }
                      disabled={updatingBookingId === booking._id}
                      className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Check className="h-4 w-4" />
                      {updatingBookingId === booking._id
                        ? "Updating..."
                        : "Accept Booking"}
                    </button>
                    <button
                      onClick={() =>
                        void handleBookingStatus(booking._id, "rejected")
                      }
                      disabled={updatingBookingId === booking._id}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                ) : (
                  <p className="mt-5 text-xs text-[#9BBEC8]">
                    This request has been {booking.status} and can no longer be
                    processed.
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
