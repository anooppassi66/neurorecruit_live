"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ComingSoon() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground">Coming Soon</h1>
          <p className="text-xl text-muted-foreground">
            The job seeker portal is under development. We're working hard to bring you an amazing experience!
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">Be the first to know when we launch. Stay tuned!</p>
          <Link href="/">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
