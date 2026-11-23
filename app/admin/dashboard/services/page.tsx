"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Columns3,
  List,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
  Trash2,
  UserRound,
  X,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

import { API_URL } from "@/lib/api"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"

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
  status: string
  isActive?: boolean
  createdAt: string
  vendor?: ServiceVendor | null
}

type StatusFilter = "all" | "pending" | "approved" | "rejected"
type ViewMode = "list" | "kanban"

const STATUSES = ["pending", "approved", "rejected"] as const

const VIEWS: { id: ViewMode; label: string; icon: typeof List }[] = [
  { id: "list", label: "List", icon: List },
  { id: "kanban", label: "Board", icon: Columns3 },
]

function statusStyle(status: string) {
  if (status === "approved") return "bg-emerald-100 text-emerald-700"
  if (status === "rejected") return "bg-red-100 text-red-700"
  return "bg-amber-100 text-amber-700"
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("kanban")
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)
  const { data: session } = authClient.useSession()
  const isAdmin =
    (session?.user as { role?: string } | undefined)?.role === "admin"

  useEffect(() => {
    let ignore = false

    async function loadServices() {
      try {
        const response = await fetch(`${API_URL}/api/services/admin/all`, {
          credentials: "include",
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch services")
        }

        if (!ignore) setServices(result.data)
      } catch (error) {
        if (!ignore) {
          toast.error(
            error instanceof Error ? error.message : "Something went wrong"
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    void loadServices()

    return () => {
      ignore = true
    }
  }, [])

  const handleStatusUpdate = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    if (!isAdmin) {
      toast.error("Only administrators can review services.")
      return
    }

    try {
      setProcessingId(id)

      const response = await fetch(
        `${API_URL}/api/services/admin/${id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to update service")
      }

      setServices((previous) =>
        previous.map((service) =>
          service._id === id ? { ...service, status } : service
        )
      )

      toast.success(
        status === "approved"
          ? "Service approved successfully!"
          : "Service rejected successfully!"
      )
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    } finally {
      setProcessingId(null)
    }
  }

  function requestDelete(service: Service) {
    // Frontend guard only — the server re-verifies the admin role on DELETE.
    if (!isAdmin) {
      toast.error("Only administrators can delete services.")
      return
    }

    setDeleteTarget(service)
  }

  async function confirmDelete() {
    const service = deleteTarget

    if (!service) return

    if (!isAdmin) {
      toast.error("Only administrators can delete services.")
      setDeleteTarget(null)
      return
    }

    try {
      setProcessingId(service._id)

      const response = await fetch(
        `${API_URL}/api/services/admin/${service._id}`,
        { method: "DELETE", credentials: "include" }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete service")
      }

      setServices((previous) =>
        previous.filter((item) => item._id !== service._id)
      )
      toast.success("Service deleted successfully!")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    } finally {
      setProcessingId(null)
      setDeleteTarget(null)
    }
  }

  const counts = useMemo(
    () => ({
      all: services.length,
      pending: services.filter((s) => s.status === "pending").length,
      approved: services.filter((s) => s.status === "approved").length,
      rejected: services.filter((s) => s.status === "rejected").length,
    }),
    [services]
  )

  const filteredServices = useMemo(() => {
    const value = search.trim().toLowerCase()

    return services.filter((service) => {
      const matchesSearch =
        !value ||
        service.name?.toLowerCase().includes(value) ||
        service.category?.toLowerCase().includes(value) ||
        service.location?.toLowerCase().includes(value) ||
        service.vendor?.name?.toLowerCase().includes(value) ||
        service.vendor?.businessName?.toLowerCase().includes(value)

      const matchesStatus =
        statusFilter === "all" || service.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [services, search, statusFilter])

  const hasActiveFilters = search.trim() !== "" || statusFilter !== "all"

  function clearFilters() {
    setSearch("")
    setStatusFilter("all")
  }

  function renderActions(service: Service) {
    const busy = processingId === service._id

    return (
      <div className="flex flex-wrap gap-2">
        {service.status !== "approved" && (
          <button
            onClick={() => void handleStatusUpdate(service._id, "approved")}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {busy ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CheckCircle2 size={14} />
            )}
            Approve
          </button>
        )}

        {service.status !== "rejected" && (
          <button
            onClick={() => void handleStatusUpdate(service._id, "rejected")}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
          >
            <XCircle size={14} />
            Reject
          </button>
        )}

        <button
          onClick={() => requestDelete(service)}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#9BBEC8] px-3 py-2 text-xs font-semibold text-[#164863] transition hover:bg-[#F4F8FB] disabled:opacity-50 dark:text-[#DDF2FD] dark:hover:bg-white/10"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    )
  }

  function renderList() {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#9BBEC8]/40 bg-white dark:bg-[#122B3A]">
        {/* Table header — desktop only */}
        <div className="hidden grid-cols-[2fr_1.2fr_1fr_1fr_auto] gap-4 border-b border-[#9BBEC8]/30 bg-[#F4F8FB] px-5 py-3 text-xs font-semibold tracking-wider text-[#427D9D] uppercase lg:grid dark:bg-[#0B1922]">
          <span>Service</span>
          <span>Vendor</span>
          <span>Location / Price</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="divide-y divide-[#9BBEC8]/20">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(index * 0.03, 0.25) }}
              className="group flex flex-col gap-4 p-5 transition-colors hover:bg-[#F8FBFD] lg:grid lg:grid-cols-[2fr_1.2fr_1fr_1fr_auto] lg:items-center lg:gap-4 dark:hover:bg-white/5"
            >
              {/* Service */}
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#DDF2FD] dark:bg-[#0B1922]">
                  {service.images?.[0] ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url("${service.images[0]}")` }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#427D9D]">
                      <BriefcaseBusiness size={18} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#164863] dark:text-[#DDF2FD]">
                    {service.name}
                  </p>
                  <p className="text-xs text-[#427D9D]">{service.category}</p>
                </div>
              </div>

              {/* Vendor */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-[#9BBEC8]">
                <UserRound size={14} />
                <span className="truncate">
                  {service.vendor?.name ||
                    service.vendor?.businessName ||
                    "WedPlan Vendor"}
                </span>
              </div>

              {/* Location / Price */}
              <div className="flex flex-wrap gap-x-3 text-xs text-gray-500 dark:text-[#9BBEC8]">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={13} /> {service.location || "—"}
                </span>
                <span className="font-semibold text-[#164863] dark:text-[#DDF2FD]">
                  ৳{Number(service.price).toLocaleString("en-BD")}
                </span>
              </div>

              {/* Status */}
              <div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(service.status)}`}
                >
                  {service.status}
                </span>
              </div>

              {/* Actions */}
              <div className="lg:justify-self-end">
                {renderActions(service)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  function renderKanban() {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {STATUSES.map((status) => {
          const columnServices = filteredServices.filter(
            (service) => service.status === status
          )

          return (
            <div
              key={status}
              className="rounded-2xl border border-[#9BBEC8]/40 bg-[#F4F8FB]/70 p-4 dark:bg-[#0B1922]"
            >
              {/* Column header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${status === "approved" ? "bg-emerald-500" : status === "rejected" ? "bg-red-500" : "bg-amber-500"}`}
                  />
                  <h3 className="text-sm font-bold text-[#164863] capitalize dark:text-[#DDF2FD]">
                    {status}
                  </h3>
                </div>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#427D9D] dark:bg-[#122B3A]">
                  {columnServices.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {columnServices.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-[#9BBEC8]/50 px-4 py-8 text-center text-xs text-[#427D9D]">
                    No {status} services
                  </p>
                ) : (
                  columnServices.map((service, index) => (
                    <motion.div
                      key={service._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.04, 0.25) }}
                      whileHover={{ y: -3 }}
                      className="group rounded-xl border border-[#9BBEC8]/40 bg-white p-4 shadow-sm transition-shadow hover:shadow-lg dark:bg-[#122B3A]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#DDF2FD] dark:bg-[#0B1922]">
                          {service.images?.[0] ? (
                            <div
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                              style={{
                                backgroundImage: `url("${service.images[0]}")`,
                              }}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[#427D9D]">
                              <BriefcaseBusiness size={18} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-[#164863] dark:text-[#DDF2FD]">
                            {service.name}
                          </p>
                          <p className="mt-0.5 text-xs text-[#427D9D]">
                            {service.category}
                          </p>
                          <p className="mt-1 truncate text-xs text-gray-500 dark:text-[#9BBEC8]">
                            {service.vendor?.name ||
                              service.vendor?.businessName ||
                              "WedPlan Vendor"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-[#9BBEC8]">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} /> {service.location || "—"}
                        </span>
                        <span className="font-semibold text-[#164863] dark:text-[#DDF2FD]">
                          ৳{Number(service.price).toLocaleString("en-BD")}
                        </span>
                      </div>

                      <div className="mt-3 border-t border-[#9BBEC8]/30 pt-3">
                        {renderActions(service)}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="flex items-center text-sm font-medium text-gray-500"
          >
            <ArrowLeft className="h-4 w-5" />
            Home
          </Link>

          <h1 className="mt-5 text-2xl font-bold text-[#164863] sm:text-3xl dark:text-[#DDF2FD]">
            Manage Services
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-[#9BBEC8]">
            Review, approve, reject and remove vendor service submissions.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {[
          { label: "Total Services", value: counts.all },
          { label: "Pending", value: counts.pending },
          { label: "Approved", value: counts.approved },
          { label: "Rejected", value: counts.rejected },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-2xl border border-[#9BBEC8]/40 bg-white p-4 shadow-sm sm:gap-4 sm:p-5 dark:bg-[#122B3A]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DDF2FD] text-[#164863] sm:h-11 sm:w-11 dark:bg-[#164863] dark:text-[#DDF2FD]">
              <BriefcaseBusiness size={19} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-gray-500 sm:text-sm dark:text-[#9BBEC8]">
                {item.label}
              </p>
              <h2 className="text-xl font-bold text-[#164863] sm:text-2xl dark:text-[#DDF2FD]">
                {item.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Search + View toggle */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-md">
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, category, location or vendor..."
            aria-label="Search services"
            className="w-full rounded-xl border border-[#9BBEC8]/50 bg-white py-3 pr-10 pl-11 text-sm text-[#164863] transition outline-none placeholder:text-gray-400 focus:border-[#427D9D] focus:ring-2 focus:ring-[#427D9D]/10 dark:bg-[#122B3A] dark:text-[#DDF2FD]"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-[#DDF2FD] hover:text-[#164863] dark:hover:bg-white/10"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div
          className="flex shrink-0 items-center gap-1 self-start rounded-xl border border-[#9BBEC8]/50 bg-white p-1 dark:bg-[#122B3A]"
          role="group"
          aria-label="View mode"
        >
          {VIEWS.map((view) => {
            const Icon = view.icon
            const active = viewMode === view.id

            return (
              <button
                key={view.id}
                type="button"
                onClick={() => setViewMode(view.id)}
                aria-pressed={active}
                title={`${view.label} view`}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                  active
                    ? "bg-[#164863] text-white shadow-sm dark:bg-[#427D9D]"
                    : "text-[#427D9D] hover:bg-[#DDF2FD]/60 dark:text-[#9BBEC8] dark:hover:bg-white/10"
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{view.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Status filter + result count */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", ...STATUSES] as StatusFilter[]).map((status) => {
            const active = statusFilter === status

            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                aria-pressed={active}
                className={`rounded-xl px-3 py-2 text-xs font-semibold capitalize transition-all sm:px-4 sm:text-sm ${
                  active
                    ? "bg-[#164863] text-white shadow-md shadow-[#164863]/15 dark:bg-[#427D9D]"
                    : "border border-[#9BBEC8]/50 bg-white text-[#427D9D] hover:bg-[#DDF2FD]/50 dark:bg-[#122B3A] dark:text-[#9BBEC8]"
                }`}
              >
                {status === "all" ? "All" : status}
                <span className="ml-1.5 opacity-75">{counts[status]}</span>
              </button>
            )
          })}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <X size={13} />
              Clear filters
            </button>
          )}
        </div>

        <p className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-[#9BBEC8]">
          <SlidersHorizontal size={14} />
          Showing{" "}
          <strong className="text-[#164863] dark:text-[#DDF2FD]">
            {filteredServices.length}
          </strong>{" "}
          of {services.length} services
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl bg-[#9BBEC8]/30"
            />
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#9BBEC8] bg-white px-6 py-16 text-center dark:bg-[#122B3A]">
          <CheckCircle2 size={48} className="mx-auto mb-4 text-[#427D9D]" />
          <h3 className="text-xl font-bold text-[#164863] dark:text-[#DDF2FD]">
            No Services Found
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-[#9BBEC8]">
            {hasActiveFilters
              ? "No services match your search or filter."
              : "No services have been submitted yet."}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-[#164863] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#427D9D]"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : viewMode === "list" ? (
        renderList()
      ) : (
        renderKanban()
      )}

      {/* Delete confirmation — explicit admin action required */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082B3D]/60 px-4 py-8 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#122B3A]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#164863] dark:text-[#DDF2FD]">
              Delete this service?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#427D9D] dark:text-[#9BBEC8]">
              You are about to permanently delete{" "}
              <span className="font-semibold text-[#164863] dark:text-[#DDF2FD]">
                {deleteTarget.name}
              </span>
              . This cannot be undone and the service will disappear from all
              listings.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-[#9BBEC8] px-5 py-2.5 text-sm font-semibold text-[#164863] transition hover:bg-[#F4F8FB] dark:text-[#DDF2FD] dark:hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={() => void confirmDelete()}
                disabled={processingId === deleteTarget._id}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {processingId === deleteTarget._id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Yes, delete service
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
