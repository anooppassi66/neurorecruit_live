"use client"

import { Star } from "lucide-react"

export default function TestimonialSection() {
  return (
    <section className="py-20 md:py-22 bg-gradient-to-b from-gray-50 to-white " data-aos="fade-up">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <p className="text-gray-600 text-sm mb-2 font-medium">TRUSTED BY INDUSTRY LEADERS</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            <span className="text-indigo-600">56% reduction</span> in new hire turnover
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-12 hover:border-emerald-600/50 hover:shadow-lg transition-all">
          <div className="flex gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-indigo-600" color="#3a53a5" fill="#3a53a5"/>
            ))}
          </div>

          <blockquote className="text-lg md:text-xl text-gray-800 mb-6 leading-relaxed font-medium">
            "Neurocruit has completely changed the way we hire. We used to spend half our day reading resumes! Now
            we hire people who stay longer, with an experience that's aligned with our consumer brand."
          </blockquote>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full" />
            <div>
              <p className="font-semibold text-gray-900">Rosa Phillips</p>
              <p className="text-gray-600 text-sm">Head of Talent, TechCorp</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
