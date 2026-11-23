"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  CheckCircle2,
  XCircle,
  MapPin,
  RefreshCw,
  BriefcaseBusiness,
  Search,
  Trash2,
  Wallet,
  UserRound,
} from "lucide-react"
import { toast } from "sonner"
import { API_URL } from "@/lib/api"

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

function statusStyle(status: string) {
  if (status === "approved") {
    return "bg-emerald-100 text-emerald-700"
  }

  if (status === "rejected") {
    return "bg-red-100 text-red-700"
  }

  return "bg-amber-100 text-amber-700"
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/services/admin/all`, {
        credentials: "include",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch services")
      }

      setServices(result.data)
    } catch (error) {
      console.error(error)

      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setLoading(true)
    await fetchServices()
  }

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
    try {
      setProcessingId(id)

      const response = await fetch(
        `${API_URL}/api/services/admin/${id}/status`,
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
      console.error(error)
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    } finally {
      setProcessingId(null)
    }
  }

  const handleDelete = async (service: Service) => {
    if (!window.confirm(`Delete "${service.name}" permanently?`)) return

    try {
      setProcessingId(service._id)

      const response = await fetch(
        `${API_URL}/api/services/admin/${service._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
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
    }
  }

  const filteredServices = services.filter((service) => {
    const value = search.toLowerCase()

    const matchesSearch =
      service.name?.toLowerCase().includes(value) ||
      service.category?.toLowerCase().includes(value) ||
      service.location?.toLowerCase().includes(value) ||
      service.vendor?.name?.toLowerCase().includes(value) ||
      service.vendor?.businessName?.toLowerCase().includes(value)

    const matchesStatus =
      statusFilter === "all" || service.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const counts = {
    all: services.length,
    pending: services.filter((s) => s.status === "pending").length,
    approved: services.filter((s) => s.status === "approved").length,
    rejected: services.filter((s) => s.status === "rejected").length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-[#427D9D]">
            ADMINISTRATION
          </p>

          <h1 className="text-2xl font-bold text-[#164863] sm:text-3xl">
            Manage Services
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Review, approve, reject and remove vendor service submissions.
          </p>
        </div>

        <button
          onClick={() => void handleRefresh()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9BBEC8] bg-white px-4 py-3 text-sm font-semibold text-[#164863] transition hover:bg-[#DDF2FD] disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Services", value: counts.all },
          { label: "Pending", value: counts.pending },
          { label: "Approved", value: counts.approved },
          { label: "Rejected", value: counts.rejected },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-4 rounded-2xl border border-[#9BBEC8]/40 bg-white p-5 shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DDF2FD] text-[#164863]">
              <BriefcaseBusiness size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <h2 className="text-2xl font-bold text-[#164863]">
                {item.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Search + status filter */}
      <div className="relative">
        <Search
          size={18}
          className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, category, location or vendor..."
          className="w-full rounded-xl border border-[#9BBEC8]/50 bg-white py-3 pr-4 pl-11 text-sm text-[#164863] transition outline-none placeholder:text-gray-400 focus:border-[#427D9D] focus:ring-2 focus:ring-[#427D9D]/10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "approved", "rejected"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition-all ${
              statusFilter === status
                ? "bg-[#164863] text-white shadow-md shadow-[#164863]/15"
                : "border border-[#9BBEC8]/50 bg-white text-[#427D9D] hover:bg-[#DDF2FD]/50"
            }`}
          >
            {status === "all"
              ? "All Services"
              : `${status} (${counts[status]})`}
          </button>
        ))}
      </div>

      {/* Services grid */}
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#9BBEC8] bg-white px-6 py-16 text-center">
          <CheckCircle2 size={48} className="mx-auto mb-4 text-[#427D9D]" />

          <h3 className="text-xl font-bold text-[#164863]">
            No Services Found
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            {search || statusFilter !== "all"
              ? "No services match your search or filter."
              : "No services have been submitted yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service, index) => (
            <motion.article
              key={service._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.04, 0.3) }}
              className="overflow-hidden rounded-2xl border border-[#9BBEC8]/40 bg-white shadow-sm"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden bg-[#DDF2FD]">
                {service.images?.[0] ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${service.images[0]}")` }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#427D9D]">
                    <BriefcaseBusiness size={36} />
                  </div>
                )}

                <span
                  className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyle(
                    service.status
                  )}`}
                >
                  {service.status}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-3 p-5">
                <div>
                  <h3 className="truncate font-bold text-[#164863]">
                    {service.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-[#427D9D]">
                    {service.category}
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} />
                    {service.location}
                  </span>

                  <span className="inline-flex items-center gap-1.5 font-semibold text-[#164863]">
                    <Wallet size={14} />৳
                    {Number(service.price).toLocaleString("en-BD")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <UserRound size={14} />
                  <span className="truncate">
                    {service.vendor?.name ||
                      service.vendor?.businessName ||
                      "WedPlan Vendor"}
                  </span>
                </div>

                <p className="text-xs text-gray-400">
                  Submitted{" "}
                  {service.createdAt
                    ? new Date(service.createdAt).toLocaleDateString()
                    : "—"}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 border-t border-[#9BBEC8]/30 pt-4">
                  {service.status !== "approved" && (
                    <button
                      onClick={() =>
                        void handleStatusUpdate(service._id, "approved")
                      }
                      disabled={processingId === service._id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <CheckCircle2 size={14} />
                      Approve
                    </button>
                  )}

                  {service.status !== "rejected" && (
                    <button
                      onClick={() =>
                        void handleStatusUpdate(service._id, "rejected")
                      }
                      disabled={processingId === service._id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                  )}

                  <button
                    onClick={() => void handleDelete(service)}
                    disabled={processingId === service._id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#9BBEC8] px-3 py-2 text-xs font-semibold text-[#164863] transition hover:bg-[#F4F8FB] disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  )
}
