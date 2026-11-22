import FeaturedServices from "@/components/home/featured-services"
import HeroSection from "@/components/home/hero-section"
import HowItWorks from "@/components/home/how-it-works"
import ServiceCategories from "@/components/home/service-categories"
import WhyChooseWedPlan from "@/components/home/why-choose-wedplan"

export default function Page() {
  return (
    <main>
      <HeroSection />
      <FeaturedServices />
      <ServiceCategories />
      <WhyChooseWedPlan />
      <HowItWorks />
    </main>
  )
}
