import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Payment",
  description: "Subscription payment status on WedPlan.",
}

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
