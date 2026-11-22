"use client"

import { authClient } from "@/lib/auth-client"

interface RoleGuardProps {
  allowedRole: "customer" | "vendor"
  children: React.ReactNode
}

export default function RoleGuard({ allowedRole, children }: RoleGuardProps) {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <p className="p-10">Checking authentication...</p>
  }

  if (!session) {
    return <p className="p-10">Please sign in to continue.</p>
  }

  const user = session.user as typeof session.user & {
    role?: string
  }

  if (user.role !== allowedRole) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You are not authorized to access this page.</p>
      </div>
    )
  }

  return <>{children}</>
}
