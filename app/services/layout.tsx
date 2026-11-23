import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Browse Wedding Services",
  description:
    "Explore approved wedding vendors — photography, venues, catering, decoration and more. Search by name, category or location.",
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
