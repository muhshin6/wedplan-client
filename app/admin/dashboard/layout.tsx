"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2 } from "lucide-react"

import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import { authClient } from "@/lib/auth-client"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const { data: session, isPending } = authClient.useSession()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const userRole = session?.user?.role

  useEffect(() => {
    if (isPending) return

    if (!session) {
      router.replace("/sign-in")
      return
    }

    if (userRole !== "admin") {
      router.replace("/")
    }
  }, [session, isPending, userRole, router])

  if (isPending || !session || userRole !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F8FB]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-9 w-9 animate-spin text-[#164863]" />

          <p className="text-sm font-medium text-[#427D9D]">
            Verifying admin access...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F8FB]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3 }}
              className="relative h-full w-67.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-3 right-3 z-60 rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>

              <AdminSidebar />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="min-h-screen lg:ml-67.5">
        <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="min-h-[calc(100vh-76px)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
