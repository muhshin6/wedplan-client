// Home fetches live service data — render on demand instead of prerendering.
export const dynamic = "force-dynamic"

import FeaturedServices from "@/components/home/featured-services"
import HeroSection from "@/components/home/hero-section"
import ServiceCategories from "@/components/home/service-categories"
import WhyChooseWedPlan from "@/components/home/why-choose-wedplan"

export default function Page() {
  return (
    <main>
      <HeroSection />
      <FeaturedServices />
      <ServiceCategories />
      <WhyChooseWedPlan />
    </main>
  )
}
