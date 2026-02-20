"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function RecruiterTool() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 to-slate-100 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground">Recruiter Tool</h1>
          <p className="text-xl text-muted-foreground">
            Welcome to the recruiter dashboard. This is where you can manage your recruitment process.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">Your existing recruiter tool integration goes here.</p>
          <Link href="/">
            <Button className="gap-2 bg-teal-600 hover:bg-teal-700 text-white">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
