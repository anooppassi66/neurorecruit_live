"use client"

import { Search, Zap, Globe } from "lucide-react"
import Image from "next/image"

export default function FeaturesSection() {
  const features = [
    {
      icon: Search,
      image: '/assets/1.jpg',
      title: "AI Matching",
      description: "AI matches job seeker skills with recruiter needs.",
    },
    {
      icon: Zap,
      image: '/assets/2.jpg',
      title: "Faster Hiring",
      description: "Reduce recruitment time using automation.",
    },
    {
      icon: Globe,
      image: '/assets/3.jpg',
      title: "Global Opportunities",
      description: "Access Job seekers & recruiters worldwide.",
    },
  ]

  return (
    <section className="py-20 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-indigo-600">Us?</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-lg border border-gray-200 hover:border-emerald-600/50 hover:shadow-lg transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* <div className="mb-4 p-3 bg-emerald-100 rounded-lg w-fit group-hover:bg-emerald-200 transition"> */}
                  {/* <Icon className="w-8 h-8 text-indigo-600" /> */}
                {/* </div> */}
                  <Image src={feature.image} alt={feature.description} height={150} width={150}/>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 font-medium">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
