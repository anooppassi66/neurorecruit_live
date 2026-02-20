"use client"

import type { ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import { Mail, MapPin, Phone, Globe, Linkedin, Edit3, Plus, Check, X } from "lucide-react"
import { Fragment, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiFetch, ApiError } from "@/lib/api"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { calculateProfileStrength } from "@/lib/profileStrength"

export default function MyProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [authChecked, setAuthChecked] = useState(false)
  const [editingExperience, setEditingExperience] = useState<any | null>(null)
  const [editingEducation, setEditingEducation] = useState<any | null>(null)
  const router = useRouter()
  const tokenFromStore = useSelector((s: RootState) => s.auth.token)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = tokenFromStore || localStorage.getItem('token')
    if (!token) {
      router.push('/join-now')
      return
    }
    setAuthChecked(true)
    fetchProfile()
  }

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const data = await apiFetch<any>('http://localhost:5001/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      }, { showSuccess: false, toastId: 'profile:get' })
      setProfile(data)
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/join-now')
      } else {
        setError(err?.message || 'Network error')
      }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: any) => {
    try {
      const token = localStorage.getItem('token')
      const data = await apiFetch<any>('http://localhost:5001/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      }, { toastId: 'profile:update' })
      setProfile(data.profile)
    } catch (err: any) {
      setError(err?.message || 'Network error')
    }
  }

  if (!authChecked) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Checking authentication...</p>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading your profile...</p>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            <div className="text-red-600">{error}</div>
          </div>
        </main>
      </>
    )
  }

  if (!profile) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            <div>Profile not found</div>
          </div>
        </main>
      </>
    )
  }
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 shadow-sm">
          <div className="flex flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-8">
            <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 ring-4 ring-white/20">
                  <AvatarImage src="/placeholder-user.jpg" alt={profile.fullName || "User"} />
                  <AvatarFallback>{profile.fullName ? profile.fullName.split(' ').map((n: string) => n[0]).join('') : 'U'}</AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-white">
                  <h1 className="text-2xl font-semibold md:text-3xl">{profile.fullName || 'Your Name'}</h1>
                  <p className="text-sm md:text-base text-indigo-100">{profile.headline || 'Your Headline'}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-indigo-100/90">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {profile.location || 'Your Location'}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      {profile.email || 'your.email@example.com'}
                    </span>
                    {profile.phone && (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="h-4 w-4" />
                        {profile.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-between gap-4 md:items-end">
              <ActionDialogButton
                label="Edit Profile"
                title="Edit profile"
                description="Update your main profile details."
                className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50"
                icon={<Edit3 className="h-4 w-4" />}
                onSave={(data) => updateProfile(data)}
                initialData={{
                  fullName: profile.fullName,
                  headline: profile.headline,
                  location: profile.location
                }}
              >
                <EditProfileForm />
              </ActionDialogButton>
              <div className="flex flex-wrap gap-3 text-xs md:text-sm text-indigo-100/90">
                <span>Passionate product designer with 8+ years of experience creating user-centred digital experiences.</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-indigo-100/90">
                <ActionDialogButton
                  label="LinkedIn"
                  title="LinkedIn profile"
                  description="Static example link for your LinkedIn profile."
                  variant="outline"
                  size="sm"
                  className="rounded-full border-white/40 bg-white/10 px-3 py-1 text-xs text-indigo-50 hover:bg-white/20"
                  icon={<Linkedin className="h-3.5 w-3.5" />}
                >
                  <p className="text-sm text-slate-700">
                    linkedin.com/in/sarahjohnson
                  </p>
                </ActionDialogButton>
                <ActionDialogButton
                  label="Portfolio"
                  title="Portfolio website"
                  description="Static example link for your portfolio."
                  variant="outline"
                  size="sm"
                  className="rounded-full border-white/40 bg-white/10 px-3 py-1 text-xs text-indigo-50 hover:bg-white/20"
                  icon={<Globe className="h-3.5 w-3.5" />}
                >
                  <p className="text-sm text-slate-700">
                    sarahjohnson.design
                  </p>
                </ActionDialogButton>
              </div>
            </div>
          </div>
        </section>

        <section className="grid w-full items-start gap-6 grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <Tabs defaultValue="overview" className="w-full rounded-2xl bg-transparent">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
                <TabsList className="bg-slate-100 text-slate-700">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="mt-4 space-y-6">
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle>Personal Information</CardTitle>
                    <CardAction>
                      <ActionDialogButton
                        label="Edit"
                        title="Edit Personal Information"
                        description="Update your personal details, contact information, and professional summary."
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        icon={<Edit3 className="h-4 w-4" />}
                        formType="personal"
                        onSave={updateProfile}
                        initialData={{
                          fullName: profile.fullName,
                          phone: profile.phone,
                          location: profile.location,
                          linkedin: profile.linkedin,
                          email: profile.email,
                          dateOfBirth: profile.dateOfBirth,
                          nationality: profile.nationality,
                          portfolio: profile.portfolio,
                          professionalSummary: profile.professionalSummary
                        }}
                      />
                    </CardAction>
                    <CardDescription>
                      Key details recruiters use to understand your background.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <dl className="space-y-3 text-sm">
                        <div className="flex items-start justify-between gap-4">
                          <dt className="text-slate-500">Full Name</dt>
                          <dd className="font-medium text-slate-900">{profile.fullName || 'Not provided'}</dd>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <dt className="text-slate-500">Phone</dt>
                          <dd className="font-medium text-slate-900">{profile.phone || 'Not provided'}</dd>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <dt className="text-slate-500">Location</dt>
                          <dd className="font-medium text-slate-900">{profile.location || 'Not provided'}</dd>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <dt className="text-slate-500">LinkedIn</dt>
                          <dd className="font-medium text-indigo-600">{profile.linkedin || 'Not provided'}</dd>
                        </div>
                      </dl>
                      <dl className="space-y-3 text-sm">
                        <div className="flex items-start justify-between gap-4">
                          <dt className="text-slate-500">Email</dt>
                          <dd className="font-medium text-slate-900">{profile.email || 'Not provided'}</dd>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <dt className="text-slate-500">Date of Birth</dt>
                          <dd className="font-medium text-slate-900">{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'}</dd>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <dt className="text-slate-500">Nationality</dt>
                          <dd className="font-medium text-slate-900">{profile.nationality || 'Not provided'}</dd>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <dt className="text-slate-500">Portfolio</dt>
                          <dd className="font-medium text-indigo-600">{profile.portfolio || 'Not provided'}</dd>
                        </div>
                      </dl>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid gap-6 md:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-900">
                          Professional Summary
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {profile.professionalSummary || 'No professional summary provided yet.'}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-900">Languages</h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.languages && profile.languages.length > 0 ? (
                            profile.languages.map((lang: any, index: number) => (
                              <Badge key={index} variant="outline">
                                {lang.language} · {lang.proficiency}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline">No languages specified</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="border-b">
                    <CardTitle>Skills &amp; Expertise</CardTitle>
                    <CardAction>
                      <ActionDialogButton
                        label="Edit Skills"
                        title="Edit Skills & Expertise"
                        description="Update your design tools, technical skills, and soft skills."
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        icon={<Edit3 className="h-4 w-4" />}
                        formType="skills"
                        onSave={updateProfile}
                        initialData={{
                          designTools: profile.designTools,
                          technicalSkills: profile.technicalSkills,
                          softSkills: profile.softSkills
                        }}
                      />
                    </CardAction>
                    <CardDescription>
                      Highlight your strongest tools, technologies, and soft skills.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-900">Design Tools</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.designTools && profile.designTools.length > 0 ? (
                          profile.designTools.map((tool: string, index: number) => (
                            <Badge key={index} variant="secondary">{tool}</Badge>
                          ))
                        ) : (
                          <Badge variant="secondary">No design tools specified</Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-900">Technical Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.technicalSkills && profile.technicalSkills.length > 0 ? (
                          profile.technicalSkills.map((skill: string, index: number) => (
                            <Badge key={index} variant="outline">{skill}</Badge>
                          ))
                        ) : (
                          <Badge variant="outline">No technical skills specified</Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-900">Soft Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.softSkills && profile.softSkills.length > 0 ? (
                          profile.softSkills.map((skill: string, index: number) => (
                            <Badge key={index} variant="outline">{skill}</Badge>
                          ))
                        ) : (
                          <Badge variant="outline">No soft skills specified</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="border-b">
                  <CardTitle>Skills</CardTitle>
                    <CardDescription>
                    Skills from your profile.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {(profile.technicalSkills || []).map((s: string) => (
                      <Badge key={s} variant="outline">{s}</Badge>
                    ))}
                    {(profile.designTools || []).map((s: string) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                    {(profile.softSkills || []).map((s: string) => (
                      <Badge key={s} variant="default">{s}</Badge>
                    ))}
                  </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="mt-4 space-y-6">
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle>Work Experience</CardTitle>
                    <CardAction>
                      <ActionDialogButton
                        label="Add Experience"
                        title="Add Work Experience"
                        description="Add a new role to your professional experience."
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        icon={<Plus className="h-4 w-4" />}
                        formType="experience"
                        onSave={updateProfile}
                        initialData={{
                          experience: profile.experience || []
                        }}
                      />
                    </CardAction>
                    <CardDescription>
                      Showcase your most impactful roles and achievements.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {profile.experience && profile.experience.length > 0 ? (
                      profile.experience.map((exp: any, index: number) => (
                        <Fragment key={index}>
                          <ExperienceItem
                            role={exp.role}
                            company={exp.company}
                            location={exp.location}
                            duration={exp.duration}
                            summary={exp.summary}
                            achievements={exp.achievements || []}
                            onEdit={() => {
                              // For now, we'll use the add experience form to edit
                              // In a full implementation, you'd want a separate edit form
                              setEditingExperience({ ...exp, index })
                            }}
                          />
                          {index < profile.experience.length - 1 && <Separator />}
                        </Fragment>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <p>No work experience added yet.</p>
                        <p className="text-sm">Click "Add Experience" to get started.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="mt-4 space-y-6">
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle>Education</CardTitle>
                    <CardAction>
                      <ActionDialogButton
                        label="Add Education"
                        title="Add Education"
                        description="Add a new education entry to your profile."
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        icon={<Plus className="h-4 w-4" />}
                        formType="education"
                        onSave={updateProfile}
                        initialData={{
                          education: profile.education || []
                        }}
                      />
                    </CardAction>
                    <CardDescription>
                      Academic background and professional certifications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {profile.education && profile.education.length > 0 ? (
                      profile.education.map((edu: any, index: number) => (
                        <EducationItem
                          key={index}
                          degree={edu.degree}
                          institution={edu.institution}
                          duration={edu.duration}
                          gpa={edu.gpa}
                          coursework={edu.coursework}
                          onEdit={() => {
                            // For now, we'll use the add education form to edit
                            // In a full implementation, you'd want a separate edit form
                            setEditingEducation({ ...edu, index })
                          }}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <p>No education added yet.</p>
                        <p className="text-sm">Click "Add Education" to get started.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="mt-4 space-y-6">
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle>Projects &amp; Portfolio</CardTitle>
                    <CardAction>
                      <ActionDialogButton
                        label="Add Project"
                        title="Add Project"
                        description="Add a new project to your portfolio."
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        icon={<Plus className="h-4 w-4" />}
                        formType="projects"
                        onSave={updateProfile}
                        initialData={{
                          projects: profile.projects || []
                        }}
                      />
                    </CardAction>
                    <CardDescription>
                      Highlight projects that best represent your skills and impact.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                {profile.projects && profile.projects.length > 0 ? (
                  profile.projects.map((proj: any, index: number) => (
                    <Fragment key={index}>
                      <ProjectItem
                        title={proj.title}
                        description={proj.description}
                        tags={proj.tags || []}
                      />
                      {index < profile.projects.length - 1 && <Separator />}
                    </Fragment>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>No projects added yet.</p>
                    <p className="text-sm">Click "Add Project" to add your work.</p>
                  </div>
                )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <aside className="flex flex-col gap-6">
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Resume / CV</CardTitle>
                <CardDescription>Upload your latest resume for recruiters to review.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        <UploadIcon />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">Upload your resume</p>
                      <p className="text-xs text-slate-500">
                        PDF, DOC, or DOCX only. Max size 10MB.
                      </p>
                      <Button size="sm" className="mt-4 bg-indigo-600 text-white hover:bg-indigo-700">
                        Choose File
                      </Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload resume</DialogTitle>
                      <DialogDescription>
                        This is a static preview. No file is actually uploaded.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-3 text-sm text-slate-700">
                      <p>
                        In a real product you would drag and drop a PDF or DOCX file here and see
                        basic file details before saving.
                      </p>
                    </div>
                    <DialogFooter className="mt-6">
                      <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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

            <Card>
              <CardHeader className="border-b">
                <CardTitle>Profile Strength</CardTitle>
                <CardDescription>Complete sections to improve your profile visibility.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {profile && (() => {
                  const strength = calculateProfileStrength(profile);
                  return (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-slate-900">{strength.level}</p>
                        <span className="text-xs text-slate-500">{strength.percentage}%</span>
                      </div>
                      <Progress value={strength.percentage} />
                      <ul className="mt-4 space-y-2 text-xs text-slate-600 max-h-48 overflow-y-auto">
                        {strength.completedItems.map((item, index) => (
                          <li key={`completed-${index}`} className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-emerald-600" />
                              {item}
                            </span>
                            <span className="text-emerald-600 font-semibold">Done</span>
                          </li>
                        ))}
                        {strength.incompleteItems.map((item, index) => (
                          <li key={`incomplete-${index}`} className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-slate-400">
                              <X className="h-4 w-4 text-slate-400" />
                              {item}
                            </span>
                            <span className="text-slate-400 text-xs">Pending</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-slate-500 mt-2">
                        {strength.completedItemsCount} of {strength.totalItems} sections complete
                      </p>
                    </>
                  );
                })()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b">
                <CardTitle>Job Preferences</CardTitle>
                <CardAction>
                  <ActionDialogButton
                    label="Edit"
                    title="Edit Job Preferences"
                    description="Update your job search preferences."
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    icon={<Edit3 className="h-4 w-4" />}
                    formType="jobPreferences"
                    onSave={updateProfile}
                    initialData={{
                      jobPreferences: profile.jobPreferences || {}
                    }}
                  />
                </CardAction>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 text-sm text-slate-700">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Desired Role
                  </p>
                  <p>{profile.jobPreferences?.desiredRole || 'Not specified'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Expected Salary
                  </p>
                  <p>{profile.jobPreferences?.expectedSalary || 'Not specified'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Preferred Locations
                  </p>
                  <p>{profile.jobPreferences?.preferredLocations?.join(', ') || 'Not specified'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Availability
                  </p>
                  <p>{profile.jobPreferences?.availability || 'Not specified'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b">
                <CardTitle>Your Activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Applications Sent</span>
                  <span className="font-semibold text-slate-900">{profile.applicationsSent || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Profile Views</span>
                  <span className="font-semibold text-slate-900">{profile.profileViews || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Interview Invites</span>
                  <span className="font-semibold text-slate-900">{profile.interviewInvites || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Saved Jobs</span>
                  <span className="font-semibold text-slate-900">{profile.savedJobs || 0}</span>
                </div>
              </CardContent>
              <CardFooter className="border-t py-4">
                <ActionDialogButton
                  label="View detailed activity"
                  title="Activity details"
                  description="Summary of your recent profile activity."
                  variant="outline"
                  className="w-full"
                >
                  <ul className="space-y-1 text-sm text-slate-700">
                    <li>{profile.applicationsSent || 0} applications sent in the last 30 days.</li>
                    <li>{profile.profileViews || 0} profile views from recruiters.</li>
                    <li>{profile.interviewInvites || 0} interview invites received.</li>
                    <li>{profile.savedJobs || 0} jobs saved for later review.</li>
                  </ul>
                </ActionDialogButton>
              </CardFooter>
            </Card>
          </aside>
        </section>
      </div>
    </main>
  </>
  )
}

type SkillProgressProps = {
  label: string
  endorsements: number
  value: number
}

function SkillProgress({ label, endorsements, value }: SkillProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <p className="font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{endorsements} endorsements</p>
      </div>
      <Progress value={value} />
    </div>
  )
}

type ExperienceItemProps = {
  role: string
  company: string
  location: string
  duration: string
  summary: string
  achievements: string[]
}

function ExperienceItem({
  role,
  company,
  location,
  duration,
  summary,
  achievements,
  onEdit,
}: ExperienceItemProps & { onEdit?: () => void }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">{role}</p>
          <p className="text-xs text-slate-600">
            {company} · {location}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-slate-500">{duration}</p>
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={onEdit}
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      <p className="text-sm text-slate-700">{summary}</p>
      <ul className="list-disc space-y-1 pl-5 text-xs text-slate-600">
        {achievements.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

type ProjectItemProps = {
  title: string
  description: string
  tags: string[]
}

function ProjectItem({ title, description, tags, onEdit }: ProjectItemProps & { onEdit?: () => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-sm text-slate-700">{description}</p>
        </div>
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 flex-shrink-0"
            onClick={onEdit}
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="flex gap-4 text-xs font-medium text-indigo-600">
        <ActionDialogButton
          label="View Project"
          title={title}
          description="Static project preview."
          variant="link"
          className="h-auto px-0 text-xs font-medium text-indigo-600"
        >
          <p className="text-sm text-slate-700">{description}</p>
        </ActionDialogButton>
        <ActionDialogButton
          label="GitHub"
          title="GitHub link"
          description="Static GitHub link preview."
          variant="link"
          className="h-auto px-0 text-xs font-medium text-indigo-600"
        >
          <p className="text-sm text-slate-700">
            Example repository: github.com/sarahjohnson/project
          </p>
        </ActionDialogButton>
      </div>
    </div>
  )
}

type EducationItemProps = {
  degree: string
  institution: string
  duration: string
  gpa?: string
  coursework?: string
}

function EducationItem({ degree, institution, duration, gpa, coursework, onEdit }: EducationItemProps & { onEdit?: () => void }) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900">{degree}</p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-slate-500">{duration}{gpa && ` · GPA: ${gpa}`}</p>
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={onEdit}
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-slate-700">{institution}</p>
        {coursework && (
          <p className="mt-2 text-xs text-slate-600">
            Relevant coursework: {coursework}
          </p>
        )}
      </div>
    </div>
  )
}

type ActionDialogButtonProps = {
  label: string
  title: string
  description?: string
  variant?: any
  size?: any
  icon?: ReactNode
  className?: string
  children?: ReactNode
  onSave?: (data: any) => void
  initialData?: any
  formType?: string
}

// Edit Personal Information Form
function EditPersonalInfoForm({ onSave, initialData }: { onSave?: (data: any) => void, initialData?: any }) {
  const [formData, setFormData] = useState(initialData || {
    fullName: '',
    phone: '',
    location: '',
    linkedin: '',
    email: '',
    dateOfBirth: '',
    nationality: '',
    portfolio: '',
    professionalSummary: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-96 overflow-y-auto">
      <div className="grid gap-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          placeholder="Enter your full name"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          placeholder="+1 (555) 123-4567"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          placeholder="City, State, Country"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input
          id="linkedin"
          value={formData.linkedin}
          onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
          placeholder="linkedin.com/in/yourprofile"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="portfolio">Portfolio</Label>
        <Input
          id="portfolio"
          value={formData.portfolio}
          onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
          placeholder="yourwebsite.com"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="nationality">Nationality</Label>
        <Input
          id="nationality"
          value={formData.nationality}
          onChange={(e) => setFormData({...formData, nationality: e.target.value})}
          placeholder="Your nationality"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="professionalSummary">Professional Summary</Label>
        <Textarea
          id="professionalSummary"
          value={formData.professionalSummary}
          onChange={(e) => setFormData({...formData, professionalSummary: e.target.value})}
          placeholder="Brief description of your professional background..."
          rows={4}
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit">Save changes</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  )
}

// Edit Skills Form
function EditSkillsForm({ onSave, initialData }: { onSave?: (data: any) => void, initialData?: any }) {
  const [formData, setFormData] = useState(initialData || {
    designTools: [],
    technicalSkills: [],
    softSkills: []
  })
  const [newDesignTool, setNewDesignTool] = useState('')
  const [newTechnicalSkill, setNewTechnicalSkill] = useState('')
  const [newSoftSkill, setNewSoftSkill] = useState('')

  const addDesignTool = () => {
    if (newDesignTool && !formData.designTools.includes(newDesignTool)) {
      setFormData({
        ...formData,
        designTools: [...formData.designTools, newDesignTool]
      })
      setNewDesignTool('')
    }
  }

  const removeDesignTool = (tool: string) => {
    setFormData({
      ...formData,
      designTools: formData.designTools.filter((t: string) => t !== tool)
    })
  }

  const addTechnicalSkill = () => {
    if (newTechnicalSkill && !formData.technicalSkills.includes(newTechnicalSkill)) {
      setFormData({
        ...formData,
        technicalSkills: [...formData.technicalSkills, newTechnicalSkill]
      })
      setNewTechnicalSkill('')
    }
  }

  const removeTechnicalSkill = (skill: string) => {
    setFormData({
      ...formData,
      technicalSkills: formData.technicalSkills.filter((s: string) => s !== skill)
    })
  }

  const addSoftSkill = () => {
    if (newSoftSkill && !formData.softSkills.includes(newSoftSkill)) {
      setFormData({
        ...formData,
        softSkills: [...formData.softSkills, newSoftSkill]
      })
      setNewSoftSkill('')
    }
  }

  const removeSoftSkill = (skill: string) => {
    setFormData({
      ...formData,
      softSkills: formData.softSkills.filter((s: string) => s !== skill)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 py-4 max-h-96 overflow-y-auto">
      {/* Design Tools */}
      <div className="space-y-3">
        <Label>Design Tools</Label>
        <div className="flex gap-2">
          <Input
            value={newDesignTool}
            onChange={(e) => setNewDesignTool(e.target.value)}
            placeholder="Add design tool..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDesignTool())}
          />
          <Button type="button" onClick={addDesignTool} size="sm">Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.designTools.map((tool: string) => (
            <Badge key={tool} variant="secondary" className="cursor-pointer" onClick={() => removeDesignTool(tool)}>
              {tool} ×
            </Badge>
          ))}
        </div>
      </div>

      {/* Technical Skills */}
      <div className="space-y-3">
        <Label>Technical Skills</Label>
        <div className="flex gap-2">
          <Input
            value={newTechnicalSkill}
            onChange={(e) => setNewTechnicalSkill(e.target.value)}
            placeholder="Add technical skill..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnicalSkill())}
          />
          <Button type="button" onClick={addTechnicalSkill} size="sm">Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.technicalSkills.map((skill: string) => (
            <Badge key={skill} variant="outline" className="cursor-pointer" onClick={() => removeTechnicalSkill(skill)}>
              {skill} ×
            </Badge>
          ))}
        </div>
      </div>

      {/* Soft Skills */}
      <div className="space-y-3">
        <Label>Soft Skills</Label>
        <div className="flex gap-2">
          <Input
            value={newSoftSkill}
            onChange={(e) => setNewSoftSkill(e.target.value)}
            placeholder="Add soft skill..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSoftSkill())}
          />
          <Button type="button" onClick={addSoftSkill} size="sm">Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.softSkills.map((skill: string) => (
            <Badge key={skill} variant="outline" className="cursor-pointer" onClick={() => removeSoftSkill(skill)}>
              {skill} ×
            </Badge>
          ))}
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit">Save changes</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  )
}

// Edit Experience Form
function EditExperienceForm({ onSave, initialData }: { onSave?: (data: any) => void, initialData?: any }) {
  const [experiences, setExperiences] = useState<Array<any>>(
    Array.isArray(initialData) ? initialData : (initialData?.experience ?? [])
  )
  const [currentExp, setCurrentExp] = useState({
    role: '',
    company: '',
    location: '',
    duration: '',
    summary: '',
    achievements: ['']
  })

  const addExperience = () => {
    if (currentExp.role && currentExp.company) {
      setExperiences([...experiences, { ...currentExp }])
      setCurrentExp({
        role: '',
        company: '',
        location: '',
        duration: '',
        summary: '',
        achievements: ['']
      })
    }
  }

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_: any, i: number) => i !== index))
  }

  const updateAchievement = (expIndex: number, achIndex: number, value: string) => {
    const updated = [...experiences]
    updated[expIndex].achievements[achIndex] = value
    setExperiences(updated)
  }

  const addAchievement = (expIndex: number) => {
    const updated = [...experiences]
    updated[expIndex].achievements.push('')
    setExperiences(updated)
  }

  const removeAchievement = (expIndex: number, achIndex: number) => {
    const updated = [...experiences]
    updated[expIndex].achievements = updated[expIndex].achievements.filter((_: string, i: number) => i !== achIndex)
    setExperiences(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.({ experience: experiences })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 py-4 max-h-96 overflow-y-auto">
      {/* Existing Experiences */}
      {experiences.map((exp: any, index: number) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold">{exp.role} at {exp.company}</h4>
            <Button type="button" variant="destructive" size="sm" onClick={() => removeExperience(index)}>
              Remove
            </Button>
          </div>
          <div className="grid gap-2">
            <Label>Achievements</Label>
            {exp.achievements.map((achievement: string, achIndex: number) => (
              <div key={achIndex} className="flex gap-2">
                <Input
                  value={achievement}
                  onChange={(e) => updateAchievement(index, achIndex, e.target.value)}
                  placeholder="Describe your achievement..."
                />
                <Button type="button" variant="outline" size="sm" onClick={() => removeAchievement(index, achIndex)}>
                  ×
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addAchievement(index)}>
              Add Achievement
            </Button>
          </div>
        </div>
      ))}

      {/* Add New Experience */}
      <div className="border rounded-lg p-4 space-y-3 bg-slate-50">
        <h4 className="font-semibold">Add New Experience</h4>
        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            value={currentExp.role}
            onChange={(e) => setCurrentExp({...currentExp, role: e.target.value})}
            placeholder="Job title"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={currentExp.company}
            onChange={(e) => setCurrentExp({...currentExp, company: e.target.value})}
            placeholder="Company name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={currentExp.location}
            onChange={(e) => setCurrentExp({...currentExp, location: e.target.value})}
            placeholder="City, State"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={currentExp.duration}
            onChange={(e) => setCurrentExp({...currentExp, duration: e.target.value})}
            placeholder="Jan 2020 - Present"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            value={currentExp.summary}
            onChange={(e) => setCurrentExp({...currentExp, summary: e.target.value})}
            placeholder="Brief description of your role..."
            rows={3}
          />
        </div>
        <Button type="button" onClick={addExperience} className="w-full">
          Add Experience
        </Button>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit">Save changes</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  )
}

// Edit Education Form
function EditEducationForm({ onSave, initialData }: { onSave?: (data: any) => void, initialData?: any }) {
  const normalized = Array.isArray(initialData)
    ? initialData
    : (initialData?.education ?? [])
  const [educations, setEducations] = useState<Array<any>>(normalized)
  const [currentEdu, setCurrentEdu] = useState({
    degree: '',
    institution: '',
    duration: '',
    gpa: '',
    coursework: ''
  })

  const addEducation = () => {
    if (currentEdu.degree && currentEdu.institution) {
      setEducations([...educations, { ...currentEdu }])
      setCurrentEdu({
        degree: '',
        institution: '',
        duration: '',
        gpa: '',
        coursework: ''
      })
    }
  }

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_: any, i: number) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.({ education: educations })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 py-4 max-h-96 overflow-y-auto">
      {/* Existing Education */}
      {educations.map((edu: any, index: number) => (
        <div key={index} className="border rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{edu.degree}</h4>
              <p className="text-sm text-slate-600">{edu.institution}</p>
              <p className="text-xs text-slate-500">{edu.duration}</p>
            </div>
            <Button type="button" variant="destructive" size="sm" onClick={() => removeEducation(index)}>
              Remove
            </Button>
          </div>
        </div>
      ))}

      {/* Add New Education */}
      <div className="border rounded-lg p-4 space-y-3 bg-slate-50">
        <h4 className="font-semibold">Add New Education</h4>
        <div className="grid gap-2">
          <Label htmlFor="degree">Degree</Label>
          <Input
            id="degree"
            value={currentEdu.degree}
            onChange={(e) => setCurrentEdu({...currentEdu, degree: e.target.value})}
            placeholder="Bachelor of Science in Computer Science"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="institution">Institution</Label>
          <Input
            id="institution"
            value={currentEdu.institution}
            onChange={(e) => setCurrentEdu({...currentEdu, institution: e.target.value})}
            placeholder="University Name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={currentEdu.duration}
            onChange={(e) => setCurrentEdu({...currentEdu, duration: e.target.value})}
            placeholder="2015 - 2019"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="gpa">GPA</Label>
          <Input
            id="gpa"
            value={currentEdu.gpa}
            onChange={(e) => setCurrentEdu({...currentEdu, gpa: e.target.value})}
            placeholder="3.8/4.0"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="coursework">Relevant Coursework</Label>
          <Textarea
            id="coursework"
            value={currentEdu.coursework}
            onChange={(e) => setCurrentEdu({...currentEdu, coursework: e.target.value})}
            placeholder="Data Structures, Algorithms, Web Development..."
            rows={3}
          />
        </div>
        <Button type="button" onClick={addEducation} className="w-full">
          Add Education
        </Button>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit">Save changes</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  )
}

// Edit Projects Form
function EditProjectsForm({ onSave, initialData }: { onSave?: (data: any) => void, initialData?: any }) {
  const [projects, setProjects] = useState<Array<any>>(
    Array.isArray(initialData) ? initialData : (initialData?.projects ?? [])
  )
  const [currentProject, setCurrentProject] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    githubLink: '',
    liveLink: ''
  })
  const [newTag, setNewTag] = useState('')

  const addProject = () => {
    if (currentProject.title && currentProject.description) {
      setProjects([...projects, { ...currentProject }])
      setCurrentProject({
        title: '',
        description: '',
        tags: [],
        githubLink: '',
        liveLink: ''
      })
    }
  }

  const removeProject = (index: number) => {
    setProjects(projects.filter((_: any, i: number) => i !== index))
  }

  const addTag = () => {
    if (newTag && !currentProject.tags.includes(newTag)) {
      setCurrentProject({
        ...currentProject,
        tags: [...currentProject.tags, newTag]
      })
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setCurrentProject({
      ...currentProject,
      tags: currentProject.tags.filter((t: string) => t !== tag)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.({ projects })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 py-4 max-h-96 overflow-y-auto">
      {/* Existing Projects */}
      {projects.map((project: any, index: number) => (
        <div key={index} className="border rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{project.title}</h4>
              <p className="text-sm text-slate-600">{project.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {project.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Button type="button" variant="destructive" size="sm" onClick={() => removeProject(index)}>
              Remove
            </Button>
          </div>
        </div>
      ))}

      {/* Add New Project */}
      <div className="border rounded-lg p-4 space-y-3 bg-slate-50">
        <h4 className="font-semibold">Add New Project</h4>
        <div className="grid gap-2">
          <Label htmlFor="title">Project Title</Label>
          <Input
            id="title"
            value={currentProject.title}
            onChange={(e) => setCurrentProject({...currentProject, title: e.target.value})}
            placeholder="Project name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={currentProject.description}
            onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
            placeholder="Describe your project..."
            rows={3}
          />
        </div>
        <div className="grid gap-2">
          <Label>Tags</Label>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add technology..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} size="sm">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentProject.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                {tag} ×
              </Badge>
            ))}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="githubLink">GitHub Link</Label>
          <Input
            id="githubLink"
            value={currentProject.githubLink}
            onChange={(e) => setCurrentProject({...currentProject, githubLink: e.target.value})}
            placeholder="https://github.com/username/repo"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="liveLink">Live Demo Link</Label>
          <Input
            id="liveLink"
            value={currentProject.liveLink}
            onChange={(e) => setCurrentProject({...currentProject, liveLink: e.target.value})}
            placeholder="https://yourproject.com"
          />
        </div>
        <Button type="button" onClick={addProject} className="w-full">
          Add Project
        </Button>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit">Save changes</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  )
}

// Edit Job Preferences Form
function EditJobPreferencesForm({ onSave, initialData }: { onSave?: (data: any) => void, initialData?: any }) {
  const base = initialData
    ? (initialData.jobPreferences ?? initialData)
    : {
        desiredRole: '',
        expectedSalary: '',
        preferredLocations: [],
        availability: ''
      }
  const [formData, setFormData] = useState({
    ...base,
    preferredLocations: Array.isArray(base.preferredLocations)
      ? base.preferredLocations
      : [],
  })
  const [newLocation, setNewLocation] = useState('')

  const addLocation = () => {
    if (newLocation && !formData.preferredLocations.includes(newLocation)) {
      setFormData({
        ...formData,
        preferredLocations: [...formData.preferredLocations, newLocation]
      })
      setNewLocation('')
    }
  }

  const removeLocation = (location: string) => {
    setFormData({
      ...formData,
      preferredLocations: formData.preferredLocations.filter((l: string) => l !== location)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.({ jobPreferences: formData })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-96 overflow-y-auto">
      <div className="grid gap-2">
        <Label htmlFor="desiredRole">Desired Role</Label>
        <Input
          id="desiredRole"
          value={formData.desiredRole}
          onChange={(e) => setFormData({...formData, desiredRole: e.target.value})}
          placeholder="e.g., Full-time, Remote"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="expectedSalary">Expected Salary</Label>
        <Input
          id="expectedSalary"
          value={formData.expectedSalary}
          onChange={(e) => setFormData({...formData, expectedSalary: e.target.value})}
          placeholder="$120,000 - $150,000"
        />
      </div>
      <div className="grid gap-2">
        <Label>Preferred Locations</Label>
        <div className="flex gap-2">
          <Input
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            placeholder="Add location..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())}
          />
          <Button type="button" onClick={addLocation} size="sm">Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.preferredLocations.map((location: string) => (
            <Badge key={location} variant="outline" className="cursor-pointer" onClick={() => removeLocation(location)}>
              {location} ×
            </Badge>
          ))}
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="availability">Availability</Label>
        <Select value={formData.availability} onValueChange={(value) => setFormData({...formData, availability: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="immediately">Available immediately</SelectItem>
            <SelectItem value="2-weeks">Available in 2 weeks</SelectItem>
            <SelectItem value="1-month">Available in 1 month</SelectItem>
            <SelectItem value="3-months">Available in 3 months</SelectItem>
            <SelectItem value="not-looking">Not currently looking</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit">Save changes</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  )
}

function EditProfileForm({ onSave, initialData }: { onSave?: (data: any) => void, initialData?: any }) {
  const [formData, setFormData] = useState(initialData || {
    fullName: '',
    headline: '',
    location: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="headline">Headline</Label>
        <Input
          id="headline"
          value={formData.headline}
          onChange={(e) => setFormData({...formData, headline: e.target.value})}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit">Save changes</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  )
}

function ActionDialogButton({
  label,
  title,
  description,
  variant,
  size,
  icon,
  className,
  children,
  onSave,
  initialData,
  formType,
}: ActionDialogButtonProps) {
  const renderForm = () => {
    switch (formType) {
      case 'personal':
        return <EditPersonalInfoForm onSave={onSave} initialData={initialData} />
      case 'skills':
        return <EditSkillsForm onSave={onSave} initialData={initialData} />
      case 'experience':
        return <EditExperienceForm onSave={onSave} initialData={initialData} />
      case 'education':
        return <EditEducationForm onSave={onSave} initialData={initialData} />
      case 'projects':
        return <EditProjectsForm onSave={onSave} initialData={initialData} />
      case 'jobPreferences':
        return <EditJobPreferencesForm onSave={onSave} initialData={initialData} />
      default:
        return <EditProfileForm onSave={onSave} initialData={initialData} />
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          {icon}
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {onSave ? renderForm() : children}
        {!onSave && (
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
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

