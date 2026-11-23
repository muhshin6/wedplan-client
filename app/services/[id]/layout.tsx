import type { Metadata } from "next"
import { API_URL } from "@/lib/api"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  try {
    const response = await fetch(`${API_URL}/api/services/${id}`, {
      cache: "no-store",
    })

    if (!response.ok || !(await response.clone().json()).success) {
      return { title: "Service Not Found" }
    }

    const result = await response.json()
    const service = result.data

    return {
      title: service?.name || "Service Details",
      description:
        service?.description?.slice(0, 160) ||
        "Explore this wedding service on WedPlan.",
      openGraph: {
        images: service?.images?.[0] ? [service.images[0]] : [],
      },
    }
  } catch {
    return { title: "Service Details" }
  }
}

export default function ServiceDetailsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
