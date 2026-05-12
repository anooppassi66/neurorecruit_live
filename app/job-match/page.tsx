"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import { apiFetch } from "@/lib/api"
import { API_BASE } from "@/lib/config"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Briefcase, Mail, Phone, ChevronLeft, ChevronRight, Zap } from "lucide-react"

const API = `${API_BASE}/api/jobs`
const BRAND = "#2e5090"

type Job = { _id: string; title: string; description: string; skills: string[]; contactEmail: string; contactPhone: string; matchCount: number }
type Pagination = { page: number; pageSize: number; total: number; totalPages: number }

export default function JobMatchPage() {
  const router = useRouter()
  const tokenFromStore = useSelector((s: RootState) => s.auth.token)

  const [jobs, setJobs] = useState<Job[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [noSkillsMsg, setNoSkillsMsg] = useState("")

  useEffect(() => {
    const token = tokenFromStore || localStorage.getItem("token")
    if (!token) {
      router.push("/join-now")
      return
    }
    fetchMatches(token, page)
  }, [page])

  const fetchMatches = async (token: string, p: number) => {
    setLoading(true)
    try {
      const data = await apiFetch<{ jobs: Job[]; pagination: Pagination; message?: string }>(
        `${API}/match/me?page=${p}`,
        { headers: { Authorization: `Bearer ${token}` } },
        { showSuccess: false }
      )
      setJobs(data.jobs)
      setPagination(data.pagination)
      if (data.message) setNoSkillsMsg(data.message)
    } catch { /* toast shown */ } finally {
      setLoading(false)
    }
  }

  const goToPage = (p: number) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="border-b border-gray-200 bg-white px-4 py-5">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-5 w-5" style={{ color: BRAND }} />
            <h1 className="text-2xl font-bold text-gray-900">Job Match</h1>
          </div>
          <p className="text-sm text-gray-500">Jobs matched to your skills — ranked by relevance.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {pagination && !loading && (
          <p className="text-sm text-gray-500 mb-4">
            {pagination.total === 0
              ? noSkillsMsg || "No matching jobs found."
              : `${pagination.total} matching job${pagination.total !== 1 ? "s" : ""} found`}
          </p>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Job cards */}
        {!loading && jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map(job => (
              <div
                key={job._id}
                onClick={() => router.push(`/job-search/${job._id}`)}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-blue-100 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-gray-900 text-base">{job.title}</h2>
                    <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{job.description.replace(/<[^>]+>/g, " ").trim()}</p>
                    {job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.skills.slice(0, 6).map(s => (
                          <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                        {job.skills.length > 6 && (
                          <Badge variant="secondary" className="text-xs">+{job.skills.length - 6} more</Badge>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      {job.contactEmail && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{job.contactEmail}</span>}
                      {job.contactPhone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{job.contactPhone}</span>}
                    </div>
                  </div>
                  {/* Match badge */}
                  <div className="flex-shrink-0 text-center">
                    <div className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: `${BRAND}15`, color: BRAND }}>
                      {job.matchCount} skill{job.matchCount !== 1 ? "s" : ""} match
                    </div>
                    <p className="text-xs mt-1" style={{ color: BRAND }}>View →</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No matches yet</p>
            <p className="text-sm mt-1 max-w-sm mx-auto">
              {noSkillsMsg || "Add skills to your profile and we'll find jobs that match."}
            </p>
            <Button variant="outline" className="mt-4" onClick={() => router.push("/my-profile")}>
              Update Profile
            </Button>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button variant="outline" size="sm" onClick={() => goToPage(page - 1)} disabled={page <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | "…")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…")
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === "…"
                  ? <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
                  : <Button key={p} size="sm"
                      variant={p === page ? "default" : "outline"}
                      style={p === page ? { background: BRAND } : {}}
                      onClick={() => goToPage(p as number)}>
                      {p}
                    </Button>
              )}
            <Button variant="outline" size="sm" onClick={() => goToPage(page + 1)} disabled={page >= pagination.totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
