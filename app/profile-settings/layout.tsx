import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Manage your WedPlan account details, photo and password.",
}

export default function ProfileSettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
