"use client"

import { motion } from "framer-motion"
import { BadgeCheck, Headphones, LayoutGrid, Wallet } from "lucide-react"

const benefits = [
  {
    icon: BadgeCheck,
    title: "Verified & Trusted Vendors",
    description:
      "Every vendor is reviewed and approved by our team, so you can book with complete confidence.",
  },
  {
    icon: LayoutGrid,
    title: "Everything in One Place",
    description:
      "From venues to makeup artists — compare services across every category without hopping between sites.",
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    description:
      "See clear starting prices up front and find options that fit your budget, with no hidden surprises.",
  },
  {
    icon: Headphones,
    title: "Friendly Support",
    description:
      "Our wedding specialists are here to help you plan, compare and book — every step of the way.",
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
}

export default function WhyChooseWedPlan() {
  return (
    <section className="relative overflow-hidden bg-[#DDF2FD] px-6 py-24 md:px-10 lg:px-16 dark:bg-[#0B1922] dark:bg-[#122B3A]/50">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#427D9D]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mb-14 flex flex-col items-center text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#9BBEC8]/50 bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#427D9D] uppercase backdrop-blur-md">
            <BadgeCheck className="h-3.5 w-3.5" />
            Why WedPlan
          </span>

          <h2 className="max-w-3xl text-3xl leading-tight font-bold tracking-tight text-[#164863] sm:text-4xl md:text-5xl dark:text-[#DDF2FD]">
            Why Choose
            <span className="mt-2 block text-[#427D9D]">WedPlan?</span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#164863] md:text-lg dark:text-[#9BBEC8] dark:text-[#DDF2FD]/70">
            Planning a wedding should feel exciting, not overwhelming. WedPlan
            brings everything you need together so you can focus on what matters
            most.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <motion.div
                key={benefit.title}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.25 },
                }}
                className="group relative flex flex-col rounded-2xl border border-[#9BBEC8]/40 bg-white/80 p-7 shadow-[0_8px_30px_rgba(22,72,99,0.04)] backdrop-blur-xl transition-all duration-300 hover:border-[#427D9D]/50 hover:bg-white hover:shadow-[0_20px_50px_rgba(22,72,99,0.12)] dark:bg-[#122B3A]/80"
              >
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#164863] text-[#DDF2FD] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#427D9D]">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </div>

                {/* Content */}
                <h3 className="mt-6 text-lg font-bold tracking-tight text-[#164863] transition-colors group-hover:text-[#427D9D] dark:text-[#DDF2FD]">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#164863] dark:text-[#9BBEC8] dark:text-[#DDF2FD]/65">
                  {benefit.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
