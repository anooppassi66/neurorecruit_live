"use client"

import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import TestimonialSection from "@/components/testimonial-section"
import CTASection from "@/components/cta-section"
import Footer from "@/components/footer"
import StatsSection from "@/components/StatsSection"
import ResourceCategories from "@/components/ResourceCategories"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"

export default function Home() {
  const tokenFromStore = useSelector((s: RootState) => s.auth.token)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <ResourceCategories />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </main>
  )
}
