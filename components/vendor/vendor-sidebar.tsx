"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  BriefcaseBusiness,
  PlusCircle,
  ClipboardList,
  CreditCard,
  UserRound,
  Sparkles,
} from "lucide-react"

const menuItems = [
  {
    title: "Overview",
    href: "/vendor/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Services",
    href: "/vendor/dashboard/my-services",
    icon: BriefcaseBusiness,
  },
  {
    title: "Add Service",
    href: "/vendor/dashboard/add-service",
    icon: PlusCircle,
  },
  {
    title: "Booking Requests",
    href: "/vendor/dashboard/booking-requests",
    icon: ClipboardList,
  },
  {
    title: "Subscription",
    href: "/vendor/dashboard/subscription",
    icon: CreditCard,
  },
  {
    title: "Profile Settings",
    href: "/vendor/dashboard/profile",
    icon: UserRound,
  },
]

export default function VendorSidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#164863] p-4 text-white shadow-xl shadow-[#164863]/15"
    >
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#427D9D]/40 blur-3xl" />

      {/* Brand */}
      <div className="relative mb-6 flex items-center gap-3 border-b border-white/10 px-2 pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
          <Sparkles className="h-5 w-5 text-[#DDF2FD]" />
        </div>

        <div>
          <h2 className="text-lg font-bold tracking-tight">Vendor Panel</h2>

          <p className="text-xs text-[#9BBEC8]">Manage your wedding business</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative space-y-1.5">
        <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.2em] text-[#9BBEC8] uppercase">
          Workspace
        </p>

        {menuItems.map((item, index) => {
          const Icon = item.icon

          const isActive =
            pathname === item.href ||
            (item.href !== "/vendor/dashboard" &&
              pathname.startsWith(item.href))

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
              }}
            >
              <Link
                href={item.href}
                className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-3.5 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-[#DDF2FD] text-[#164863] shadow-lg shadow-black/10"
                    : "text-[#DDF2FD]/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="vendor-active-indicator"
                    className="absolute top-2 left-0 h-7 w-1 rounded-r-full bg-[#427D9D]"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}

                <motion.span
                  whileHover={{ scale: 1.12, rotate: isActive ? 0 : -4 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </motion.span>

                <span>{item.title}</span>

                {isActive && (
                  <motion.div
                    layoutId="vendor-active-dot"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-[#164863]"
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Bottom card */}
      <motion.div
        whileHover={{ y: -3 }}
        className="relative mt-7 overflow-hidden rounded-xl border border-white/10 bg-white/[0.07] p-4"
      >
        <div className="absolute -top-5 -right-5 h-20 w-20 rounded-full bg-[#427D9D]/30 blur-2xl" />

        <div className="relative">
          <p className="text-sm font-semibold text-white">Grow your business</p>

          <p className="mt-1 text-xs leading-5 text-[#9BBEC8]">
            Keep your services updated and manage booking requests.
          </p>
        </div>
      </motion.div>
    </motion.aside>
  )
}
