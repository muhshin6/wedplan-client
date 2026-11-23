"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle dark and light theme"
      title="Toggle theme"
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#9BBEC8]/50 text-[#164863] transition-colors hover:bg-[#DDF2FD]/60 dark:border-white/20 dark:text-[#DDF2FD] dark:hover:bg-white/10 ${className}`}
    >
      {/* CSS handles theme visibility — no client state/hydration mismatch */}
      <Moon className="h-4 w-4 dark:hidden" />
      <Sun className="hidden h-4 w-4 dark:block" />
    </button>
  )
}
