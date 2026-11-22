"use client"

import RoleGuard from "@/components/auth/role-guard"
import ProfileSettingsView from "@/components/profile-settings-view"

export default function VendorProfilePage() {
  return (
    <RoleGuard allowedRole="vendor">
      <ProfileSettingsView />
    </RoleGuard>
  )
}
