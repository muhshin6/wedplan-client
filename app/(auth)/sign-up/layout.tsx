import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create an Account",
  description:
    "Join WedPlan as a customer or vendor and start planning your dream wedding.",
}

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
