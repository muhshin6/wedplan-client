import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your WedPlan account to manage bookings and services.",
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
