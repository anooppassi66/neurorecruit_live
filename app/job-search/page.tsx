"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import { Search, MapPin, Phone, Mail, ChevronLeft, ChevronRight, Briefcase, DollarSign } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { API_BASE } from "@/lib/config"

const API = `${API_BASE}/api/jobs`
const BRAND = "#165dd3"
const BRAND_BTN = "#155dfc"

type Job = { _id: string; title: string; description: string; skills: string[]; city: string; hourlyRate: string; contactEmail: string; contactPhone: string; createdAt: string }
type Pagination = { page: number; pageSize: number; total: number; totalPages: number }

export default function JobSearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [inputVal, setInputVal] = useState(searchParams.get("q") || "")
  const [jobs, setJobs] = useState<Job[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(Number(searchParams.get("page") || 1))

  const fetchJobs = useCallback(async (q: string, p: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p) })
      if (q.trim()) params.set("q", q.trim())
      const data = await apiFetch<{ jobs: Job[]; pagination: Pagination }>(
        `${API}/search?${params}`, {}, { showSuccess: false }
      )
      setJobs(data.jobs)
      setPagination(data.pagination)
    } catch { /* toast shown */ } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs(query, page)
  }, [query, page, fetchJobs])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setQuery(inputVal)
    router.push(`/job-search?q=${encodeURIComponent(inputVal)}&page=1`)
  }

  const goToPage = (p: number) => {
    setPage(p)
    router.push(`/job-search?q=${encodeURIComponent(query)}&page=${p}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Search bar */}
      <div className="border-b border-gray-200 bg-white px-4 py-5">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Search</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9 h-11 bg-gray-50 border-gray-200"
                placeholder="Search by role, skill, or keyword…"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
              />
            </div>
            <Button type="submit" className="h-11 px-6 font-semibold" style={{ background: BRAND_BTN }}>
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Results count */}
        {pagination && !loading && (
          <p className="text-sm text-gray-500 mb-4">
            {pagination.total === 0
              ? "No jobs found."
              : `Showing ${(pagination.page - 1) * pagination.pageSize + 1}–${Math.min(pagination.page * pagination.pageSize, pagination.total)} of ${pagination.total} job${pagination.total !== 1 ? "s" : ""}`}
            {query && <> for <span className="font-medium text-gray-700">"{query}"</span></>}
          </p>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
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
                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-400">
                  {job.city && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.city}</span>}
                  {job.hourlyRate && <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.hourlyRate}</span>}
                  {job.contactEmail && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{job.contactEmail}</span>}
                  {job.contactPhone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{job.contactPhone}</span>}
                  <span className="ml-auto" style={{ color: BRAND }}>View details →</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && jobs.length === 0 && pagination && (
          <div className="text-center py-20 text-gray-400">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No jobs found</p>
            <p className="text-sm mt-1">Try a different keyword or browse all jobs by clearing the search.</p>
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
