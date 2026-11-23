"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, MapPin } from "lucide-react"
import ServiceDetailsLink from "@/components/auth/service-details-link"

export interface FeaturedService {
  _id: string
  name: string
  category: string
  description: string
  location: string
  price: number
  images: string[]
  vendorId?: string | { name?: string; businessName?: string }
  vendor?: { name?: string; businessName?: string }
  status?: string
  isActive?: boolean
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
}

export default function FeaturedServicesView({
  services,
}: {
  services: FeaturedService[]
}) {
  return (
    <section className="bg-[#DDF2FD] px-6 py-20 md:px-10 lg:px-16 dark:bg-[#0B1922] dark:bg-[#122B3A]/50">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div>
            <span className="mb-3 inline-block text-sm font-semibold tracking-[0.2em] text-[#427D9D] uppercase">
              Discover Our Services
            </span>

            <h2 className="text-3xl font-bold text-[#164863] md:text-4xl dark:text-[#DDF2FD]">
              Featured Wedding Services
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-gray-600 dark:text-[#9BBEC8]">
              Find the perfect wedding professionals to make your special day
              unforgettable.
            </p>
          </div>

          <Link
            href="/services"
            className="group inline-flex items-center gap-2 font-semibold text-[#164863] transition-colors hover:text-[#427D9D] dark:text-[#DDF2FD]"
          >
            View All Services
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service) => {
              const image = service.images?.[0]

              const vendor =
                service.vendor ||
                (typeof service.vendorId === "object"
                  ? service.vendorId
                  : undefined)

              return (
                <motion.div
                  key={service._id}
                  variants={cardVariants}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.25 },
                  }}
                  className="group overflow-hidden rounded-2xl border border-[#9BBEC8]/40 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl dark:bg-[#122B3A]"
                >
                  {/* Service Image */}
                  <div className="relative h-56 overflow-hidden bg-[#DDF2FD] dark:bg-[#122B3A]">
                    {image ? (
                      <Image
                        src={image}
                        alt={service.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#427D9D]">
                        No Image Available
                      </div>
                    )}

                    {/* Category Badge */}
                    <Link
                      href={
                        ["photography", "videography"].includes(
                          service.category?.toLowerCase().trim()
                        )
                          ? "/services?category=Photography%2CVideography"
                          : `/services?category=${encodeURIComponent(service.category)}`
                      }
                      className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#164863] backdrop-blur transition-colors hover:bg-[#164863] hover:text-white dark:text-[#DDF2FD]"
                    >
                      {service.category}
                    </Link>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <h3 className="line-clamp-1 text-xl font-bold text-[#164863] dark:text-[#DDF2FD]">
                      {service.name}
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-[#9BBEC8]">
                      <MapPin className="h-4 w-4 text-[#427D9D]" />
                      <span className="line-clamp-1">
                        {service.location || "Location not specified"}
                      </span>
                    </div>

                    {/* Vendor Information */}
                    <div className="mt-4 flex items-center justify-between border-t border-[#9BBEC8]/30 pt-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-[#9BBEC8]">
                          Service Provider
                        </p>
                        <p className="mt-1 font-medium text-[#164863] dark:text-[#DDF2FD]">
                          {vendor?.name ||
                            vendor?.businessName ||
                            "Wedding Vendor"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-[#9BBEC8]">
                          Starting from
                        </p>
                        <p className="mt-1 text-lg font-bold text-[#164863] dark:text-[#DDF2FD]">
                          ৳{Number(service.price).toLocaleString("en-BD")}
                        </p>
                      </div>
                    </div>

                    <ServiceDetailsLink
                      href={`/services/${service._id}`}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#164863] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#427D9D]"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </ServiceDetailsLink>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-[#9BBEC8]/40 bg-white px-6 py-16 text-center dark:bg-[#122B3A]"
          >
            <h3 className="text-xl font-semibold text-[#164863] dark:text-[#DDF2FD]">
              No Featured Services Yet
            </h3>
            <p className="mt-3 text-gray-500 dark:text-[#9BBEC8]">
              Approved wedding services will appear here soon.
            </p>
          </motion.div>
        )}

        
      </div>
    </section>
  )
}
