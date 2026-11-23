"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  CreditCard,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarDays,
  UserRound,
  Lock,
} from "lucide-react"
import { toast } from "sonner"
import { API_URL } from "@/lib/api"

interface Transaction {
  _id: string
  vendorId: string
  vendorName?: string
  vendorEmail?: string
  plan: string
  planName?: string
  amount: number
  currency?: string
  status: string
  createdAt: string
}

function statusStyle(status: string) {
  if (status === "success" || status === "paid" || status === "completed") {
    return {
      cls: "bg-emerald-100 text-emerald-700",
      icon: CheckCircle2,
      label: "Success",
    }
  }

  if (status === "failed" || status === "rejected") {
    return {
      cls: "bg-red-100 text-red-700",
      icon: XCircle,
      label: status,
    }
  }

  return {
    cls: "bg-amber-100 text-amber-700",
    icon: Clock,
    label: status,
  }
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  async function loadTransactions() {
    try {
      const response = await fetch(`${API_URL}/api/admin/transactions`, {
        credentials: "include",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch transactions")
      }

      setTransactions(result.data)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch transactions"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    async function initialLoad() {
      try {
        const response = await fetch(`${API_URL}/api/admin/transactions`, {
          credentials: "include",
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch transactions")
        }

        if (!ignore) setTransactions(result.data)
      } catch (error) {
        if (!ignore) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to fetch transactions"
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

  const totalCollected = transactions
    .filter((t) => ["success", "paid", "completed"].includes(t.status))
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-[#427D9D]">
            ADMINISTRATION
          </p>

          <h1 className="text-2xl font-bold text-[#164863] sm:text-3xl">
            Transactions
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Read-only payment records. Records cannot be modified manually.
          </p>
        </div>

        <button
          onClick={() => {
            setLoading(true)
            void loadTransactions()
          }}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9BBEC8] bg-white px-4 py-3 text-sm font-semibold text-[#164863] transition hover:bg-[#DDF2FD] disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Read-only notice */}
      <div className="flex items-center gap-3 rounded-xl border border-[#9BBEC8]/40 bg-[#DDF2FD]/50 px-4 py-3 text-sm text-[#164863]">
        <Lock size={18} className="shrink-0 text-[#427D9D]" />
        Payment records are created by the server and are immutable — admin
        accounts cannot mark an unsuccessful payment as successful.
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-[#9BBEC8]/40 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DDF2FD] text-[#164863]">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Transactions</p>
            <h2 className="text-2xl font-bold text-[#164863]">
              {transactions.length}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#9BBEC8]/40 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Successful Payments</p>
            <h2 className="text-2xl font-bold text-[#164863]">
              ৳{totalCollected.toLocaleString("en-BD")}
            </h2>
          </div>
        </div>
      </div>

      {/* Transactions table */}
      <div className="overflow-hidden rounded-2xl border border-[#9BBEC8]/40 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-14 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DDF2FD] text-[#164863]">
              <CreditCard size={32} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#164863]">
              No Transactions Yet
            </h3>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Subscription payments will appear here once a vendor upgrades
              their plan.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-187.5 text-left">
              <thead className="bg-[#F4F8FB]">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Vendor
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Subscription Plan
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {transactions.map((transaction, index) => {
                  const status = statusStyle(transaction.status)
                  const StatusIcon = status.icon

                  return (
                    <motion.tr
                      key={transaction._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.04, 0.3) }}
                      className="transition hover:bg-[#F8FBFD]"
                    >
                      {/* Vendor Information */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DDF2FD] text-[#164863]">
                            <UserRound size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#164863]">
                              {transaction.vendorName || "Unknown Vendor"}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                              {transaction.vendorEmail || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Subscription Plan */}
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-[#DDF2FD] px-3 py-1 text-xs font-semibold text-[#164863] capitalize">
                          {transaction.planName || transaction.plan}
                        </span>
                      </td>

                      {/* Payment Amount */}
                      <td className="px-6 py-4 text-sm font-bold text-[#164863]">
                        ৳{Number(transaction.amount).toLocaleString("en-BD")}
                        <span className="ml-1 text-xs font-normal text-gray-400">
                          {transaction.currency || "BDT"}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.cls}`}
                        >
                          <StatusIcon size={14} />
                          {status.label}
                        </span>
                      </td>

                      {/* Transaction Date */}
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          {transaction.createdAt
                            ? new Date(transaction.createdAt).toLocaleString()
                            : "—"}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
