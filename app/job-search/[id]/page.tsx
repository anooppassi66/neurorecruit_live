"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import { apiFetch } from "@/lib/api"
import { API_BASE } from "@/lib/config"
import { ArrowLeft, Mail, Phone, Briefcase, Calendar, User, MapPin, DollarSign } from "lucide-react"

const API = `${API_BASE}/api/jobs`
const BRAND = "#165dd3"
const BRAND_BTN = "#155dfc"

type Job = { _id: string; title: string; description: string; skills: string[]; city: string; hourlyRate: string; contactEmail: string; contactPhone: string; recruiterName: string; recruiterEmail: string; createdAt: string }

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<Job>(`${API}/${id}`, {}, { showSuccess: false })
      .then(setJob)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-10 animate-pulse space-y-4">
          <div className="h-7 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-3/4" />
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-400">
          <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Job not found</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/job-search")}>
            Back to search
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to results
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Posted {new Date(job.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
              {job.city && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />{job.city}
                </span>
              )}
              {job.hourlyRate && (
                <span className="flex items-center gap-1.5 font-medium" style={{ color: BRAND }}>
                  <DollarSign className="h-3.5 w-3.5" />{job.hourlyRate}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Job Description</h2>
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>

          {/* Skills */}
          {job.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(s => (
                  <Badge key={s} className="text-sm px-3 py-1" style={{ background: `${BRAND}15`, color: BRAND, border: `1px solid ${BRAND}30` }}>
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          {(job.recruiterName || job.contactEmail || job.contactPhone) && (
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact Details</h2>
              <div className="space-y-2">
                {job.recruiterName && (
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <User className="h-4 w-4 text-gray-400" />{job.recruiterName}
                  </p>
                )}
                {job.contactEmail && (
                  <a href={`mailto:${job.contactEmail}`}
                    className="flex items-center gap-2 text-sm hover:underline transition"
                    style={{ color: BRAND }}>
                    <Mail className="h-4 w-4" />{job.contactEmail}
                  </a>
                )}
                {job.contactPhone && (
                  <a href={`tel:${job.contactPhone}`}
                    className="flex items-center gap-2 text-sm hover:underline transition"
                    style={{ color: BRAND }}>
                    <Phone className="h-4 w-4" />{job.contactPhone}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
