"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  Receipt,
  ShieldCheck,
  Heart,
} from "lucide-react"

const menuItems = [
  {
    title: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Users",
    href: "/admin/dashboard/users",
    icon: Users,
  },
  {
    title: "Manage Services",
    href: "/admin/dashboard/services",
    icon: BriefcaseBusiness,
  },
  {
    title: "Transactions",
    href: "/admin/dashboard/transactions",
    icon: Receipt,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 z-40 flex h-screen w-[270px] flex-col overflow-hidden bg-[#164863] text-white shadow-2xl">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-7">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#164863]">
          <Heart size={23} fill="currentColor" />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight">WedPlan</h1>
          <p className="text-[10px] font-semibold tracking-[3px] text-[#9BBEC8] uppercase">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="mx-5 mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#9BBEC8] text-lg font-bold text-[#164863]">
          A
        </div>

        <div>
          <p className="text-sm font-semibold">Administrator</p>
          <p className="text-xs text-[#DDF2FD]/70">Platform Management</p>
        </div>

        <ShieldCheck className="ml-auto text-[#9BBEC8]" size={19} />
      </div>

      {/* Navigation */}
      <div className="px-5 pt-9">
        <p className="mb-4 px-3 text-[10px] font-bold tracking-[2px] text-[#9BBEC8] uppercase">
          Management
        </p>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon

            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors duration-300 hover:bg-white/10"
              >
                {isActive && (
                  <motion.div
                    layoutId="admin-active-menu"
                    className="absolute inset-0 rounded-xl bg-[#427D9D]"
                    transition={{ duration: 0.3 }}
                  />
                )}

                <Icon
                  size={19}
                  className={`relative z-10 ${
                    isActive ? "text-white" : "text-[#9BBEC8]"
                  }`}
                />

                <span
                  className={`relative z-10 ${
                    isActive ? "text-white" : "text-[#DDF2FD]/80"
                  }`}
                >
                  {item.title}
                </span>

                {isActive && (
                  <motion.span
                    layoutId="admin-active-indicator"
                    className="absolute right-3 z-10 h-1.5 w-1.5 rounded-full bg-white"
                  />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-white/10 p-5">
        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-xs font-semibold">WedPlan Admin</p>
          <p className="mt-1 text-[11px] text-[#DDF2FD]/60">
            Manage your platform with confidence.
          </p>
        </div>

        <p className="mt-5 text-center text-[10px] text-[#DDF2FD]/50">
          © 2026 WedPlan. All rights reserved.
        </p>
      </div>
    </aside>
  )
}
