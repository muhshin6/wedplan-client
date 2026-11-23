import FeaturedServicesView, {
  type FeaturedService,
} from "@/components/home/featured-services-view"

async function getFeaturedServices(): Promise<FeaturedService[]> {
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
      (service: FeaturedService) =>
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

  return <FeaturedServicesView services={services} />
}
