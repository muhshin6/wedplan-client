"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { authClient } from "@/lib/auth-client"

export default function DashboardRedirectPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (isPending) return

    if (!session) {
      router.replace("/sign-in")
      return
    }

    const role = (session.user as { role?: string }).role

    router.replace(
      role === "vendor"
        ? "/vendor/dashboard"
        : role === "admin"
          ? "/admin/dashboard"
          : "/customer/dashboard"
    )
  }, [isPending, session, router])

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#DDF2FD]/40">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-9 w-9 animate-spin text-[#164863]" />
        <p className="text-sm font-medium text-[#427D9D]">
          Opening your dashboard...
        </p>
      </div>
    </div>
  )
}
