"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Compass, Sparkles } from "lucide-react"

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
}

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#DDF2FD]/40 px-4 dark:bg-[#0B1922]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg rounded-2xl border border-[#9BBEC8]/40 bg-white p-8 text-center shadow-xl shadow-[#164863]/5 sm:p-10 dark:bg-[#122B3A]"
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ rotate: 12, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#DDF2FD] text-[#427D9D]"
        >
          <Compass className="h-10 w-10" />
        </motion.div>

        <motion.div variants={itemVariants}>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#DDF2FD]/70 px-4 py-2 text-xs font-bold tracking-wider text-[#427D9D] uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Lost in the details
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mt-5 text-4xl font-extrabold text-[#164863] dark:text-[#DDF2FD]"
        >
          404
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-2 text-lg font-semibold text-[#164863] dark:text-[#DDF2FD]"
        >
          This page could not be found
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="mt-3 text-sm leading-6 text-[#427D9D]"
        >
          The address may be outdated, or the page may have moved. Let&apos;s
          get you back on track.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#164863] px-5 py-3 text-sm font-semibold text-[#DDF2FD] transition hover:bg-[#427D9D]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9BBEC8] px-5 py-3 text-sm font-semibold text-[#164863] transition hover:bg-[#DDF2FD]/50 dark:text-[#DDF2FD]"
            >
              Browse Services
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  )
}
