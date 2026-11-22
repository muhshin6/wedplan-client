"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Heart,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  UserRound,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export default function SignUpPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const requirements = [
    { label: "At least 6 characters", valid: password.length >= 6 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
  ]

  const strength = requirements.filter((item) => item.valid).length

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setError("")
    setIsLoading(true)

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      })

      if (error) {
        setError(error.message || "Sign up failed.")
        return
      }

      router.push("/customer/dashboard")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#DDF2FD] p-4 md:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-[32px] bg-white shadow-2xl shadow-[#164863]/10 lg:grid-cols-2">
        {/* LEFT SIDE */}

        <section className="relative hidden overflow-hidden bg-[#164863] p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#427D9D]/40 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#9BBEC8]/20 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <Link href="/" className="items-center gap-3 flex">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                <Heart className="h-6 w-6 fill-[#DDF2FD] text-[#DDF2FD]" />
              </div>

              <span className="text-3xl font-extrabold tracking-tight text-white">
                WedPlan<span className="text-[#9BBEC8]">.</span>
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10"
          >
            <h1 className="max-w-lg text-5xl leading-tight font-extrabold tracking-tight text-white">
              Let&apos;s Make Your Dream Wedding Happen.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-[#DDF2FD]/75">
              Join WedPlan and discover everything you need to create
              unforgettable wedding memories.
            </p>

            <div className="mt-12 max-w-sm rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#9BBEC8]/20">
                  <Heart className="h-6 w-6 text-[#DDF2FD]" />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    Everything in one place
                  </p>

                  <p className="mt-1 text-sm text-[#DDF2FD]/70">
                    Plan smarter. Celebrate beautifully.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <p className="relative z-10 text-sm text-[#DDF2FD]/60">
            © {new Date().getFullYear()} WedPlan. Made for your special day.
          </p>
        </section>

        {/* RIGHT SIDE */}

        <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-md"
          >
            {/* Mobile Brand */}

            <Link href="/" className="mb-10 flex items-center gap-2 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#164863]">
                <Heart className="h-5 w-5 fill-white text-white" />
              </div>

              <span className="text-2xl font-extrabold text-[#164863]">
                WedPlan.
              </span>
            </Link>

            {/* Heading */}

            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#DDF2FD] px-4 py-2 text-xs font-bold tracking-wider text-[#164863] uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                Get Started
              </span>

              <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-[#164863]">
                Create your account
              </h2>

              <p className="mt-3 leading-7 text-gray-500">
                Start your wedding planning journey with WedPlan. It only takes
                a minute.
              </p>
            </div>

            {/* Form */}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#164863]"
                >
                  Full Name
                </label>

                <div className="relative">
                  <UserRound className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#427D9D]" />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className="h-14 w-full rounded-xl border border-[#9BBEC8]/60 bg-[#DDF2FD]/30 pr-4 pl-12 text-sm text-[#164863] transition-all outline-none placeholder:text-gray-400 focus:border-[#164863] focus:bg-white focus:ring-4 focus:ring-[#164863]/10"
                  />
                </div>
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#164863]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#427D9D]" />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="h-14 w-full rounded-xl border border-[#9BBEC8]/60 bg-[#DDF2FD]/30 pr-4 pl-12 text-sm text-[#164863] transition-all outline-none placeholder:text-gray-400 focus:border-[#164863] focus:bg-white focus:ring-4 focus:ring-[#164863]/10"
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#164863]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#427D9D]" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    className="h-14 w-full rounded-xl border border-[#9BBEC8]/60 bg-[#DDF2FD]/30 pr-12 pl-12 text-sm text-[#164863] transition-all outline-none placeholder:text-gray-400 focus:border-[#164863] focus:bg-white focus:ring-4 focus:ring-[#164863]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-[#427D9D] transition-colors hover:text-[#164863]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength */}

                {password.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            strength >= item
                              ? "bg-[#427D9D]"
                              : "bg-[#9BBEC8]/30"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="space-y-1">
                      {requirements.map((item) => (
                        <p
                          key={item.label}
                          className={`flex items-center gap-2 text-xs ${
                            item.valid ? "text-[#164863]" : "text-gray-400"
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {item.label}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Error */}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit */}

              <Button
                type="submit"
                disabled={isLoading}
                className="group h-14 w-full rounded-xl bg-[#164863] text-base font-bold text-white shadow-lg shadow-[#164863]/15 transition-all hover:bg-[#427D9D] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  "Creating account..."
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Account
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </form>

            {/* Sign In */}

            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-bold text-[#164863] transition-colors hover:text-[#427D9D]"
              >
                Sign In
              </Link>
            </p>

            {/* Footer */}

            <div className="mt-10 border-t border-[#9BBEC8]/30 pt-6 text-center">
              <Link
                href="/"
                className="text-sm font-medium text-[#427D9D] transition-colors hover:text-[#164863]"
              >
                ← Back to Home
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  )
}
