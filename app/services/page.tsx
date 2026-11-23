"use client"

import ServiceDetailsLink from "@/components/auth/service-details-link"
import { API_URL } from "@/lib/api"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import {
  Search,
  MapPin,
  ArrowRight,
  RefreshCw,
  Heart,
  Sparkles,
  SlidersHorizontal,
  X,
  CalendarHeart,
  Gem,
  UserRound,
} from "lucide-react"

interface ServiceVendor {
  name?: string
  businessName?: string
}

interface Service {
  _id: string
  name: string
  category: string
  description: string
  location: string
  price: number
  images: string[]
  vendor?: ServiceVendor | null
}

const COMBINED_CATEGORY = "Photography & Videography"

function normalizeCategory(category?: string) {
  return category?.toLowerCase().trim().replace(/\s+/g, " ") || ""
}

// Check whether a category belongs to Photography or Videography
function isPhotographyOrVideography(category?: string) {
  const normalized = normalizeCategory(category)

  const photographyCategories = ["photography", "photographer", "photographers"]

  const videographyCategories = ["videography", "videographer", "videographers"]

  return (
    photographyCategories.includes(normalized) ||
    videographyCategories.includes(normalized) ||
    normalized === "photography & videography" ||
    normalized === "photography and videography"
  )
}

// Read the selected category from the URL
function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const categoryParam = params.get("category")

  if (!categoryParam) {
    return "All"
  }

  const selectedCategories = categoryParam
    .split(",")
    .map((category) => normalizeCategory(category))

  const isCombinedCategory = selectedCategories.some((category) =>
    isPhotographyOrVideography(category)
  )

  if (isCombinedCategory) {
    return COMBINED_CATEGORY
  }

  return categoryParam
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeLocation, setActiveLocation] = useState("All")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [retryCount, setRetryCount] = useState(0)

  // Sync category with URL on page load and browser navigation
  useEffect(() => {
    const syncCategoryFromUrl = () => {
      setActiveCategory(getCategoryFromUrl())
    }

    syncCategoryFromUrl()

    window.addEventListener("popstate", syncCategoryFromUrl)

    return () => {
      window.removeEventListener("popstate", syncCategoryFromUrl)
    }
  }, [])

  // Update category and URL
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)

    const params = new URLSearchParams(window.location.search)

    if (category === "All") {
      params.delete("category")
    } else if (category === COMBINED_CATEGORY) {
      params.set("category", "Photography,Videography")
    } else {
      params.set("category", category)
    }

    const query = params.toString()

    const newUrl = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname

    window.history.pushState({}, "", newUrl)
  }

  // Fetch public services
  useEffect(() => {
    const controller = new AbortController()

    async function fetchServices() {
      try {
        setIsLoading(true)
        setError("")

        const response = await fetch(`${API_URL}/api/services/public`, {
          cache: "no-store",
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error("Failed to fetch services.")
        }

        const result = await response.json()

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error(result.message || "Unable to load services.")
        }

        setServices(result.data)
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

    void fetchServices()

    return () => controller.abort()
  }, [retryCount])

  // Build category list without separate Photography/Videography buttons
  const categories = [
    "All",
    COMBINED_CATEGORY,
    ...Array.from(
      new Set(
        services
          .map((service) => service.category?.trim())
          .filter(
            (category): category is string =>
              Boolean(category) && !isPhotographyOrVideography(category)
          )
      )
    ).filter(
      (category) =>
        normalizeCategory(category) !== "all" &&
        normalizeCategory(category) !== normalizeCategory(COMBINED_CATEGORY)
    ),
  ]

  // Build a unique, sorted location list for the location filter
  const locations = [
    "All",
    ...Array.from(
      new Set(
        services
          .map((service) => service.location?.trim())
          .filter((location): location is string => Boolean(location))
      )
    ).sort((a, b) => a.localeCompare(b)),
  ]

  // Filter services by search, category and location
  const filteredServices = services.filter((service) => {
    const search = searchQuery.toLowerCase().trim()

    const serviceName = service.name?.toLowerCase() || ""
    const serviceCategory = service.category?.toLowerCase() || ""
    const serviceLocation = service.location?.toLowerCase() || ""

    const matchesSearch =
      !search ||
      serviceName.includes(search) ||
      serviceCategory.includes(search) ||
      serviceLocation.includes(search)

    const normalizedCategory = normalizeCategory(service.category)

    const matchesCategory =
      activeCategory === "All" ||
      (activeCategory === COMBINED_CATEGORY
        ? isPhotographyOrVideography(service.category)
        : normalizedCategory === normalizeCategory(activeCategory))

    const matchesLocation =
      activeLocation === "All" ||
      service.location?.trim().toLowerCase() ===
        activeLocation.trim().toLowerCase()

    return matchesSearch && matchesCategory && matchesLocation
  })

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setActiveLocation("All")
    handleCategoryChange("All")
  }

  return (
    <main className="min-h-screen bg-[#F4F8FB] dark:bg-[#0B1922]">
      {/* Hero Section */}
      <section className="px-4 pt-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-linear-to-br from-[#103B53] via-[#164863] to-[#427D9D] px-6 py-16 text-white sm:px-12 sm:py-20 lg:px-16"
        >
          {/* Decorative Elements */}
          <div className="pointer-events-none absolute -top-32 -right-20 h-96 w-96 rounded-full border border-white/10" />

          <div className="pointer-events-none absolute -top-20 -right-10 h-72 w-72 rounded-full border border-white/10" />

          <div className="pointer-events-none absolute right-1/4 -bottom-40 h-80 w-80 rounded-full bg-[#9BBEC8]/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#F4F8FB] px-4 py-2 text-xs font-semibold tracking-wide text-[#164863] backdrop-blur dark:bg-[#122B3A]/10 dark:text-[#B9DFEF]">
              MAKE YOUR DREAM WEDDING A REALITY
            </span>

            <h1 className="mt-7 text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Everything You Need
              <br />
              For Your
              <span className="text-[#B9DFEF]"> Perfect Day.</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
              Discover exceptional wedding vendors, explore beautiful services,
              and find everything you need to create unforgettable memories.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <CalendarHeart className="h-5 w-5 text-[#DDF2FD]" />
                Plan Your Wedding
              </div>

              <div className="flex items-center gap-2">
                <Gem className="h-5 w-5 text-[#DDF2FD]" />
                Trusted Services
              </div>
            </div>
          </div>

          {/* Decorative Icon */}
          <div className="absolute right-12 bottom-10 hidden opacity-20 lg:block">
            <Heart className="h-48 w-48" strokeWidth={0.7} />
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-9">
          <p className="text-sm font-bold tracking-[0.2em] text-[#427D9D]">
            EXPLORE WEDPLAN
          </p>

          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#164863] sm:text-4xl dark:text-[#DDF2FD]">
                Find Your Perfect
                <span className="text-[#427D9D]"> Wedding Services</span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
                Explore our curated collection of wedding services and find the
                perfect vendors for your special day.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-[#427D9D]">
              <Sparkles className="h-4 w-4" />
              {services.length} Services Available
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="rounded-2xl border border-[#DDF2FD] bg-white p-4 shadow-sm sm:p-6 dark:bg-[#122B3A]">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#427D9D]" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by service, category or location..."
                className="h-13 w-full rounded-xl border border-[#DDF2FD] bg-[#F8FBFD] pr-11 pl-12 text-sm text-[#164863] transition-all outline-none placeholder:text-slate-400 focus:border-[#427D9D] focus:bg-white focus:ring-4 focus:ring-[#DDF2FD]/70 dark:bg-[#122B3A] dark:text-[#DDF2FD]"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-[#164863] dark:text-[#DDF2FD]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Result Count */}
            <div className="flex h-13 items-center gap-2 rounded-xl bg-[#F4F8FB] px-5 text-sm font-medium text-[#164863] dark:bg-[#0B1922] dark:text-[#DDF2FD]">
              <SlidersHorizontal className="h-4 w-4 text-[#427D9D]" />
              {filteredServices.length} Results
            </div>
          </div>

          {/* Categories */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold tracking-wider text-slate-400">
                BROWSE BY CATEGORY
              </p>

              {(searchQuery ||
                activeCategory !== "All" ||
                activeLocation !== "All") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-[#427D9D] hover:text-[#164863] dark:text-[#DDF2FD]"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`shrink-0 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-[#164863] text-white shadow-lg shadow-[#164863]/15"
                      : "border border-[#DDF2FD] bg-white text-slate-400 hover:border-[#9BBEC8] hover:bg-[#F4F8FB] dark:bg-[#0B1922] dark:bg-[#122B3A]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Location filter */}
          <div className="mt-6">
            <p className="mb-3 text-xs font-bold tracking-wider text-slate-400">
              BROWSE BY LOCATION
            </p>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {locations.map((location) => (
                <button
                  key={location}
                  type="button"
                  onClick={() => setActiveLocation(location)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                    activeLocation === location
                      ? "bg-[#427D9D] text-white shadow-lg shadow-[#427D9D]/15"
                      : "border border-[#DDF2FD] bg-white text-slate-400 hover:border-[#9BBEC8] hover:bg-[#F4F8FB] dark:bg-[#0B1922] dark:bg-[#122B3A]"
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  {location}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Services Header */}
        <div className="mt-12 mb-7 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#164863] sm:text-2xl dark:text-[#DDF2FD]">
              Available Services
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Find the right professionals for your celebration.
            </p>
          </div>

          <span className="hidden rounded-full bg-[#DDF2FD] px-4 py-2 text-xs font-bold text-[#164863] sm:block dark:text-[#DDF2FD]">
            {isLoading ? "Loading..." : `${filteredServices.length} Found`}
          </span>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-[#DDF2FD] bg-white dark:bg-[#122B3A]"
              >
                <div className="h-60 bg-slate-200" />

                <div className="space-y-4 p-5">
                  <div className="h-4 w-24 rounded bg-slate-200" />
                  <div className="h-6 w-3/4 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-4 w-1/2 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="rounded-3xl border border-red-100 bg-white px-6 py-16 text-center shadow-sm dark:bg-[#122B3A]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <RefreshCw className="h-7 w-7 text-red-500" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#164863] dark:text-[#DDF2FD]">
              Unable to Load Services
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#164863] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#427D9D]"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredServices.length === 0 && (
          <div className="rounded-3xl border border-[#DDF2FD] bg-white px-6 py-20 text-center shadow-sm dark:bg-[#122B3A]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DDF2FD]">
              <Search className="h-7 w-7 text-[#427D9D]" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#164863] dark:text-[#DDF2FD]">
              {activeCategory !== "All" && !searchQuery
                ? `No ${activeCategory} services available`
                : "No Services Found"}
            </h3>

            <p className="mt-3 text-sm text-slate-500">
              {activeCategory !== "All" && !searchQuery
                ? `There are currently no available services in the ${activeCategory} category. Please check back later.`
                : "We couldn't find any services matching your search, category or location."}
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-[#164863] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#427D9D]"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Service Cards */}
        {!isLoading && !error && filteredServices.length > 0 && (
          <motion.div
            layout
            className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, index) => (
                <motion.article
                  layout
                  key={service._id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.05, 0.25),
                  }}
                  whileHover={{ y: -7 }}
                  className="group overflow-hidden rounded-2xl border border-[#DDF2FD] bg-white shadow-sm transition-all duration-300 hover:border-[#9BBEC8] hover:shadow-xl hover:shadow-[#164863]/10 dark:bg-[#122B3A]"
                >
                  {/* Image */}
                  <div className="relative h-60 overflow-hidden bg-linear-to-br from-[#DDF2FD] to-[#9BBEC8]">
                    {service.images?.[0] ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{
                          backgroundImage: `url("${service.images[0]}")`,
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Heart className="h-16 w-16 text-[#164863] dark:text-[#DDF2FD]/20" />
                      </div>
                    )}

                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-[#164863]/40 via-transparent to-transparent" />

                    {/* Category */}
                    <span className="absolute top-4 left-4 rounded-full border border-white/50 bg-white px-4 py-2 text-xs font-bold text-[#164863] shadow-sm backdrop-blur dark:bg-[#122B3A]/90 dark:text-[#DDF2FD]">
                      {service.category}
                    </span>

                    {/* Location */}
                    <span className="absolute bottom-4 left-4 flex items-center gap-2 text-sm font-medium text-white drop-shadow-md">
                      <MapPin className="h-4 w-4" />
                      {service.location || "Location not specified"}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="line-clamp-1 text-lg font-bold text-[#164863] transition-colors group-hover:text-[#427D9D] dark:text-[#DDF2FD]">
                      {service.name}
                    </h3>

                    <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
                      {service.description}
                    </p>

                    {/* Vendor Information */}
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                      <UserRound className="h-4 w-4 shrink-0 text-[#427D9D]" />
                      <span className="truncate">
                        {service.vendor?.name ||
                          service.vendor?.businessName ||
                          "WedPlan Vendor"}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="my-5 border-t border-dashed border-[#DDF2FD]" />

                    {/* Price & Details */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Starting from
                        </p>

                        <p className="mt-1 text-xl font-bold text-[#164863] dark:text-[#DDF2FD]">
                          ৳{Number(service.price || 0).toLocaleString("en-BD")}
                        </p>
                      </div>

                      <ServiceDetailsLink
                        href={`/services/${service._id}`}
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#164863] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#427D9D] hover:shadow-lg hover:shadow-[#164863]/20"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </ServiceDetailsLink>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </main>
  )
}
