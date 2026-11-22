"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"

export default function AuthTestPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const { data: session, isPending } = authClient.useSession()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await authClient.signIn.email({
      email,
      password,
    })

    if (error) {
      setMessage(error.message ?? "Login failed")
      return
    }

    setMessage("Login Successful!")
  }

  if (isPending) {
    return <p>Checking session...</p>
  }

  if (session) {
    return (
      <div className="space-y-3 p-10">
        <h1 className="text-2xl font-bold">Authentication Successful!</h1>

        <p>Name: {session.user.name}</p>
        <p>Email: {session.user.email}</p>

        <button
          onClick={async () => {
            await authClient.signOut()
          }}
          className="rounded bg-red-600 px-5 py-2 text-white"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-20 max-w-md space-y-5">
      <h1 className="text-2xl font-bold">WedPlan Login Test</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border p-3"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border p-3"
          required
        />

        <button
          type="submit"
          className="w-full rounded bg-black p-3 text-white"
        >
          Sign In
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  )
}
