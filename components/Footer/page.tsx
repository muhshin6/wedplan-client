"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone } from "lucide-react"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
  { name: "Sign In", href: "/sign-in" },
  { name: "Sign Up", href: "/sign-up" },
]

const contactInfo = [
  {
    icon: Mail,
    label: "muhshin666@gmail.com",
    href: "mailto:muhshin666@gmail.com",
  },
  {
    icon: Phone,
    label: "+8801700545585",
    href: "phone:+8801700545585",
  },
  {
    icon: MapPin,
    label: "Bangladesh",
    href: "https://www.google.com/maps/place/%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE%E0%A6%A6%E0%A7%87%E0%A6%B6/@23.4843972,87.7035209,7z/data=!3m1!4b1!4m6!3m5!1s0x30adaaed80e18ba7:0xf2d28e0c4e1fc6b!8m2!3d23.684994!4d90.356331!16zL20vMDE2MmI?entry=ttu&g_ep=EgoyMDI2MTExOC4xIKXMDSoASAFQAw%3D%3D",
  },
]

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/muhshin6",
    d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/muhshin-reza-b2a083427/",
    d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 25,
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

function SocialIcon({
  name,
  href,
  d,
}: {
  name: string
  href: string
  d: string
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      whileHover={{ scale: 1.1, y: -3 }}
      whileTap={{ scale: 0.95 }}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-[#9BBEC8]/40 text-[#DDF2FD] transition-colors duration-300 hover:bg-[#9BBEC8] hover:text-[#164863] dark:text-[#DDF2FD]"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
        <path d={d} />
      </svg>
    </motion.a>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-[#164863] text-[#DDF2FD]">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#427D9D]/40 blur-[100px]" />

      <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-[#9BBEC8]/15 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-8 md:px-10 lg:px-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/Wedplan-Logo.png"
                alt="WedPlan Logo"
                width={42}
                height={42}
                style={{
                  width: "42px",
                  height: "42px",
                  objectFit: "contain",
                }}
              />

              <span className="text-2xl font-extrabold tracking-tight text-white">
                WedPlan<span className="text-[#9BBEC8]">.</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-[#DDF2FD]/70">
              WedPlan connects couples with trusted wedding professionals —
              venues, photographers, caterers and more — all in one place to
              bring your dream celebration to life.
            </p>
          </motion.div>

          {/* Navigation Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xs font-semibold tracking-[0.18em] text-[#9BBEC8] uppercase">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#DDF2FD]/75 transition-colors duration-300 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xs font-semibold tracking-[0.18em] text-[#9BBEC8] uppercase">
              Contact Us
            </h3>

            <ul className="mt-5 space-y-4">
              {contactInfo.map((contact) => {
                const Icon = contact.icon

                return (
                  <li key={contact.label}>
                    <a
                      href={contact.href}
                      target={
                        contact.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        contact.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="flex items-start gap-3 text-sm text-[#DDF2FD]/75 transition-colors duration-300 hover:text-white"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DDF2FD]/10 text-[#9BBEC8]">
                        <Icon className="h-4 w-4" strokeWidth={1.8} />
                      </span>

                      <span className="leading-6">{contact.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </motion.div>

          {/* Social Media Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xs font-semibold tracking-[0.18em] text-[#9BBEC8] uppercase">
              Follow Us
            </h3>

            <p className="mt-5 max-w-xs text-sm leading-6 text-[#DDF2FD]/70">
              Behind-the-scenes moments, real weddings and planning tips — join
              us on social media.
            </p>

            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((social) => (
                <SocialIcon key={social.name} {...social} />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-[#9BBEC8]/20 pt-6 text-xs text-[#DDF2FD]/60 sm:text-sm md:flex-row"
        >
          <p>© {year} WedPlan. All rights reserved.</p>

          <p className="text-[#9BBEC8]/80">Where forever begins.</p>
        </motion.div>
      </div>
    </footer>
  )
}
