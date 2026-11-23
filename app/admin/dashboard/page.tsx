"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { API_URL } from "@/lib/api"
import {
  Users,
  Store,
  UserRound,
  BriefcaseBusiness,
  Clock,
  CreditCard,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"

interface AdminStats {
  totalUsers: number
  totalVendors: number
  totalCustomers: number
  totalServices: number
  pendingServices: number
  totalTransactions: number
}

const initialStats: AdminStats = {
  totalUsers: 0,
  totalVendors: 0,
  totalCustomers: 0,
  totalServices: 0,
  pendingServices: 0,
  totalTransactions: 0,
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>(initialStats)
  const [loading, setLoading] = useState(true)

  const fetchAdminStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/stats`, {
        credentials: "include",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch dashboard statistics"
        )
      }

      setStats(result.data)
    } catch (error) {
      console.error("Admin Stats Error:", error)

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard statistics"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    const loadStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/stats`, {
          credentials: "include",
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch dashboard statistics"
          )
        }

        if (!cancelled) {
          setStats(result.data)
        }
      } catch (error) {
        console.error("Admin Stats Error:", error)

        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load dashboard statistics"
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadStats()

    return () => {
      cancelled = true
    }
  }, [])

  const statCards = [
    {
      title: "Total Registered Users",
      value: stats.totalUsers,
      icon: Users,
      description: "All registered accounts",
      color: "#164863",
      bg: "#DDF2FD",
    },
    {
      title: "Total Vendors",
      value: stats.totalVendors,
      icon: Store,
      description: "Registered service vendors",
      color: "#427D9D",
      bg: "#EAF4F8",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: UserRound,
      description: "Registered customers",
      color: "#16806A",
      bg: "#E6F6F1",
    },
    {
      title: "Total Services",
      value: stats.totalServices,
      icon: BriefcaseBusiness,
      description: "All submitted services",
      color: "#7C3AED",
      bg: "#F1EAFE",
    },
    {
      title: "Pending Services",
      value: stats.pendingServices,
      icon: Clock,
      description: "Waiting for approval",
      color: "#D97706",
      bg: "#FFF4E5",
    },
    {
      title: "Total Transactions",
      value: stats.totalTransactions,
      icon: CreditCard,
      description: "Recorded transactions",
      color: "#DB2777",
      bg: "#FCE7F3",
    },
  ]

  const handleRefresh = async () => {
    setLoading(true)
    await fetchAdminStats()
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
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Monitor your WedPlan platform at a glance.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9BBEC8] bg-white px-4 py-3 text-sm font-semibold text-[#164863] transition hover:bg-[#DDF2FD] disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Stats
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card, index) => {
          const Icon = card.icon

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="group rounded-2xl border border-[#9BBEC8]/30 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-[#164863]">
                    {loading ? (
                      <span className="inline-block h-9 w-16 animate-pulse rounded-lg bg-gray-100" />
                    ) : (
                      card.value.toLocaleString("en-BD")
                    )}
                  </h2>
                </div>

                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: card.bg,
                    color: card.color,
                  }}
                >
                  <Icon size={24} />
                </div>
              </div>

              <p className="mt-5 text-xs text-gray-400">{card.description}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
