import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MapPin } from "lucide-react"
import ServiceDetailsLink from "@/components/auth/service-details-link"

interface Vendor {
  name?: string
  email?: string
  profileImage?: string
}

interface Service {
  _id: string
  name: string
  category: string
  description: string
  location: string
  price: number
  images: string[]
  vendorId?: string | Vendor
  vendor?: Vendor
  status?: string
  isActive?: boolean
}

async function getFeaturedServices(): Promise<Service[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/services/public`,
      {
        cache: "no-store",
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch services")
    }

    const result = await response.json()

    if (!result.success || !Array.isArray(result.data)) {
      return []
    }

    // Only approved and active services
    const approvedServices = result.data.filter(
      (service: Service) =>
        service.status === "approved" && service.isActive === true
    )

    // Show 6 services from the database
    return approvedServices.slice(0, 6)
  } catch (error) {
    console.error("Featured services error:", error)
    return []
  }
}

export default async function FeaturedServices() {
  const services = await getFeaturedServices()

  return (
    <section className="bg-[#DDF2FD]/50 px-6 py-20 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="mb-3 inline-block text-sm font-semibold tracking-[0.2em] text-[#427D9D] uppercase">
              Discover Our Services
            </span>

            <h2 className="text-3xl font-bold text-[#164863] md:text-4xl">
              Featured Wedding Services
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
              Find the perfect wedding professionals to make your special day
              unforgettable.
            </p>
          </div>

          <Link
            href="/services"
            className="group inline-flex items-center gap-2 font-semibold text-[#164863] transition-colors hover:text-[#427D9D]"
          >
            View All Services
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const image = service.images?.[0]

              const vendor =
                service.vendor ||
                (typeof service.vendorId === "object"
                  ? service.vendorId
                  : undefined)

              return (
                <div
                  key={service._id}
                  className="group overflow-hidden rounded-2xl border border-[#9BBEC8]/40 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Service Image */}
                  <div className="relative h-56 overflow-hidden bg-[#DDF2FD]">
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
                      className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#164863] backdrop-blur transition-colors hover:bg-[#164863] hover:text-white"
                    >
                      {service.category}
                    </Link>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    {/* Service Name */}
                    <h3 className="line-clamp-1 text-xl font-bold text-[#164863]">
                      {service.name}
                    </h3>

                    {/* Location */}
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 text-[#427D9D]" />

                      <span className="line-clamp-1">
                        {service.location || "Location not specified"}
                      </span>
                    </div>

                    {/* Vendor Information */}
                    <div className="mt-4 flex items-center justify-between border-t border-[#9BBEC8]/30 pt-4">
                      <div>
                        <p className="text-xs text-gray-500">
                          Service Provider
                        </p>

                        <p className="mt-1 font-medium text-[#164863]">
                          {vendor?.name || "Wedding Vendor"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-500">Starting from</p>

                        <p className="mt-1 text-lg font-bold text-[#164863]">
                          ৳{Number(service.price).toLocaleString("en-BD")}
                        </p>
                      </div>
                    </div>

                    {/* View Details */}
                    <ServiceDetailsLink
                      href={`/services/${service._id}`}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#164863] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#427D9D]"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </ServiceDetailsLink>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#9BBEC8]/40 bg-white px-6 py-16 text-center">
            <h3 className="text-xl font-semibold text-[#164863]">
              No Featured Services Yet
            </h3>

            <p className="mt-3 text-gray-500">
              Approved wedding services will appear here soon.
            </p>
          </div>
        )}

        {/* Bottom */}
        <div className="mt-10 text-center">
          <Link
            href="/services?category=Photography%2CVideography"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#164863] px-7 py-3 font-semibold text-[#164863] transition-all hover:bg-[#164863] hover:text-white"
          >
            Explore Photography & Videography
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
