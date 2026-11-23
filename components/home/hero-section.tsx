"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Heart } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#164863]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co.com/m5wq7mvz/Yd1e-KBOfn-Q7vbc-BZ70-Jc7-Bpb-LJXJBGOWiyh98l-Fo-YM-1l-I1c704p-TGb6-PHnp-De6-P4dt-Na9-ccp-Xhu-Yjo-A14y-RW.jpg')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#164863]/95 via-[#164863]/80 to-[#164863]/30" />

      {/* Decorative Elements */}
      <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#9BBEC8]/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-6 py-24 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-[#DDF2FD] backdrop-blur-md">
            <Heart className="h-4 w-4 fill-[#9BBEC8] text-[#9BBEC8]" />

            <span>Your Dream Wedding Starts Here</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Plan Your Perfect Wedding,
            <span className="mt-2 block text-[#9BBEC8]">Beautifully.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#DDF2FD]/90 sm:text-lg">
            Discover trusted wedding vendors, explore stunning venues, and bring
            your dream wedding to life with WedPlan.
          </p>

          {/* CTA Button */}
          <div className="mt-10">
            <Link
              href="/services"
              className="group inline-flex items-center gap-3 rounded-full bg-[#DDF2FD] px-7 py-4 text-sm font-semibold text-[#164863] transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-[#164863]/30 dark:bg-[#122B3A] dark:text-[#DDF2FD]"
            >
              Explore Wedding Services
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Bottom Text */}
          <div className="mt-12 flex items-center gap-3 text-sm text-[#DDF2FD]/80">
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-full border-2 border-[#164863] bg-[#9BBEC8]" />
              <div className="h-8 w-8 rounded-full border-2 border-[#164863] bg-[#427D9D]" />
              <div className="h-8 w-8 rounded-full border-2 border-[#164863] bg-[#DDF2FD] dark:bg-[#122B3A]" />
            </div>

            <span>Discover your perfect wedding vendors</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
