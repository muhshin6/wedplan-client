"use client"

import { useEffect, useState, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { motion } from "framer-motion"
import {
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  ImageOff,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Wallet,
  X,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { API_URL } from "@/lib/api"

interface Service {
  _id: string
  name: string
  category: string
  description: string
  location: string
  price: number
  images: string[]
  status: string
  isActive: boolean
}

const serviceCategories = [
  "Photography",
  "Videography",
  "Catering",
  "Venue",
  "Decoration",
  "Makeup",
  "Music",
  "Others",
]

function statusStyle(status: string) {
  if (status === "approved") {
    return {
      className:
        "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300",
      label: "Approved",
      icon: BadgeCheck,
    }
  }

  if (status === "rejected") {
    return {
      className: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
      label: "Rejected",
      icon: XCircle,
    }
  }

  return {
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    label: "Pending",
    icon: Clock3,
  }
}

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    description: "",
    location: "",
    price: "",
  })

  async function loadServices(showLoader = false) {
    if (showLoader) setRefreshing(true)

    try {
      const response = await fetch(
        `${API_URL}/api/services/vendor/my-services`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      )

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch services.")
      }

      setServices(result.data)
      setError("")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    let ignore = false

    async function fetchInitialServices() {
      try {
        const response = await fetch(
          `${API_URL}/api/services/vendor/my-services`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        )

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch services.")
        }

        if (!ignore) {
          setServices(result.data)
          setError("")
        }
      } catch (error) {
        if (!ignore) {
          setError(
            error instanceof Error ? error.message : "Something went wrong."
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    void fetchInitialServices()

    return () => {
      ignore = true
    }
  }, [])

  function openEdit(service: Service) {
    setEditingId(service._id)
    setEditForm({
      name: service.name,
      category: service.category,
      description: service.description,
      location: service.location,
      price: String(service.price),
    })
  }

  async function handleUpdate(event: FormEvent, serviceId: string) {
    event.preventDefault()

    if (
      !editForm.name.trim() ||
      !editForm.category ||
      !editForm.description.trim() ||
      !editForm.location.trim() ||
      !Number.isFinite(Number(editForm.price)) ||
      Number(editForm.price) <= 0
    ) {
      toast.error("Please fill in all fields with valid values.")
      return
    }

    setSavingId(serviceId)
    const toastId = toast.loading("Updating service...")

    try {
      const response = await fetch(`${API_URL}/api/services/${serviceId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name.trim(),
          category: editForm.category,
          description: editForm.description.trim(),
          location: editForm.location.trim(),
          price: Number(editForm.price),
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update service.")
      }

      toast.success("Service updated successfully!", { id: toastId })
      setEditingId(null)
      await loadServices()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
        { id: toastId }
      )
    } finally {
      setSavingId(null)
    }
  }

  async function handleToggleAvailability(service: Service) {
    setTogglingId(service._id)
    const toastId = toast.loading("Updating availability...")

    try {
      const response = await fetch(`${API_URL}/api/services/${service._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !service.isActive }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update availability.")
      }

      toast.success(
        service.isActive
          ? "Service marked as unavailable."
          : "Service is now available.",
        { id: toastId }
      )

      setServices((previous) =>
        previous.map((item) =>
          item._id === service._id
            ? { ...item, isActive: !service.isActive }
            : item
        )
      )
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
        { id: toastId }
      )
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDeleteService(serviceId: string) {
    if (!window.confirm("Delete this service permanently?")) return

    const toastId = toast.loading("Deleting service...")

    try {
      const response = await fetch(`${API_URL}/api/services/${serviceId}`, {
        method: "DELETE",
        credentials: "include",
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete service.")
      }

      setServices((previous) =>
        previous.filter((service) => service._id !== serviceId)
      )

      toast.success("Service deleted successfully!", { id: toastId })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
        { id: toastId }
      )
    }
  }

  const approvedCount = services.filter(
    (service) => service.status === "approved"
  ).length
  const pendingCount = services.filter(
    (service) => service.status === "pending"
  ).length

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#427D9D] dark:text-[#9BBEC8]">
            <BriefcaseBusiness className="h-4 w-4" />
            Vendor Workspace
          </div>

          <h1 className="text-2xl font-bold text-[#164863] sm:text-3xl dark:text-[#DDF2FD]">
            My Services
          </h1>

          <p className="mt-2 text-sm text-[#427D9D] dark:text-[#9BBEC8]">
            View, update and manage all your wedding services.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => void loadServices(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-[#9BBEC8]/40 bg-white px-4 py-2.5 text-sm font-semibold text-[#164863] transition hover:bg-[#DDF2FD] disabled:opacity-60 dark:bg-[#101B2A] dark:text-[#DDF2FD]"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          <Link
            href="/vendor/dashboard/add-service"
            className="inline-flex items-center gap-2 rounded-xl bg-[#164863] px-4 py-2.5 text-sm font-semibold text-[#DDF2FD] transition hover:bg-[#427D9D]"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </Link>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Services", value: services.length },
          { label: "Approved", value: approvedCount },
          { label: "Pending Approval", value: pendingCount },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[#9BBEC8]/30 bg-white p-5 shadow-sm dark:bg-[#101B2A]"
          >
            <p className="text-sm font-medium text-[#427D9D] dark:text-[#9BBEC8]">
              {item.label}
            </p>
            <h3 className="mt-2 text-3xl font-bold text-[#164863] dark:text-[#DDF2FD]">
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {loading ? (
        <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-[#9BBEC8]/30 bg-white dark:bg-[#101B2A]">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#9BBEC8] border-t-[#164863]" />
        </div>
      ) : services.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#9BBEC8]/50 bg-white px-5 text-center dark:bg-[#101B2A]">
          <BriefcaseBusiness className="h-10 w-10 text-[#427D9D]" />
          <h3 className="mt-4 text-base font-bold text-[#164863] dark:text-[#DDF2FD]">
            You have not added any services yet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-[#427D9D] dark:text-[#9BBEC8]">
            Add your first wedding service to start receiving booking requests.
          </p>
          <Link href="/vendor/dashboard/add-service">
            <Button className="mt-5 bg-[#164863] text-[#DDF2FD] hover:bg-[#427D9D]">
              Add Service
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5">
          {services.map((service, index) => {
            const status = statusStyle(service.status)
            const StatusIcon = status.icon

            return (
              <motion.article
                key={service._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="overflow-hidden rounded-2xl border border-[#9BBEC8]/30 bg-white shadow-sm dark:bg-[#101B2A]"
              >
                <div className="flex flex-col gap-5 p-5 sm:flex-row">
                  {/* Image */}
                  <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-[#DDF2FD] sm:h-36 sm:w-52 dark:bg-[#164863]/20">
                    {service.images?.[0] ? (
                      <Image
                        src={service.images[0]}
                        alt={service.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#427D9D]">
                        <ImageOff className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-[#164863] dark:text-[#DDF2FD]">
                          {service.name}
                        </h2>
                        <p className="mt-1 text-xs font-medium text-[#427D9D] dark:text-[#9BBEC8]">
                          {service.category}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status.label}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#427D9D] dark:text-[#9BBEC8]">
                      {service.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#427D9D] dark:text-[#9BBEC8]">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {service.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#164863] dark:text-[#DDF2FD]">
                        <Wallet className="h-4 w-4" />৳
                        {Number(service.price).toLocaleString("en-BD")}
                      </span>
                    </div>

                    {service.status === "rejected" && (
                      <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-300">
                        This service was rejected by an admin and is not visible
                        to customers. Update it and it will need re-approval.
                      </p>
                    )}

                    {/* Availability */}
                    <div className="mt-5 flex items-center justify-between rounded-xl border border-[#9BBEC8]/30 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-[#164863] dark:text-[#DDF2FD]">
                          Service Availability
                        </p>
                        <p className="mt-0.5 text-xs text-[#427D9D] dark:text-[#9BBEC8]">
                          {service.isActive
                            ? "Visible to customers (when approved)"
                            : "Hidden from customers"}
                        </p>
                      </div>
                      <Switch
                        checked={service.isActive === true}
                        onCheckedChange={() =>
                          void handleToggleAvailability(service)
                        }
                        disabled={togglingId === service._id}
                        aria-label="Toggle service availability"
                      />
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(service)}
                        className="flex items-center gap-2 border-[#9BBEC8] text-[#164863] dark:text-[#DDF2FD]"
                      >
                        <Pencil className="h-4 w-4" />
                        Update Service
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => void handleDeleteService(service._id)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Inline edit form */}
                {editingId === service._id && (
                  <form
                    onSubmit={(event) => void handleUpdate(event, service._id)}
                    className="space-y-4 border-t border-[#9BBEC8]/30 bg-[#DDF2FD]/30 p-5 dark:bg-[#164863]/10"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[#164863] dark:text-[#DDF2FD]">
                        Update service information
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-lg p-1 text-[#427D9D] hover:bg-[#9BBEC8]/30"
                        aria-label="Close edit form"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Service Name</Label>
                        <Input
                          value={editForm.name}
                          onChange={(event) =>
                            setEditForm((previous) => ({
                              ...previous,
                              name: event.target.value,
                            }))
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Category</Label>
                        <select
                          value={editForm.category}
                          onChange={(event) =>
                            setEditForm((previous) => ({
                              ...previous,
                              category: event.target.value,
                            }))
                          }
                          className="flex h-10 w-full rounded-md border border-[#9BBEC8]/70 bg-white px-3 py-2 text-sm text-[#164863] dark:bg-[#0B1020] dark:text-[#DDF2FD]"
                          required
                        >
                          {serviceCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={editForm.location}
                          onChange={(event) =>
                            setEditForm((previous) => ({
                              ...previous,
                              location: event.target.value,
                            }))
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Price (BDT)</Label>
                        <Input
                          type="number"
                          min="1"
                          value={editForm.price}
                          onChange={(event) =>
                            setEditForm((previous) => ({
                              ...previous,
                              price: event.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={editForm.description}
                        onChange={(event) =>
                          setEditForm((previous) => ({
                            ...previous,
                            description: event.target.value,
                          }))
                        }
                        rows={3}
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={savingId === service._id}
                        className="bg-[#164863] text-[#DDF2FD] hover:bg-[#427D9D]"
                      >
                        {savingId === service._id
                          ? "Saving..."
                          : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </motion.article>
            )
          })}
        </div>
      )}
    </section>
  )
}
