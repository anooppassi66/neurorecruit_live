"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { apiFetch } from "@/lib/api"
import { API_BASE } from "@/lib/config"
import { Pencil, Trash2, Plus, LogOut, Phone, Mail, Briefcase, X, Check, User } from "lucide-react"
import RichTextEditor from "@/components/RichTextEditor"

const API = `${API_BASE}/api/recruiter`
const BRAND = "#165dd3"
const BRAND_BTN = "#155dfc"

type Job = {
  _id: string
  title: string
  description: string
  skills: string[]
  contactEmail: string
  contactPhone: string
  recruiterName: string
  recruiterEmail: string
}
type Recruiter = { id: string | number; name: string; email: string; contactEmail?: string; contactPhone?: string }

export default function RecruiterToolPage() {
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null)
  const [token, setToken] = useState<string>("")
  const [jobs, setJobs] = useState<Job[]>([])

  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  const [contactForm, setContactForm] = useState({ contactEmail: "", contactPhone: "" })
  const [contactSaving, setContactSaving] = useState(false)
  const [showContact, setShowContact] = useState(false)

  const [jobForm, setJobForm] = useState({ title: "", description: "", skills: "" })
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [jobLoading, setJobLoading] = useState(false)
  const [showJobForm, setShowJobForm] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("recruiter_token")
    const savedUser = localStorage.getItem("recruiter_user")
    if (saved && savedUser) {
      setToken(saved)
      setRecruiter(JSON.parse(savedUser))
    }
  }, [])

  useEffect(() => {
    if (token) fetchJobs()
  }, [token])

  const authHeader = () => ({ Authorization: `Bearer ${token}` })

  const fetchJobs = async () => {
    try {
      const data = await apiFetch<Job[]>(`${API}/jobs`, { headers: authHeader() }, { showSuccess: false })
      setJobs(data)
    } catch { /* toast shown by apiFetch */ }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError("")
    try {
      const data = await apiFetch<any>(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm)
      }, { toastId: "recruiter:login" })
      setToken(data.token)
      setRecruiter(data.recruiter)
      localStorage.setItem("recruiter_token", data.token)
      localStorage.setItem("recruiter_user", JSON.stringify(data.recruiter))
      setContactForm({ contactEmail: data.recruiter.contactEmail || "", contactPhone: data.recruiter.contactPhone || "" })
    } catch (err: any) {
      setLoginError(err?.message || "Invalid credentials")
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("recruiter_token")
    localStorage.removeItem("recruiter_user")
    setToken("")
    setRecruiter(null)
    setJobs([])
  }

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactSaving(true)
    try {
      await apiFetch(`${API}/contact`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(contactForm)
      }, { toastId: "recruiter:contact" })
      setShowContact(false)
      setRecruiter(r => r ? { ...r, ...contactForm } : r)
    } catch { /* toast shown */ } finally {
      setContactSaving(false)
    }
  }

  const openNewJob = () => {
    setEditingJob(null)
    setJobForm({ title: "", description: "", skills: "" })
    setShowJobForm(true)
  }

  const openEditJob = (job: Job) => {
    setEditingJob(job)
    setJobForm({ title: job.title, description: job.description, skills: job.skills.join(", ") })
    setShowJobForm(true)
  }

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault()
    setJobLoading(true)
    try {
      const payload = { title: jobForm.title, description: jobForm.description, skills: jobForm.skills }
      if (editingJob) {
        await apiFetch(`${API}/jobs/${editingJob._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeader() },
          body: JSON.stringify(payload)
        }, { toastId: "recruiter:job-update" })
      } else {
        await apiFetch(`${API}/jobs`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader() },
          body: JSON.stringify(payload)
        }, { toastId: "recruiter:job-create" })
      }
      setShowJobForm(false)
      fetchJobs()
    } catch { /* toast shown */ } finally {
      setJobLoading(false)
    }
  }

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Delete this job post?")) return
    try {
      await apiFetch(`${API}/jobs/${id}`, {
        method: "DELETE",
        headers: authHeader()
      }, { toastId: `recruiter:job-delete-${id}` })
      setJobs(j => j.filter(job => job._id !== id))
    } catch { /* toast shown */ }
  }

  // ── Login screen ──
  if (!token || !recruiter) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-8">
          <div className="mb-6 text-center">
            <Briefcase className="h-10 w-10 mx-auto mb-2" style={{ color: BRAND }} />
            <h1 className="text-xl font-bold text-gray-900">Recruiter Portal</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to manage your job postings</p>
          </div>

          {loginError && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{loginError}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="Email address" value={loginForm.email}
              onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} required className="h-11" />
            <Input type="password" placeholder="Password" value={loginForm.password}
              onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} required className="h-11" />
            <Button type="submit" className="w-full h-11 rounded-full font-semibold hover:opacity-90"
              style={{ background: BRAND_BTN }} disabled={loginLoading}>
              {loginLoading ? "Signing in…" : "Login"}
            </Button>
          </form>
        </div>
      </main>
    )
  }

  // ── Dashboard screen ──
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-10 px-6 py-3 flex items-center justify-between border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <Briefcase className="h-6 w-6" style={{ color: BRAND }} />
          <div>
            <p className="text-sm font-semibold text-gray-900">{recruiter.name}</p>
            <p className="text-xs text-gray-500">{recruiter.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowContact(true)} className="gap-1.5 text-xs">
            <Phone className="h-3.5 w-3.5" /> Contact Details
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}
            className="gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50">
            <LogOut className="h-3.5 w-3.5" /> Logout
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Contact details modal */}
        {showContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md px-8 py-7 mx-4">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Contact Details</h2>
                <button onClick={() => setShowContact(false)}><X className="h-5 w-5 text-gray-400" /></button>
              </div>
              <form onSubmit={handleSaveContact} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input className="pl-9 h-11" placeholder="contact@company.com" value={contactForm.contactEmail}
                      onChange={e => setContactForm(f => ({ ...f, contactEmail: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Contact Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input className="pl-9 h-11" placeholder="+1 555 000 0000" value={contactForm.contactPhone}
                      onChange={e => setContactForm(f => ({ ...f, contactPhone: e.target.value }))} />
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowContact(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 font-semibold" style={{ background: BRAND_BTN }} disabled={contactSaving}>
                    {contactSaving ? "Saving…" : "Save"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Job form modal */}
        {showJobForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg px-8 py-7 mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">{editingJob ? "Edit Job Post" : "New Job Post"}</h2>
                <button onClick={() => setShowJobForm(false)}><X className="h-5 w-5 text-gray-400" /></button>
              </div>
              <form onSubmit={handleSaveJob} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Job Title</label>
                  <Input className="h-11" placeholder="e.g. Senior Frontend Engineer" value={jobForm.title}
                    onChange={e => setJobForm(f => ({ ...f, title: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Job Description</label>
                  <RichTextEditor
                    value={jobForm.description}
                    onChange={v => setJobForm(f => ({ ...f, description: v }))}
                    placeholder="Describe the role, responsibilities, and requirements…"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                    Skills <span className="normal-case text-gray-400">(comma-separated)</span>
                  </label>
                  <Input className="h-11" placeholder="React, TypeScript, Node.js" value={jobForm.skills}
                    onChange={e => setJobForm(f => ({ ...f, skills: e.target.value }))} />
                </div>
                <div className="flex gap-3 pt-1">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowJobForm(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 font-semibold gap-1.5" style={{ background: BRAND_BTN }} disabled={jobLoading}>
                    <Check className="h-4 w-4" />
                    {jobLoading ? "Saving…" : editingJob ? "Update Job" : "Post Job"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Jobs list header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Job Posts</h2>
            <p className="text-sm text-gray-500 mt-0.5">{jobs.length} post{jobs.length !== 1 ? "s" : ""}</p>
          </div>
          <Button onClick={openNewJob} className="gap-1.5 font-semibold" style={{ background: BRAND_BTN }}>
            <Plus className="h-4 w-4" /> New Job Post
          </Button>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No job posts yet</p>
            <p className="text-sm mt-1">Click "New Job Post" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base">{job.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{job.description.replace(/<[^>]+>/g, " ").trim()}</p>
                    {job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.skills.map(s => (
                          <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      {job.recruiterName && (
                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{job.recruiterName}</span>
                      )}
                      {job.contactEmail && (
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{job.contactEmail}</span>
                      )}
                      {job.contactPhone && (
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{job.contactPhone}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" onClick={() => openEditJob(job)}
                      className="h-8 px-2.5 gap-1 text-xs">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteJob(job._id)}
                      className="h-8 px-2.5 gap-1 text-xs text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
