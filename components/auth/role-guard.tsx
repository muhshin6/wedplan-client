"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { authClient } from "@/lib/auth-client"

interface RoleGuardProps {
  allowedRole: "customer" | "vendor" | "admin"
  children: React.ReactNode
}

function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#164863]" />
        <p className="text-sm text-[#427D9D]">{message}</p>
      </div>
    </div>
  )
}

export default function RoleGuard({ allowedRole, children }: RoleGuardProps) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const user = session?.user as { role?: string } | undefined

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in")
    }
  }, [isPending, session, router])

  if (isPending) {
    return <LoadingScreen message="Checking authentication..." />
  }

  if (!session) {
    return <LoadingScreen message="Redirecting to sign in..." />
  }

  if (user?.role !== allowedRole) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You are not authorized to access this page.</p>
      </div>
    )
  }

  return <>{children}</>
}
