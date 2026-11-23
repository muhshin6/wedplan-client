"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { API_URL } from "@/lib/api"
import {
  Users,
  Search,
  ShieldCheck,
  UserRound,
  Store,
  Eye,
  X,
  CalendarDays,
  Ban,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface User {
  _id?: string
  id?: string
  name: string
  email: string
  role: "customer" | "vendor"
  image?: string
  isBlocked?: boolean
  createdAt?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | "customer" | "vendor">(
    "all"
  )
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        credentials: "include",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch users")
      }

      setUsers(result.data)
    } catch (error) {
      console.error("Fetch Users Error:", error)

      toast.error(
        error instanceof Error ? error.message : "Failed to fetch users"
      )
    } finally {
      setLoading(false)
    }
  }

  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleToggleBlock = async (user: User) => {
    const id = user._id || user.id

    if (!id) return

    setUpdatingId(id)

    try {
      const response = await fetch(`${API_URL}/api/admin/users/${id}/block`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !user.isBlocked }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to update user status")
      }

      toast.success(
        user.isBlocked
          ? "User unblocked successfully"
          : "User blocked successfully"
      )

      await fetchUsers()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user status"
      )
    } finally {
      setUpdatingId(null)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchUsers()
    }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase()

    const matchesSearch =
      user.name?.toLowerCase().includes(searchValue) ||
      user.email?.toLowerCase().includes(searchValue) ||
      user.role?.toLowerCase().includes(searchValue)

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "vendor":
        return "bg-blue-100 text-blue-700"

      default:
        return "bg-emerald-100 text-emerald-700"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldCheck size={14} />

      case "vendor":
        return <Store size={14} />

      default:
        return <UserRound size={14} />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="flex items-center text-sm font-medium text-gray-500"
          >
            <ArrowLeft className="h-4 w-5" />
            Home
          </Link>

          <h1 className="mt-4 text-2xl font-bold text-[#164863] sm:text-3xl">
            Manage Users
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View and monitor customer, vendor and admin accounts.
          </p>
        </div>
      </div>

      {/* Total Users */}
      <div className="flex items-center gap-4 rounded-2xl border border-[#9BBEC8]/40 bg-white p-5 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DDF2FD] text-[#164863]">
          <Users size={24} />
        </div>

        <div>
          <p className="text-sm text-gray-500">Total Users</p>

          <h2 className="text-2xl font-bold text-[#164863]">{users.length}</h2>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email or role..."
          className="w-full rounded-xl border border-[#9BBEC8]/50 bg-white py-3 pr-4 pl-11 text-sm text-[#164863] transition outline-none placeholder:text-gray-400 focus:border-[#427D9D] focus:ring-2 focus:ring-[#427D9D]/10"
        />
      </div>

      {/* Role filter */}
      <div className="flex flex-wrap gap-2">
        {(["all", "customer", "vendor"] as const).map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition-all ${
              roleFilter === role
                ? "bg-[#164863] text-white shadow-md shadow-[#164863]/15"
                : "border border-[#9BBEC8]/50 bg-white text-[#427D9D] hover:bg-[#DDF2FD]/50"
            }`}
          >
            {role === "all" ? "All Roles" : role}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-[#9BBEC8]/40 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-14 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Users size={44} className="mx-auto mb-4 text-[#9BBEC8]" />

            <h3 className="text-lg font-bold text-[#164863]">No Users Found</h3>

            <p className="mt-2 text-sm text-gray-500">
              {search
                ? "Try searching with another name or email."
                : "No registered users are available yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-162.5 text-left">
              <thead className="bg-[#F4F8FB]">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Email
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Role
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user._id || user.id || user.email}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="transition hover:bg-[#F8FBFD]"
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#DDF2FD] font-semibold text-[#164863]">
                          {user.image ? (
                            <div
                              className="absolute inset-0 bg-cover bg-center"
                              style={{
                                backgroundImage: `url("${user.image}")`,
                              }}
                              role="img"
                              aria-label={user.name}
                            />
                          ) : (
                            user.name?.charAt(0).toUpperCase() || "U"
                          )}
                        </div>

                        <span className="text-sm font-semibold whitespace-nowrap text-[#164863]">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getRoleStyle(user.role)}`}
                      >
                        {getRoleIcon(user.role)}
                        {user.role}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#9BBEC8]/50 px-3 py-1.5 text-xs font-semibold text-[#164863] transition hover:bg-[#DDF2FD]/50"
                        >
                          <Eye size={14} />
                          View
                        </button>

                        <button
                          onClick={() => void handleToggleBlock(user)}
                          disabled={updatingId === (user._id || user.id)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                            user.isBlocked
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                        >
                          {updatingId === (user._id || user.id)
                            ? "Updating..."
                            : user.isBlocked
                              ? "Unblock"
                              : "Block"}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && users.length > 0 && (
        <p className="text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#082B3D]/60 px-4 py-8 backdrop-blur-sm"
          onClick={() => setSelectedUser(null)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-[#164863] transition hover:bg-[#DDF2FD]"
              aria-label="Close user details"
            >
              <X size={18} />
            </button>

            <div className="bg-linear-to-br from-[#164863] to-[#427D9D] px-6 py-8 text-white">
              <div className="flex items-center gap-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/40 bg-white/15 text-xl font-bold">
                  {selectedUser.image ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url("${selectedUser.image}")`,
                      }}
                      role="img"
                      aria-label={selectedUser.name}
                    />
                  ) : (
                    selectedUser.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold">
                    {selectedUser.name}
                  </h2>
                  <p className="truncate text-sm text-[#DDF2FD]/80">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between rounded-xl bg-[#F4F8FB] px-4 py-3">
                <span className="text-sm text-gray-500">Account Role</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getRoleStyle(selectedUser.role)}`}
                >
                  {getRoleIcon(selectedUser.role)}
                  {selectedUser.role}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#F4F8FB] px-4 py-3">
                <span className="text-sm text-gray-500">Account Status</span>
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                    selectedUser.isBlocked ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  {selectedUser.isBlocked ? (
                    <Ban size={15} />
                  ) : (
                    <CheckCircle2 size={15} />
                  )}
                  {selectedUser.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#F4F8FB] px-4 py-3">
                <span className="text-sm text-gray-500">Joined</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#164863]">
                  <CalendarDays size={15} />
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>

              <div className="rounded-xl bg-[#F4F8FB] px-4 py-3">
                <p className="text-sm text-gray-500">User ID</p>
                <p className="mt-1 font-mono text-xs break-all text-[#164863]">
                  {selectedUser._id || selectedUser.id || "—"}
                </p>
              </div>

              <button
                onClick={() => {
                  void handleToggleBlock(selectedUser)
                  setSelectedUser(null)
                }}
                className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
                  selectedUser.isBlocked
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {selectedUser.isBlocked ? "Unblock User" : "Block User"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
