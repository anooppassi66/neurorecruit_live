"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import { Trash2, FileText, Download } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { apiFetch, ApiError } from "@/lib/api"
import { API_BASE } from "@/lib/config"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { logout } from "@/store/authSlice"

export default function ResumePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const tokenFromStore = useSelector((s: RootState) => s.auth.token)

  useEffect(() => {
    const token = tokenFromStore || localStorage.getItem('token')
    if (!token) {
      router.push('/join-now')
      return
    }
    setAuthChecked(true)
    fetchProfile()
  }, [])

  const clearSession = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch(logout())
    router.push('/join-now')
  }

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const data = await apiFetch<any>(`${API_BASE}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      }, { showSuccess: false, toastId: 'profile:get' })
      setProfile(data)
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 401) {
        clearSession()
      } else {
        setError(err?.message || 'Network error')
      }
    } finally {
      setLoading(false)
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('resume', file)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE}/api/profile/resume`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })
      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()
      setProfile(data.profile)
    } catch (err: any) {
      setError(err?.message || 'Failed to upload resume')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteResume = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE}/api/profile/resume`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Delete failed')
      const data = await response.json()
      setProfile(data.profile)
    } catch (err: any) {
      setError(err?.message || 'Failed to delete resume')
    }
  }

  if (!authChecked || loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
          {error && <div className="text-red-600">{error}</div>}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Resume / CV</CardTitle>
              <CardDescription>Upload your latest resume for recruiters to review.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
              />
              {profile?.resume?.filename ? (
                <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 line-clamp-1">{profile.resume.originalName || profile.resume.filename}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(profile.resume.uploadDate).toLocaleDateString()} {profile.resume.size ? `• ${(profile.resume.size / 1024 / 1024).toFixed(2)} MB` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center gap-2">
                      {profile.resume.url ? (
                        <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                          <a href={profile.resume.url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" /> Download
                          </a>
                        </Button>
                      ) : null}

                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleDeleteResume}>
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full border border-indigo-100 text-indigo-600" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                      {isUploading ? "Uploading..." : "Update Resume"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40 ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <UploadIcon />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{isUploading ? "Uploading..." : "Upload your resume"}</p>
                  <p className="text-xs text-slate-500">
                    PDF, DOC, or DOCX only. Max size 10MB.
                  </p>
                  <Button size="sm" className="mt-4 bg-[#165DD3] text-white hover:bg-indigo-700" disabled={isUploading}>
                    Choose File
                  </Button>
                </div>
              )}
              <div className="space-y-2 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Resume Tips</p>
                <ul className="space-y-1">
                  <li>Keep it to 1–2 pages.</li>
                  <li>Highlight achievements with metrics.</li>
                  <li>Use keywords from job descriptions.</li>
                  <li>Update regularly with new skills.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}

function UploadIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
      <polyline points="7 9 12 4 17 9" />
      <line x1="12" y1="4" x2="12" y2="16" />
    </svg>
  )
}

