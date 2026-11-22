"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Bell, Menu, ShieldCheck } from "lucide-react"

interface AdminHeaderProps {
  onMenuClick?: () => void
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [search, setSearch] = useState("")

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#164863]/10 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Mobile Menu + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-[#164863] transition hover:bg-[#DDF2FD] lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#427D9D]" />
            <span className="text-xs font-medium text-[#427D9D]">
              WedPlan / Admin
            </span>
          </div>

          <h2 className="mt-0.5 text-sm font-bold text-[#164863] sm:text-base">
            Administration Panel
          </h2>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search */}
        <div className="hidden items-center gap-2 rounded-xl border border-[#164863]/10 bg-[#F4F8FB] px-3 py-2.5 md:flex">
          <Search size={17} className="text-[#427D9D]" />

          <input
            type="text"
            placeholder="Search anything..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-36 bg-transparent text-xs text-[#164863] outline-none placeholder:text-gray-400 lg:w-48"
          />

          <kbd className="rounded border border-[#164863]/10 px-1.5 py-0.5 text-[10px] text-gray-400">
            ⌘ K
          </kbd>
        </div>

        {/* Notification */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative rounded-xl border border-[#164863]/10 p-2.5 text-[#164863] transition hover:bg-[#DDF2FD]"
          aria-label="Notifications"
        >
          <Bell size={19} />

          <span className="absolute top-2 right-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
        </motion.button>

        {/* Admin Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#164863] text-sm font-bold text-white shadow-md shadow-[#164863]/20">
          A
        </div>
      </div>
    </header>
  )
}
