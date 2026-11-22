"use client"

import { motion } from "framer-motion"
import { CalendarCheck, GitCompare, PartyPopper, Search } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Browse Services",
    description:
      "Explore approved wedding services by category — venues, photography, catering and more.",
  },
  {
    number: "02",
    icon: GitCompare,
    title: "Compare & Connect",
    description:
      "Compare prices, portfolios and vendor details to shortlist your favourites.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Book with Confidence",
    description:
      "Send a booking request and confirm your date directly with the vendor.",
  },
  {
    number: "04",
    icon: PartyPopper,
    title: "Celebrate Your Day",
    description:
      "Relax and enjoy your perfect celebration while WedPlan takes care of the details.",
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

const stepVariants = {
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

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[#DDF2FD]/50 px-6 py-24 md:px-10 lg:px-16">
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
            <PartyPopper className="h-3.5 w-3.5" />
            Simple & Stress-Free
          </span>

          <h2 className="max-w-3xl text-3xl leading-tight font-bold tracking-tight text-[#164863] sm:text-4xl md:text-5xl">
            How WedPlan
            <span className="mt-2 block text-[#427D9D]">Works</span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#164863]/70 md:text-lg">
            Four simple steps from dreaming about your big day to celebrating
            it.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step) => {
            const Icon = step.icon

            return (
              <motion.div
                key={step.number}
                variants={stepVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.25 },
                }}
                className="group relative overflow-hidden rounded-2xl border border-[#9BBEC8]/40 bg-white/80 p-7 shadow-[0_8px_30px_rgba(22,72,99,0.04)] backdrop-blur-xl transition-all duration-300 hover:border-[#427D9D]/50 hover:bg-white hover:shadow-[0_20px_50px_rgba(22,72,99,0.12)]"
              >
                {/* Icon */}
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DDF2FD] text-[#164863] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#164863] group-hover:text-white">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </div>

                {/* Content */}
                <div className="relative mt-6">
                  <span className="text-xs font-semibold tracking-[0.18em] text-[#427D9D] uppercase">
                    Step {step.number}
                  </span>

                  <h3 className="mt-2 text-lg font-bold tracking-tight text-[#164863] transition-colors group-hover:text-[#427D9D]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#164863]/65">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
