"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import {
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Save,
  Shield,
  UserRound,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ProfileUser {
  id: string
  name?: string
  email?: string
  image?: string | null
  role?: string
  businessName?: string
}

function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter()
  const isVendor = user.role === "vendor"

  const [name, setName] = useState(user.name || "")
  const [businessName, setBusinessName] = useState(user.businessName || "")
  const [savingProfile, setSavingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const initials = (user.name || "U")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const dashboardPath =
    user.role === "vendor"
      ? "/vendor/dashboard"
      : user.role === "admin"
        ? "/admin/dashboard"
        : "/customer/dashboard"

  async function handleProfileSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!name.trim()) {
      toast.error("Full name is required.")
      return
    }

    setSavingProfile(true)

    try {
      const result = await authClient.updateUser({
        name: name.trim(),
        ...(isVendor ? { businessName: businessName.trim() } : {}),
      })

      if (result.error) {
        toast.error(result.error.message || "Failed to update profile.")
        return
      }

      toast.success("Profile updated successfully!")
      router.refresh()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSavingProfile(false)
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.")
      return
    }

    setSavingPassword(true)

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })

      if (result.error) {
        toast.error(result.error.message || "Failed to change password.")
        return
      }

      toast.success("Password changed successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSavingPassword(false)
    }
  }

  async function handleLogout() {
    await authClient.signOut()
    router.push("/sign-in")
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <UserRound className="h-5 w-5 text-[#427D9D]" />
          <h1 className="text-3xl font-bold text-[#164863]">
            Profile Settings
          </h1>
        </div>
        <p className="text-[#164863]/70">
          Manage your account information, password and security.
        </p>
      </div>

      {/* Profile overview */}
      <Card className="rounded-2xl border border-[#9BBEC8]/40 bg-white">
        <CardContent className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#164863] text-2xl font-bold text-[#DDF2FD] shadow-lg shadow-[#164863]/20">
            {initials}
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h2 className="truncate text-xl font-bold text-[#164863]">
              {user.name || "WedPlan User"}
            </h2>
            <p className="truncate text-sm text-[#427D9D]">
              {user.email || "No email on file"}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Badge className="bg-[#164863]/10 text-[#164863] capitalize hover:bg-[#164863]/10">
                <Shield className="mr-1 h-3 w-3" />
                {user.role || "customer"}
              </Badge>
              {isVendor && user.businessName && (
                <Badge
                  variant="outline"
                  className="border-[#9BBEC8]/50 text-[#427D9D]"
                >
                  <Building2 className="mr-1 h-3 w-3" />
                  {user.businessName}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal information */}
      <Card className="rounded-2xl border border-[#9BBEC8]/40 bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#164863]">
            Personal Information
          </CardTitle>
          <CardDescription>
            Update the details shown on your WedPlan account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Full Name</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9BBEC8]" />
                <Input
                  id="profile-email"
                  value={user.email || ""}
                  disabled
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-[#427D9D]/70">
                Email changes require verification and are not available here.
              </p>
            </div>

            {isVendor && (
              <div className="space-y-2">
                <Label htmlFor="profile-business">Business Name</Label>
                <Input
                  id="profile-business"
                  value={businessName}
                  onChange={(event) => setBusinessName(event.target.value)}
                  placeholder="Enter your business name"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={savingProfile}
              className="flex items-center gap-2 bg-[#164863] text-[#DDF2FD] hover:bg-[#427D9D]"
            >
              <Save className="h-4 w-4" />
              {savingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card className="rounded-2xl border border-[#9BBEC8]/40 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-[#164863]">
            <KeyRound className="h-5 w-5 text-[#427D9D]" />
            Change Password
          </CardTitle>
          <CardDescription>
            Use at least 8 characters for your new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9BBEC8]" />
                <Input
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="Enter your current password"
                  autoComplete="current-password"
                  className="pr-10 pl-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#9BBEC8] hover:text-[#164863]"
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                >
                  {showCurrent ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9BBEC8]" />
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  className="pr-10 pl-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#9BBEC8] hover:text-[#164863]"
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9BBEC8]" />
                <Input
                  id="confirm-password"
                  type={showNew ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={savingPassword}
              className="flex items-center gap-2 bg-[#164863] text-[#DDF2FD] hover:bg-[#427D9D]"
            >
              <KeyRound className="h-4 w-4" />
              {savingPassword ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account actions */}
      <Card className="rounded-2xl border border-[#9BBEC8]/40 bg-white">
        <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-semibold text-[#164863]">Account Actions</h3>
            <p className="mt-1 text-sm text-[#427D9D]">
              Return to your dashboard or sign out of WedPlan.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={dashboardPath}>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-[#9BBEC8] text-[#164863]"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProfileSettingsView() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#9BBEC8] border-t-[#164863]" />
      </div>
    )
  }

  if (!session) {
    return (
      <Card className="mx-auto max-w-lg rounded-2xl border border-[#9BBEC8]/40 bg-white p-8 text-center">
        <UserRound className="mx-auto h-10 w-10 text-[#427D9D]" />
        <h1 className="mt-4 text-xl font-bold text-[#164863]">
          Sign in to view your profile
        </h1>
        <p className="mt-2 text-sm text-[#427D9D]">
          You need to be signed in to manage your account settings.
        </p>
        <Link href="/sign-in" className="mt-6 inline-block">
          <Button className="bg-[#164863] text-[#DDF2FD] hover:bg-[#427D9D]">
            Go to Sign In
          </Button>
        </Link>
      </Card>
    )
  }

  return (
    <ProfileForm key={session.user.id} user={session.user as ProfileUser} />
  )
}
