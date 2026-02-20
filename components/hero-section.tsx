"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"

export default function HeroSection() {
  const tokenFromStore = useSelector((s: RootState) => s.auth.token)
  const isLoggedIn = Boolean(tokenFromStore || typeof window !== "undefined" && localStorage.getItem("token"))
  return (
    <section className="relative py-20 md:py-20 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-background">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-in-left">
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Bring your talent <span className="text-indigo-600">our AI will get you a job</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-md font-medium">
                Smart AI matching to connect Job Seekers and recruiters faster, better, smarter.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {!isLoggedIn && (
                <Link href="/join-now" className="w-full sm:w-auto">
                  <Button className="w-full text-indigo-600 text-white px-8 py-6 text-base font-semibold">
                    Join Now
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                className="px-8 py-6 text-base bg-white  text-indigo-600 font-medium"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="hidden md:flex items-center justify-center animate-slide-in-right">
            <div className="relative w-full h-96 flex items-center justify-center">
              <Image
                src="/assets/ai-illustration.png" // 🔹 replace with your actual image path
                alt="AI Illustration"
                width={500}
                height={500}
                quality={100}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
