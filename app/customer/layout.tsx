import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Wedding Dashboard",
  description: "Track your wedding booking requests and plans on WedPlan.",
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
