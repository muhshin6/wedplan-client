"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import AuthRedirect from "@/components/auth/auth-redirect"
import { API_URL } from "@/lib/api"
import { motion } from "framer-motion"
import Link from "next/link"
import { toast } from "sonner"
import {
  ArrowLeft,
  MapPin,
  RefreshCw,
  Tag,
  Heart,
  Sparkles,
  ShieldCheck,
  CalendarHeart,
  CheckCircle2,
  Clock,
  Gem,
  Home,
  X,
  CalendarDays,
  Send,
  Loader2,
  User,
  UserRound,
  Mail,
  MessageSquare,
} from "lucide-react"

interface ServiceVendor {
  name?: string
  businessName?: string
}

interface Service {
  _id: string
  vendorId: string
  name: string
  category: string
  description: string
  location: string
  price: number
  images: string[]
  vendor?: ServiceVendor | null
}

function ServiceDetailsContent() {
  const params = useParams()
  const router = useRouter()

  const { data: session } = authClient.useSession()

  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [bookingForm, setBookingForm] = useState({
    customerName: "",
    customerEmail: "",
    eventDate: "",
    eventLocation: "",
    message: "",
  })
  const id = params.id as string

  const [service, setService] = useState<Service | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchService() {
      try {
        const response = await fetch(`${API_URL}/api/services/${id}`, {
          signal: controller.signal,
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch service details.")
        }

        setService(result.data)
        setActiveImage(0)
        setError("")
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return
        }

        setError(
          error instanceof Error ? error.message : "Something went wrong."
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void fetchService()

    return () => controller.abort()
  }, [id, retryCount])

  async function handleBookingSubmit(
    event: import("react").SubmitEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault()

    if (!session?.user) {
      toast.error("Please sign in to book this service.")
      router.push("/sign-in")
      return
    }

    if (session?.user && session.user.role !== "customer") {
      toast.error("Only customers can book services.")
      return
    }

    if (!service?.vendorId) {
      toast.error("Vendor information is missing.")
      return
    }

    if (!bookingForm.eventDate) {
      toast.error("Please select your event date.")
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          serviceId: service._id,
          vendorId: service.vendorId,
          customerName: bookingForm.customerName,
          customerEmail: bookingForm.customerEmail,
          eventDate: bookingForm.eventDate,
          eventLocation: bookingForm.eventLocation,
          message: bookingForm.message,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit booking.")
      }

      toast.success("Your booking request has been submitted!")

      setIsBookingOpen(false)

      setBookingForm({
        customerName: "",
        customerEmail: "",
        eventDate: "",
        eventLocation: "",
        message: "",
      })

      router.push("/customer/bookings")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading State
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F4F8FB] px-4 py-12 dark:bg-[#0B1922]">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-8 h-5 w-40 rounded bg-slate-200" />

          <div className="h-80 rounded-3xl bg-slate-200 sm:h-[450px]" />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_350px]">
            <div className="space-y-5">
              <div className="h-8 w-2/3 rounded bg-slate-200" />
              <div className="h-4 w-1/3 rounded bg-slate-200" />
              <div className="h-28 rounded-2xl bg-slate-200" />
            </div>

            <div className="h-64 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </main>
    )
  }

  // Error State
  if (error || !service) {
    const normalizedError = error.toLowerCase()

    const errorHeading = normalizedError.includes("invalid service id")
      ? "Invalid Service ID"
      : normalizedError.includes("not found")
        ? "Service Not Found"
        : "Service Unavailable"

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F8FB] px-4 dark:bg-[#0B1922]">
        <div className="w-full max-w-md rounded-3xl border border-[#DDF2FD] bg-white p-8 text-center shadow-sm dark:bg-[#122B3A]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DDF2FD]">
            <RefreshCw className="h-7 w-7 text-[#427D9D]" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-[#164863] dark:text-[#DDF2FD]">
            {errorHeading}
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {error || "This service could not be found."}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#164863] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#427D9D]"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>

            <Link
              href="/services"
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-[#DDF2FD] px-5 py-3 text-sm font-semibold text-[#164863] transition hover:bg-[#F4F8FB] dark:bg-[#0B1922] dark:text-[#DDF2FD]"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F4F8FB] dark:bg-[#0B1922]">
      {/* Hero Image */}
      <section className="px-4 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap items-center gap-2 text-sm"
          >
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-400 transition hover:text-[#164863] dark:text-[#DDF2FD]"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>

            <span className="text-slate-300">/</span>

            <Link
              href="/services"
              className="text-slate-400 transition hover:text-[#164863] dark:text-[#DDF2FD]"
            >
              Services
            </Link>

            <span className="text-slate-300">/</span>

            <span className="font-semibold text-[#164863] dark:text-[#DDF2FD]">
              Details
            </span>
          </motion.div>

          {/* Image Banner */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="group relative h-[280px] overflow-hidden rounded-[28px] bg-linear-to-br from-[#164863] to-[#9BBEC8] shadow-xl sm:h-[400px] lg:h-[480px]"
          >
            {service.images?.[activeImage] ? (
              <div
                key={activeImage}
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{
                  backgroundImage: `url("${service.images[activeImage]}")`,
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Heart className="h-32 w-32 text-white/20" />
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-[#082B3D]/80 via-[#164863]/10 to-black/10" />

            {/* Category Badge */}
            <div className="absolute top-5 left-5 sm:top-8 sm:left-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white px-4 py-2 text-xs font-bold text-[#164863] shadow-lg backdrop-blur dark:bg-[#122B3A]/90 dark:text-[#DDF2FD]">
                {service.category}
              </span>
            </div>

            {/* Hero Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 lg:p-12">
              <div className="max-w-3xl">
                <span className="mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#DDF2FD]">
                  <Gem className="h-4 w-4" />
                  DISCOVER YOUR PERFECT WEDDING
                </span>

                <h1 className="text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
                  {service.name}
                </h1>

                <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-white/90">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {service.location}
                  </span>

                  <span className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    {service.category}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image thumbnails */}
          {service.images && service.images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {service.images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    activeImage === index
                      ? "border-[#164863] ring-2 ring-[#164863]/20"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${image}")` }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Details */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-7"
          >
            {/* About Service */}
            <div className="rounded-3xl border border-[#DDF2FD] bg-white p-6 shadow-sm sm:p-9 dark:bg-[#122B3A]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DDF2FD]">
                  <Heart className="h-6 w-6 text-[#164863] dark:text-[#164863]" />
                </div>

                <div>
                  <p className="text-xs font-bold tracking-wider text-[#427D9D]">
                    SERVICE OVERVIEW
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-[#164863] dark:text-[#DDF2FD]">
                    About This Service
                  </h2>
                </div>
              </div>

              <p className="mt-7 text-sm leading-8 text-slate-600 sm:text-base dark:text-slate-400">
                {service.description}
              </p>
            </div>

            {/* Service Highlights */}
            <div className="rounded-3xl border border-[#DDF2FD] bg-white p-6 shadow-sm sm:p-9 dark:bg-[#122B3A]">
              <p className="text-xs font-bold tracking-wider text-[#427D9D]">
                WHY CHOOSE THIS SERVICE
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#164863] dark:text-[#DDF2FD]">
                Plan With Confidence
              </h2>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDF2FD]">
                    <ShieldCheck className="h-5 w-5 text-[#164863] dark:text-[#164863]" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#164863] dark:text-[#DDF2FD]">
                      Verified Service
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                      This service has been approved by WedPlan.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDF2FD]">
                    <CalendarHeart className="h-5 w-5 text-[#164863] dark:text-[#164863]" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#164863] dark:text-[#DDF2FD]">
                      Wedding Planning
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                      Find the right service for your special day.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDF2FD]">
                    <MapPin className="h-5 w-5 text-[#164863] dark:text-[#164863]" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#164863] dark:text-[#DDF2FD]">
                      Service Location
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                      {service.location}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDF2FD]">
                    <CheckCircle2 className="h-5 w-5 text-[#164863] dark:text-[#164863]" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#164863] dark:text-[#DDF2FD]">
                      Quality Focused
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                      Explore service details before making a request.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Navigation */}
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#427D9D] transition hover:text-[#164863] dark:text-[#DDF2FD]"
            >
              <ArrowLeft className="h-4 w-4" />
              Explore More Services
            </Link>
          </motion.div>

          {/* Right Pricing Card */}
          <motion.aside
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:sticky lg:top-24"
          >
            <div className="overflow-hidden rounded-3xl border border-[#DDF2FD] bg-white shadow-lg shadow-[#164863]/5 dark:bg-[#122B3A]">
              {/* Price Header */}
              <div className="bg-linear-to-br from-[#164863] to-[#427D9D] p-7 text-white">
                <div className="flex items-center gap-2 text-sm font-medium text-white/75">
                  SERVICE PRICING
                </div>

                <p className="mt-5 text-sm text-white/70">Starting from</p>

                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-semibold">৳</span>

                  <span className="text-4xl font-bold tracking-tight">
                    {service.price.toLocaleString("en-BD")}
                  </span>
                </div>

                <p className="mt-3 text-xs text-white/65">
                  Final pricing may vary depending on your requirements.
                </p>
              </div>

              {/* Price Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#164863] dark:text-[#DDF2FD]">
                  Interested in this service?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Explore your options and plan your wedding with the right
                  service provider.
                </p>

                <div className="my-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="h-5 w-5 text-[#427D9D]" />
                    Admin-approved service
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="h-5 w-5 text-[#427D9D]" />
                    {service.location}
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Clock className="h-5 w-5 text-[#427D9D]" />
                    Discuss your event requirements
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <UserRound className="h-5 w-5 shrink-0 text-[#427D9D]" />
                    <span className="truncate">
                      {service.vendor?.name ||
                        service.vendor?.businessName ||
                        "WedPlan Vendor"}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F4F8FB] p-4 dark:bg-[#0B1922]">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#164863] dark:text-[#DDF2FD]">
                    <Heart className="h-4 w-4" />
                    Make Your Day Special
                  </div>

                  <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
                    Find everything you need to make your wedding celebration
                    memorable.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (session?.user && session.user.role !== "customer") {
                      toast.error("Only customers can book services.")
                      return
                    }

                    setBookingForm({
                      customerName: session?.user?.name || "",
                      customerEmail: session?.user?.email || "",
                      eventDate: "",
                      eventLocation: "",
                      message: "",
                    })

                    setIsBookingOpen(true)
                  }}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#164863] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#164863]/15 transition-all hover:-translate-y-0.5 hover:bg-[#427D9D] hover:shadow-xl"
                >
                  Book This Service
                  <CalendarDays className="h-4 w-4" />
                </button>

                <p className="mt-4 text-center text-xs text-slate-400">
                  Thank you for choosing WedPlan.
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>
      {/* Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#082B3D]/60 px-4 py-8 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.97 }}
            className="relative my-auto w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#122B3A]"
          >
            {/* Modal Header */}
            <div className="relative overflow-hidden bg-linear-to-br from-[#164863] to-[#427D9D] px-6 py-8 text-white sm:px-8">
              <div className="absolute -top-12 -right-10 h-40 w-40 rounded-full bg-white blur-2xl dark:bg-[#122B3A]/10" />

              <button
                type="button"
                onClick={() => setIsBookingOpen(false)}
                className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white transition hover:bg-white dark:bg-[#122B3A]/15 dark:bg-[#122B3A]/25"
                aria-label="Close booking modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-[#122B3A]/15">
                  <CalendarHeart className="h-6 w-6" />
                </div>

                <p className="text-xs font-bold tracking-[0.2em] text-white/70">
                  START PLANNING YOUR SPECIAL DAY
                </p>

                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Book This Service
                </h2>

                <p className="mt-2 text-sm text-white/75">
                  Send your booking request to the service provider.
                </p>
              </div>
            </div>

            {/* Booking Form */}
            <form
              onSubmit={handleBookingSubmit}
              className="space-y-5 p-6 sm:p-8"
            >
              {/* Selected Service */}
              <div className="flex items-center gap-4 rounded-2xl border border-[#DDF2FD] bg-[#F4F8FB] p-4 dark:bg-[#0B1922]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DDF2FD]">
                  <Heart className="h-6 w-6 text-[#164863] dark:text-[#DDF2FD]" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#427D9D]">
                    SELECTED SERVICE
                  </p>

                  <h3 className="mt-1 truncate text-sm font-bold text-[#164863] dark:text-[#DDF2FD]">
                    {service.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Starting from ৳{service.price.toLocaleString("en-BD")}
                  </p>
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label
                  htmlFor="customerName"
                  className="mb-2 block text-sm font-semibold text-[#164863] dark:text-[#DDF2FD]"
                >
                  Your Name
                </label>

                <div className="relative">
                  <User className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#427D9D]" />

                  <input
                    id="customerName"
                    type="text"
                    required
                    value={bookingForm.customerName}
                    onChange={(event) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        customerName: event.target.value,
                      }))
                    }
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-[#DDF2FD] bg-white py-3 pr-4 pl-11 text-sm text-slate-700 transition outline-none placeholder:text-slate-400 focus:border-[#427D9D] focus:ring-4 focus:ring-[#DDF2FD]/70 dark:bg-[#122B3A]"
                  />
                </div>
              </div>

              {/* Customer Email */}
              <div>
                <label
                  htmlFor="customerEmail"
                  className="mb-2 block text-sm font-semibold text-[#164863] dark:text-[#DDF2FD]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#427D9D]" />

                  <input
                    id="customerEmail"
                    type="email"
                    required
                    value={bookingForm.customerEmail}
                    onChange={(event) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        customerEmail: event.target.value,
                      }))
                    }
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-[#DDF2FD] bg-white py-3 pr-4 pl-11 text-sm text-slate-700 transition outline-none placeholder:text-slate-400 focus:border-[#427D9D] focus:ring-4 focus:ring-[#DDF2FD]/70 dark:bg-[#122B3A]"
                  />
                </div>
              </div>

              {/* Event Date */}
              <div>
                <label
                  htmlFor="eventDate"
                  className="mb-2 block text-sm font-semibold text-[#164863] dark:text-[#DDF2FD]"
                >
                  Wedding / Event Date
                </label>

                <div className="relative">
                  <CalendarDays className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#427D9D]" />

                  <input
                    id="eventDate"
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={bookingForm.eventDate}
                    onChange={(event) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        eventDate: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#DDF2FD] bg-white py-3 pr-4 pl-11 text-sm text-slate-700 transition outline-none focus:border-[#427D9D] focus:ring-4 focus:ring-[#DDF2FD]/70 dark:bg-[#122B3A]"
                  />
                </div>
              </div>

              {/* Event Location */}
              <div>
                <label
                  htmlFor="eventLocation"
                  className="mb-2 block text-sm font-semibold text-[#164863] dark:text-[#DDF2FD]"
                >
                  Wedding / Event Location{" "}
                  <span className="font-normal text-slate-400">(Optional)</span>
                </label>

                <div className="relative">
                  <MapPin className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#427D9D]" />

                  <input
                    id="eventLocation"
                    type="text"
                    value={bookingForm.eventLocation}
                    onChange={(event) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        eventLocation: event.target.value,
                      }))
                    }
                    placeholder="e.g. Dhaka, Bangladesh"
                    className="w-full rounded-xl border border-[#DDF2FD] bg-white py-3 pr-4 pl-11 text-sm text-slate-700 transition outline-none placeholder:text-slate-400 focus:border-[#427D9D] focus:ring-4 focus:ring-[#DDF2FD]/70 dark:bg-[#122B3A]"
                  />
                </div>
              </div>

              {/* Additional Requirements */}
              <div>
                <label
                  htmlFor="bookingMessage"
                  className="mb-2 block text-sm font-semibold text-[#164863] dark:text-[#DDF2FD]"
                >
                  Additional Requirements{" "}
                  <span className="font-normal text-slate-400">(Optional)</span>
                </label>

                <div className="relative">
                  <MessageSquare className="absolute top-4 left-4 h-4 w-4 text-[#427D9D]" />

                  <textarea
                    id="bookingMessage"
                    rows={4}
                    maxLength={1000}
                    value={bookingForm.message}
                    onChange={(event) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        message: event.target.value,
                      }))
                    }
                    placeholder="Tell the vendor about your wedding plans..."
                    className="w-full resize-none rounded-xl border border-[#DDF2FD] bg-white py-3 pr-4 pl-11 text-sm text-slate-700 transition outline-none placeholder:text-slate-400 focus:border-[#427D9D] focus:ring-4 focus:ring-[#DDF2FD]/70 dark:bg-[#122B3A]"
                  />

                  <p className="mt-1 text-right text-xs text-slate-400">
                    {bookingForm.message.length}/1000
                  </p>
                </div>
              </div>

              {/* Information */}
              <div className="rounded-xl border border-[#DDF2FD] bg-[#F4F8FB] p-4 dark:bg-[#0B1922]">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#427D9D]" />

                  <p className="text-xs leading-5 text-slate-600">
                    Your booking request will be submitted with pending status.
                    The vendor will review your request and respond accordingly.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#164863] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#164863]/15 transition-all hover:-translate-y-0.5 hover:bg-[#427D9D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Booking Request
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                By submitting, you agree to share your booking details with the
                vendor.
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </main>
  )
}

export default function ServiceDetailsPage() {
  return (
    <AuthRedirect>
      <ServiceDetailsContent />
    </AuthRedirect>
  )
}
