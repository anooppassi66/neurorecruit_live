"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="py-20 md:py-22 bg-gradient-to-b from-white via-gray-50 to-background relative overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-500/5 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
  
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get Started <span className="text-indigo-600">Today</span>
          </h2>
          <p className="text-lg text-gray-600 font-medium">Choose your role and start your journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/coming-soon">
            <Button className="w-full text-indigo-600 hover:bg-emerald-700 text-white py-6 text-lg font-semibold transition-all hover:shadow-lg hover:shadow-emerald-600/30">
              Join as New Hire
            </Button>
          </Link>
          <Link href="https://recruit.neurocruit.ai/signup">
            <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white py-6 text-lg font-semibold transition-all hover:shadow-lg hover:shadow-gray-800/30">
              Join as Recruiter
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
