"use client"

import type { MouseEvent, ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

interface ServiceDetailsLinkProps {
  href: string
  className?: string
  children: ReactNode
}

export default function ServiceDetailsLink({
  href,
  className,
  children,
}: ServiceDetailsLinkProps) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Session still loading — ignore the click until we know the user
    if (isPending) {
      event.preventDefault()
      return
    }

    // Guests must sign in before viewing service details
    if (!session?.user) {
      event.preventDefault()
      router.push("/sign-in")
    }
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}
