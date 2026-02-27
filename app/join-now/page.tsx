"use client"

import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Chrome, Facebook, Mail, Lock } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiFetch, ApiError } from "@/lib/api"
import { useDispatch, useSelector } from "react-redux"
import { setCredentials } from "@/store/authSlice"
import type { RootState } from "@/store"

export default function JoinNowPage() {
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const dispatch = useDispatch()
  const tokenFromStore = useSelector((s: RootState) => s.auth.token)

  useEffect(() => {
    const token = tokenFromStore || localStorage.getItem('token')
    if (token) {
      // User is already logged in, redirect to profile
      router.push('/my-profile')
    }
  }, [router, tokenFromStore])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await apiFetch<any>('https://backend.neurocruit.ai/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      }, { toastId: 'auth:login' })
      dispatch(setCredentials({ token: data.token, user: data.user }))
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/my-profile')
    } catch (err: any) {
      setError(err?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const data = await apiFetch<any>('https://backend.neurocruit.ai/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password
        })
      }, { toastId: 'auth:register' })
      dispatch(setCredentials({ token: data.token, user: data.user }))
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/my-profile')
    } catch (err: any) {
      setError(err?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main className="min-h-screen w-full bg-emerald-50">
        <div className="flex items-center justify-center min-h-screen w-full px-4">
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-2xl bg-white/80 backdrop-blur-sm ring-1 ring-emerald-100 shadow-2xl overflow-hidden divide-y md:divide-x md:divide-y-0 divide-emerald-100">
          <section className="flex flex-1 items-center justify-center bg-emerald-50 px-8 py-12">
            <div className="w-full max-w-md mx-auto space-y-5 text-slate-900">
              <Image
                src="/neurocruit-logo.png"
                alt="NEUROCRUIT"
                width={220}
                height={120}
                className="mt-3"
                priority
              />
              <h1 className="text-3xl font-bold leading-snug md:text-4xl">
                Find your dream job simply and quickly
              </h1>
              <p className="text-sm text-slate-600 md:text-base">
                Match with opportunities that fit your skills and ambitions using smart,
                AI-powered recommendations.
              </p>
              <div className="mt-4 rounded-xl bg-white p-4 text-sm shadow-md ring-1 ring-emerald-100">
                <p className="font-medium text-slate-800">A better path to more opportunity</p>
                <p className="mt-1 text-slate-600">
                  Discover curated roles from top companies and track your applications in one
                  place.
                </p>
              </div>
            </div>
          </section>

          <section className="flex w-full max-w-md flex-col bg-white px-8 py-10">
            <div className="mb-6 space-y-1">
              <h2 className="text-lg font-semibold text-slate-900">Welcome to Neurocruit</h2>
              <p className="text-sm text-slate-500">
                Access your projects, manage applications, and collaborate with recruiters.
              </p>
            </div>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="mb-6 w-full justify-between bg-slate-100">
                <TabsTrigger value="login" className="flex-1">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex-1">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                {error && <div className="text-red-600 text-sm">{error}</div>}

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="flex w-full items-center justify-center gap-2 border-slate-200"
                  >
                    <Chrome className="h-4 w-4 text-blue-500" />
                    Continue with Google
                  </Button>
                  <Button
                    variant="outline"
                    className="flex w-full items-center justify-center gap-2 border-slate-200"
                  >
                    <Facebook className="h-4 w-4 text-blue-600" />
                    Continue with Facebook
                  </Button>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="h-px flex-1 bg-slate-200" />
                  <span>OR</span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>

                <form
                  className="space-y-4"
                  onSubmit={handleLogin}
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email">
                      <Mail className="mr-1 h-4 w-4 text-slate-400" />
                      Enter your email
                    </Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="you@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="login-password">
                      <Lock className="mr-1 h-4 w-4 text-slate-400" />
                      Enter your password
                    </Label>
                    <Input 
                      id="login-password" 
                      type="password" 
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded border border-slate-300"
                      />
                      Remember me
                    </label>
                    <button type="button" className="text-indigo-600 hover:underline">
                      Forgot your password?
                    </button>
                  </div>
                  <Button type="submit" className="mt-2 w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>

                <p className="text-center text-xs text-slate-600">
                  Don&apos;t have an account?{" "}
                  <span className="cursor-pointer text-indigo-600 underline">
                    Sign Up
                  </span>
                </p>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-slate-900">Create your account</h2>
                  <p className="text-sm text-slate-500">
                    Join the platform to track applications and get personalised job matches.
                  </p>
                </div>

                <form
                  className="space-y-4"
                  onSubmit={handleSignup}
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-name">Full name</Label>
                    <Input 
                      id="signup-name" 
                      type="text" 
                      placeholder="Sarah Johnson"
                      value={signupData.name}
                      onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email">
                      <Mail className="mr-1 h-4 w-4 text-slate-400" />
                      Email
                    </Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="you@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password">
                      <Lock className="mr-1 h-4 w-4 text-slate-400" />
                      Password
                    </Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      placeholder="Create a password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-confirm">Confirm password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="Re-enter your password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit" className="mt-2 w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create account'}
                  </Button>
                </form>

                <p className="text-center text-xs text-slate-600">
                  By signing up, you agree to our{" "}
                  <span className="cursor-pointer text-indigo-600 underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="cursor-pointer text-indigo-600 underline">
                    Privacy Policy
                  </span>
                  .
                </p>
              </TabsContent>
            </Tabs>
          </section>
          </div>
        </div>
      </main>
    </>
  )
}
