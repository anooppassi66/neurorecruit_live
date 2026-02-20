"use client"

import Image from "next/image"

export default function ResourcesSection() {
  const resources = [
    {
      title: "Future-Proof Your Talent Acquisition",
      description: "Download our guide on AI-driven hiring",
      image: '/assets/talent-acquisition-guide.jpg',
    },
    {
      title: "The Future of Hiring Success",
      description: "Join industry experts in an in-depth discussion",
      image: '/assets/future-of-hiring.jpg',
    },
    {
      title: "Hiring in the Age of AI",
      description: "Read our latest article on leveraging AI in hiring",
      image: '/assets/ai-hiring.jpg',
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-background" data-aos="fade-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <p className="text-indigo-600 text-sm font-semibold mb-2">DIVE DEEPER WITH</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Valuable <span className="text-indigo-600">Insights</span>
          </h2>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 rounded-lg overflow-hidden mb-4 border border-gray-300 group-hover:border-emerald-600/50 transition-all">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent z-10" />

                {/* Image */}
                <Image
                  src={resource.image}
                  alt={resource.description || resource.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition">
                {resource.title}
              </h3>

              <p className="text-gray-600 text-sm font-medium">{resource.description}</p>
            </div>

          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 border border-emerald-600 text-indigo-600 rounded-full hover:bg-emerald-50 transition font-medium">
            View All Resources
          </button>
        </div>
      </div>
    </section>
  )
}
