import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "WedPlan administration — users, services and transactions.",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
