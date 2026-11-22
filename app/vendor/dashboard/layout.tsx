import VendorSidebar from "@/components/vendor/vendor-sidebar"
import RoleGuard from "@/components/auth/role-guard"
import type { ReactNode } from "react"

interface VendorDashboardLayoutProps {
  children: ReactNode
}

export default function VendorDashboardLayout({
  children,
}: VendorDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#DDF2FD]/40 dark:bg-[#080F19]">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#9BBEC8]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#427D9D]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 gap-6 p-4 lg:grid-cols-[280px_1fr] lg:gap-8 lg:p-8">
        {/* Sidebar */}
        <div className="lg:sticky lg:top-8 lg:h-fit">
          <VendorSidebar />
        </div>

        {/* Main Content */}
        <main className="min-w-0">
          {/* Page Content — only authenticated vendors */}
          <div className="rounded-2xl">
            <RoleGuard allowedRole="vendor">{children}</RoleGuard>
          </div>
        </main>
      </div>
    </div>
  )
}
