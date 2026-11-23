"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Menu,
  UserRound,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { authClient } from "@/lib/auth-client"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
]

function UserAvatar({
  name,
  image,
  className = "h-8 w-8",
}: {
  name?: string
  image?: string | null
  className?: string
}) {
  if (image) {
    return (
      <div
        className={`shrink-0 rounded-full border border-[#9BBEC8]/60 bg-cover bg-center ${className}`}
        style={{ backgroundImage: `url("${image}")` }}
        role="img"
        aria-label={`${name || "User"} profile image`}
      />
    )
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#164863] font-bold text-[#DDF2FD] ${className}`}
      aria-label={`${name || "User"} profile`}
    >
      {name?.trim()?.charAt(0)?.toUpperCase() || (
        <UserRound className="h-4 w-4" />
      )}
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  const { data: session, isPending } = authClient.useSession()

  const user = session?.user as
    | {
        name: string
        email: string
        role?: string
        image?: string | null
      }
    | undefined

  const dashboardPath =
    user?.role === "vendor"
      ? "/vendor/dashboard"
      : user?.role === "admin"
        ? "/admin/dashboard"
        : "/customer/dashboard"

  async function handleLogout() {
    await authClient.signOut()
    setProfileOpen(false)
    setOpen(false)
    router.push("/sign-in")
    router.refresh()
  }

  function renderAuthButtons(mobile = false) {
    return (
      <div
        className={
          mobile ? "flex flex-col gap-3" : "hidden items-center gap-2 md:flex"
        }
      >
        <Link href="/sign-in" onClick={() => setOpen(false)}>
          <Button
            variant="ghost"
            className="w-full rounded-full px-5 font-semibold text-[#164863] hover:bg-[#9BBEC8]/30"
          >
            Sign In
          </Button>
        </Link>

        <Link href="/sign-up" onClick={() => setOpen(false)}>
          <Button className="h-11 w-full rounded-full bg-[#164863] px-5 font-semibold text-[#DDF2FD] hover:bg-[#427D9D]">
            Sign Up
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full px-4 pt-4"
    >
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between rounded-2xl border border-[#9BBEC8]/40 bg-[#DDF2FD]/90 px-5 shadow-lg shadow-[#164863]/5 backdrop-blur-xl md:px-8">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.04 }}>
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/images/Wedplan-Logo.png"
              alt="WedPlan Logo"
              width={46}
              height={46}
              priority
              style={{
                width: "46px",
                height: "46px",
                objectFit: "contain",
              }}
            />

            <span className="text-2xl font-extrabold tracking-tight text-[#164863]">
              WedPlan<span className="text-[#427D9D]">.</span>
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 rounded-full border border-[#9BBEC8]/40 bg-white/60 p-1.5 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-full bg-[#164863]"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                <span
                  className={`relative z-10 ${
                    isActive ? "text-[#DDF2FD]" : "text-[#164863]"
                  }`}
                >
                  {link.name}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-[#9BBEC8]/40" />
          ) : user ? (
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border-[#9BBEC8] text-[#164863]"
              >
                <UserAvatar
                  name={user.name}
                  image={user.image}
                  className="h-7 w-7 text-xs"
                />
                <span className="max-w-28 truncate">{user.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {profileOpen && (
                <div className="absolute top-14 right-0 z-50 w-60 rounded-2xl border border-[#9BBEC8]/50 bg-[#DDF2FD] p-2 shadow-xl">
                  <div className="flex items-center gap-3 border-b border-[#9BBEC8]/50 px-3 py-3">
                    <UserAvatar
                      name={user.name}
                      image={user.image}
                      className="h-11 w-11 text-base"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#164863]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-[#427D9D]">
                        {user.email}
                      </p>
                      <span className="mt-1 inline-block rounded-full bg-[#9BBEC8]/40 px-3 py-1 text-xs font-medium text-[#164863] capitalize">
                        {user.role || "Customer"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={dashboardPath}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#164863] hover:bg-[#9BBEC8]/40"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  <Link
                    href="/profile-settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#164863] hover:bg-[#9BBEC8]/40"
                  >
                    <Settings className="h-4 w-4" />
                    Profile Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            renderAuthButtons()
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open navigation menu"
              className="rounded-xl border border-[#9BBEC8] p-2 text-[#164863] hover:bg-[#9BBEC8]/30"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] border-[#9BBEC8]/40 bg-[#DDF2FD] p-6"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-xl font-bold text-[#164863]">
                  <Image
                    src="/images/Wedplan-Logo.png"
                    alt="WedPlan Logo"
                    width={36}
                    height={36}
                    style={{
                      width: "36px",
                      height: "36px",
                      objectFit: "contain",
                    }}
                  />
                  WedPlan.
                </SheetTitle>
              </SheetHeader>

              <div className="mt-8 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-4 py-3 font-semibold ${
                      pathname === link.href
                        ? "bg-[#164863] text-[#DDF2FD]"
                        : "text-[#164863] hover:bg-[#9BBEC8]/40"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-8">
                {isPending ? (
                  <div className="h-10 animate-pulse rounded-xl bg-[#9BBEC8]/40" />
                ) : user ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 rounded-xl bg-white/60 p-4">
                      <UserAvatar
                        name={user.name}
                        image={user.image}
                        className="h-11 w-11 text-base"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-[#164863]">
                          {user.name}
                        </p>
                        <p className="mt-1 truncate text-xs text-[#427D9D]">
                          {user.email}
                        </p>
                        <p className="mt-1 text-xs text-[#427D9D] capitalize">
                          {user.role || "Customer"}
                        </p>
                      </div>
                    </div>

                    <Link href={dashboardPath} onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>

                    <Link
                      href="/profile-settings"
                      onClick={() => setOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                      </Button>
                    </Link>

                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  renderAuthButtons(true)
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  )
}
