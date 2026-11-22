"use client"

import { motion } from "framer-motion"
import { CreditCard } from "lucide-react"

export default function AdminTransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-[#427D9D]">
          ADMINISTRATION
        </p>

        <h1 className="text-2xl font-bold text-[#164863] sm:text-3xl">
          Transactions
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Monitor and manage platform transactions.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-[#9BBEC8]/40 bg-white p-8 text-center shadow-sm"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DDF2FD] text-[#164863]">
          <CreditCard size={32} />
        </div>

        <h2 className="text-xl font-bold text-[#164863]">
          Transaction Management
        </h2>

        <p className="mt-2 max-w-md text-sm text-gray-500">
          Transaction records will appear here when available.
        </p>
      </motion.div>
    </div>
  )
}
