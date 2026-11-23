"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Camera,
  Building2,
  Flower2,
  Utensils,
  Sparkles,
  Shirt,
  ArrowUpRight,
} from "lucide-react"

const categories = [
  {
    title: "Photography & Videography",
    description: "Capture every beautiful moment of your special day.",
    category: "Photography",
    icon: Camera,
    number: "01",
  },
  {
    title: "Wedding Venues",
    description: "Discover beautiful venues for your dream celebration.",
    category: "Venue",
    icon: Building2,
    number: "02",
  },
  {
    title: "Decoration & Florist",
    description: "Transform your wedding into a magical experience.",
    category: "Decoration",
    icon: Flower2,
    number: "03",
  },
  {
    title: "Catering Services",
    description: "Make your celebration memorable with delicious food.",
    category: "Catering",
    icon: Utensils,
    number: "04",
  },
  {
    title: "Makeup & Styling",
    description: "Feel confident and beautiful on your special day.",
    category: "Makeup",
    icon: Sparkles,
    number: "05",
  },
  {
    title: "Wedding Fashion",
    description: "Find the perfect outfit for your wedding celebration.",
    category: "Fashion",
    icon: Shirt,
    number: "06",
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

export default function ServiceCategories() {
  return (
    <section className="relative overflow-hidden bg-[#DDF2FD] px-6 py-24 md:px-10 lg:px-16 dark:bg-[#0B1922] dark:bg-[#122B3A]/50">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#427D9D]/10 blur-[100px]" />

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
            <Sparkles className="h-3.5 w-3.5" />
            Explore Categories
          </span>

          <h2 className="max-w-3xl text-3xl leading-tight font-bold tracking-tight text-[#164863] sm:text-4xl md:text-5xl dark:text-[#DDF2FD]">
            Everything You Need
            <span className="mt-2 block text-[#427D9D]">
              For Your Perfect Wedding
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#164863] md:text-lg dark:text-[#9BBEC8] dark:text-[#DDF2FD]/70">
            From beautiful venues to unforgettable moments, discover trusted
            wedding professionals who bring your dream celebration to life.
          </p>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((category) => {
            const Icon = category.icon

            return (
              <motion.div
                key={category.title}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.25 },
                }}
              >
                <Link
                  href={`/services?category=${encodeURIComponent(category.category)}`}
                  className="group relative flex h-full min-h-[245px] flex-col overflow-hidden rounded-2xl border border-[#9BBEC8]/40 bg-white/80 p-7 shadow-[0_8px_30px_rgba(22,72,99,0.04)] backdrop-blur-xl transition-all duration-300 hover:border-[#427D9D]/50 hover:bg-white hover:shadow-[0_20px_50px_rgba(22,72,99,0.12)] dark:bg-[#122B3A]/80"
                >
                  {/* Hover Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#DDF2FD]/0 via-[#DDF2FD]/0 to-[#9BBEC8]/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative flex items-start justify-between">
                    {/* Icon */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DDF2FD] text-[#164863] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#164863] group-hover:text-white dark:bg-[#122B3A] dark:text-[#DDF2FD]">
                      <Icon className="h-6 w-6" strokeWidth={1.8} />
                    </div>

                    {/* Number */}
                    <span className="text-sm font-medium tracking-widest text-[#9BBEC8] transition-colors group-hover:text-[#427D9D]">
                      {category.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative mt-7">
                    <h3 className="text-xl font-bold tracking-tight text-[#164863] transition-colors group-hover:text-[#427D9D] dark:text-[#DDF2FD]">
                      {category.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#164863] dark:text-[#9BBEC8] dark:text-[#DDF2FD]/65">
                      {category.description}
                    </p>
                  </div>

                  {/* Bottom Action */}
                  <div className="relative mt-auto flex items-center justify-between pt-6">
                    <span className="text-sm font-semibold text-[#427D9D]">
                      Explore Services
                    </span>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#9BBEC8]/50 text-[#164863] transition-all duration-300 group-hover:border-[#164863] group-hover:bg-[#164863] group-hover:text-white dark:text-[#DDF2FD]">
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-[#164863] dark:text-[#9BBEC8] dark:text-[#DDF2FD]/60">
            Your dream wedding starts with the right people.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
