"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  CheckCircle2,
  XCircle,
  MapPin,
  RefreshCw,
  BriefcaseBusiness,
  Clock,
} from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

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
  createdAt: string
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

 const fetchPendingServices = async () => {
   try {
     const response = await fetch(
       "http://localhost:5000/api/services/admin/pending",
       {
         credentials: "include",
       }
     )

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
   await fetchPendingServices()
 }

 useEffect(() => {
   const timer = window.setTimeout(() => {
     void fetchPendingServices()
   }, 0)

   return () => {
     window.clearTimeout(timer)
   }
 }, [])

  const handleStatusUpdate = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setProcessingId(id)

      const response = await fetch(
        `http://localhost:5000/api/services/admin/${id}/status`,
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
        previous.filter((service) => service._id !== id)
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
            Review and manage vendor service submissions.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9BBEC8] bg-white px-4 py-3 text-sm font-semibold text-[#164863] transition hover:bg-[#DDF2FD] disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 rounded-2xl border border-[#9BBEC8]/40 bg-white p-5 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DDF2FD] text-[#164863]">
          <Clock size={24} />
        </div>

        <div>
          <p className="text-sm text-gray-500">Pending Approvals</p>
          <h2 className="text-2xl font-bold text-[#164863]">
            {services.length}
          </h2>
        </div>
      </div>

      {/* Services */}
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#9BBEC8] bg-white px-6 py-16 text-center">
          <CheckCircle2 size={48} className="mx-auto mb-4 text-[#427D9D]" />

          <h3 className="text-xl font-bold text-[#164863]">All Caught Up!</h3>

          <p className="mt-2 text-sm text-gray-500">
            There are no pending services to review.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="overflow-hidden rounded-2xl border border-[#9BBEC8]/40 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative h-48 bg-[#DDF2FD]">
                {service.images?.[0] ? (
                  <Image
                    src={service.images[0]}
                    alt={service.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#427D9D]">
                    <BriefcaseBusiness size={48} />
                  </div>
                )}

                <span className="absolute top-3 right-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  Pending
                </span>
              </div>

              {/* Content */}
              <div className="space-y-4 p-5">
                <div>
                  <span className="rounded-lg bg-[#DDF2FD] px-3 py-1 text-xs font-semibold text-[#164863] capitalize">
                    {service.category}
                  </span>

                  <h3 className="mt-3 text-lg font-bold text-[#164863]">
                    {service.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={16} className="text-[#427D9D]" />
                  {service.location}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-xs text-gray-400">Service Price</p>
                    <p className="text-xl font-bold text-[#164863]">
                      ৳{service.price.toLocaleString("en-BD")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-400">Submitted</p>
                    <p className="text-xs font-medium text-gray-600">
                      {new Date(service.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleStatusUpdate(service._id, "approved")}
                    disabled={processingId === service._id}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#164863] px-3 py-3 text-sm font-semibold text-white transition hover:bg-[#427D9D] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    Approve
                  </button>

                  <button
                    onClick={() => handleStatusUpdate(service._id, "rejected")}
                    disabled={processingId === service._id}
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>

                {processingId === service._id && (
                  <p className="text-center text-xs text-gray-400">
                    Updating service...
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
