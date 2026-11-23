"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { authClient } from "@/lib/auth-client"

export default function AuthRedirect({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in")
    }
  }, [isPending, session, router])

  if (isPending || !session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#164863]" />
          <p className="text-sm text-[#427D9D]">Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
