"use client"

import { useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Heart,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function SignInPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    setError("")

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard`,
      })

      if (result.error) {
        setError(
          result.error.message ||
            "Google sign-in is not available. Please try again later."
        )
      }
    } catch {
      setError("Google sign-in is not available. Please try again later.")
    } finally {
      setGoogleLoading(false)
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setError("")
    setIsLoading(true)

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      })

      if (error) {
        setError(error.message || "Sign in failed.")
        return
      }

      // Refresh the shared session so the Navbar updates immediately
      await authClient.getSession()

      toast.success("Signed in successfully!")

      const user = data.user as typeof data.user & {
        role?: string
      }

      if (user.role === "vendor") {
        router.push("/vendor/dashboard")
      } else {
        router.push("/customer/dashboard")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#DDF2FD] p-4 md:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-[32px] bg-white shadow-2xl shadow-[#164863]/10 lg:grid-cols-2">
        {/* LEFT SIDE - VISUAL */}

        <section className="relative hidden overflow-hidden bg-[#164863] p-12 lg:flex lg:flex-col lg:justify-between">
          {/* Background Decoration */}

          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#427D9D]/40 blur-3xl" />

          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#9BBEC8]/20 blur-3xl" />

          {/* Brand */}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                <Heart className="h-6 w-6 fill-[#DDF2FD] text-[#DDF2FD]" />
              </div>

              <span className="text-3xl font-extrabold tracking-tight text-white">
                WedPlan<span className="text-[#9BBEC8]">.</span>
              </span>
            </Link>
          </motion.div>

          {/* Center Content */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10"
          >
            <h1 className="max-w-lg text-5xl leading-tight font-extrabold tracking-tight text-white">
              Your Dream Wedding Starts Here.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-[#DDF2FD]/75">
              Discover trusted wedding vendors, explore beautiful services, and
              plan your perfect day with WedPlan.
            </p>

            {/* Decorative Card */}

            <div className="mt-12 max-w-sm rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#9BBEC8]/20">
                  <ShieldCheck className="h-6 w-6 text-[#DDF2FD]" />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    Your journey, our priority
                  </p>

                  <p className="mt-1 text-sm text-[#DDF2FD]/70">
                    One place for every wedding detail.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer */}

          <p className="relative z-10 text-sm text-[#DDF2FD]/60">
            © {new Date().getFullYear()} WedPlan. Made for your special day.
          </p>
        </section>

        {/* RIGHT SIDE - LOGIN FORM */}

        <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-md"
          >
            {/* Mobile Brand */}

            <Link
              href="/"
              className="mb-12 flex items-center justify-center gap-2 lg:hidden"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#164863]">
                <Heart className="h-5 w-5 fill-white text-white" />
              </div>

              <span className="text-2xl font-extrabold text-[#164863]">
                WedPlan.
              </span>
            </Link>

            {/* Heading */}

            <div className="mb-9">
              <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-[#164863]">
                Sign in to your account
              </h2>

              <p className="mt-3 leading-7 text-gray-500">
                Welcome back! Please enter your details to continue your wedding
                planning journey.
              </p>
            </div>

            {/* Form */}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-[#164863]"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <LockKeyhole className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#427D9D]" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
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
              </div>

              {/* Error Message */}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}

              <Button
                type="submit"
                disabled={isLoading}
                className="group h-14 w-full rounded-xl bg-[#164863] text-base font-bold text-white shadow-lg shadow-[#164863]/15 transition-all hover:bg-[#427D9D] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-[#9BBEC8]/40" />
                <span className="text-xs text-gray-400">or</span>
                <div className="h-px flex-1 bg-[#9BBEC8]/40" />
              </div>

              {/* Google Authentication */}
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleGoogleSignIn()}
                disabled={googleLoading || isLoading}
                className="h-14 w-full rounded-xl border-[#9BBEC8]/60 text-sm font-semibold text-[#164863] hover:bg-[#DDF2FD]/40"
              >
                {googleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59A14.4 14.4 0 0 1 9.77 24c0-1.6.27-3.15.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.73-6c-2.15 1.45-4.92 2.32-8.16 2.32-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>
            </form>

            {/* Sign Up Link */}

            <p className="mt-8 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="font-bold text-[#164863] transition-colors hover:text-[#427D9D]"
              >
                Create an account
              </Link>
            </p>

            {/* Footer */}

            <div className="mt-12 border-t border-[#9BBEC8]/30 pt-6 text-center">
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
