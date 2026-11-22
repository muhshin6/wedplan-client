"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Search,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Store,
} from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface User {
  _id?: string
  id?: string
  name: string
  email: string
  role: "customer" | "vendor" | "admin"
  image?: string
  createdAt?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

 const fetchUsers = async () => {
   try {
     const response = await fetch("http://localhost:5000/api/admin/users", {
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

 const handleRefresh = async () => {
   setLoading(true)
   await fetchUsers()
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

    return (
      user.name?.toLowerCase().includes(searchValue) ||
      user.email?.toLowerCase().includes(searchValue) ||
      user.role?.toLowerCase().includes(searchValue)
    )
  })

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700"

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
          <p className="mb-2 text-sm font-medium text-[#427D9D]">
            ADMINISTRATION
          </p>

          <h1 className="text-2xl font-bold text-[#164863] sm:text-3xl">
            Manage Users
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View and monitor customer, vendor and admin accounts.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9BBEC8] bg-white px-4 py-3 text-sm font-semibold text-[#164863] transition hover:bg-[#DDF2FD] disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
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
                            <Image
                              src={user.image}
                              alt={user.name}
                              fill
                              sizes="40px"
                              className="object-cover"
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
    </div>
  )
}
