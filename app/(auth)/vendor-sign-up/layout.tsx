import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Become a Vendor",
  description:
    "Register your wedding business on WedPlan and start receiving booking requests.",
}

export default function VendorSignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
