"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { API_BASE } from "@/lib/config"
import { useDispatch, useSelector } from "react-redux"
import { setCredentials, logout } from "@/store/authSlice"
import type { RootState } from "@/store"

const BRAND = "#2e5090"

function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

const SOCIAL = [
  {
    label: "Continue with Google",
    icon: "https://d8it4huxumps7.cloudfront.net/uploads/images/google-logo-icon.webp",
    iconW: 20, iconH: 20,
  },
  {
    label: "Continue with LinkedIn",
    icon: "https://d8it4huxumps7.cloudfront.net/uploads/images/664ecbbb1335e_linkedin_fav.png",
    iconW: 20, iconH: 20,
  },
  {
    label: "Continue with Microsoft",
    icon: "https://d8it4huxumps7.cloudfront.net/uploads/images/69099ee004fa4_microsoft_logo.png",
    iconW: 20, iconH: 20,
  },
]

export default function JoinNowPage() {
  const [tab, setTab] = useState<"login" | "signup">("login")
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPwd, setShowPwd] = useState(false)
  const [showPwd2, setShowPwd2] = useState(false)
  const [showPwd3, setShowPwd3] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const tokenFromStore = useSelector((s: RootState) => s.auth.token)

  useEffect(() => {
    const token = tokenFromStore || localStorage.getItem("token")
    if (!token) return
    if (isTokenValid(token)) {
      router.push("/my-profile")
    } else {
      // Token exists but is expired — purge it so the user sees the login form
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      dispatch(logout())
    }
  }, [router, tokenFromStore, dispatch])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const data = await apiFetch<any>(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      }, { toastId: "auth:login" })
      dispatch(setCredentials({ token: data.token, user: data.user }))
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      router.push("/my-profile")
    } catch (err: any) {
      setError(err?.message || "Network error")
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }
    try {
      const data = await apiFetch<any>(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: signupData.name, email: signupData.email, password: signupData.password }),
      }, { toastId: "auth:register" })
      dispatch(setCredentials({ token: data.token, user: data.user }))
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      router.push("/my-profile")
    } catch (err: any) {
      setError(err?.message || "Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex font-sans" style={{ background: "#f5f7fa" }}>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex relative w-[52%] min-h-screen overflow-hidden">
        {/* base background image */}
        <Image
          src="https://d8it4huxumps7.cloudfront.net/uploads/images/6566e4c54d464_bg.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        {/* left decorative vector overlay (right edge decoration) */}
        <div className="absolute inset-0 z-10 flex items-stretch">
          <Image
            src="https://d8it4huxumps7.cloudfront.net/uploads/images/login/left-vector.png"
            alt=""
            fill
            className="object-cover object-right"
          />
        </div>

        {/* content on top */}
        <div className="relative z-20 flex flex-col w-full px-12 py-10">
          {/* Neurocruit logo (white) */}
          <div>
            <Image
              src="/neurocruit_logo_rectangle.png"
              alt="Neurocruit"
              width={190}
              height={76}
              priority
            />
          </div>

          {/* centred illustration carousel — use login-img-1 as static hero */}
          <div className="flex-1 flex items-center justify-center py-8">
            <Image
              src="https://d8it4huxumps7.cloudfront.net/uploads/images/login/login-img-1.png"
              alt="Find your dream job"
              width={480}
              height={380}
              className="w-full max-w-[480px] h-auto object-contain drop-shadow-xl"
            />
          </div>

          {/* dot indicators — static, matching Unstop style */}
          <div className="flex justify-center gap-2 pb-6">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <span
                key={i}
                className="inline-block rounded-full transition-all"
                style={{
                  width: i === 0 ? 18 : 8,
                  height: 8,
                  background: i === 0 ? "#2c373e" : "#fefefe",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-5 py-10 bg-white lg:bg-transparent">

        {/* mobile logo */}
        <div className="lg:hidden mb-8">
          <Image src="/neurocruit_logo_rectangle.png" alt="Neurocruit" width={160} height={60} priority />
        </div>

        <div className="w-full max-w-[420px]">

          {/* ── Login as tabs (Candidate / Recruiter style → Login / Sign Up) ── */}
          <div className="flex rounded-full border-2 mb-7 overflow-hidden" style={{ borderColor: BRAND }}>
            <button
              onClick={() => { setTab("login"); setError("") }}
              className="flex-1 py-2.5 text-sm font-semibold transition-all"
              style={{
                background: tab === "login" ? BRAND : "transparent",
                color: tab === "login" ? "#fff" : BRAND,
              }}
            >
              Login
            </button>
            <button
              onClick={() => { setTab("signup"); setError("") }}
              className="flex-1 py-2.5 text-sm font-semibold transition-all"
              style={{
                background: tab === "signup" ? BRAND : "transparent",
                color: tab === "signup" ? "#fff" : BRAND,
              }}
            >
              Register
            </button>
          </div>

          {/* ── Social login buttons ── */}
          <div className="flex flex-col gap-3 mb-5">
            {SOCIAL.map((s) => (
              <button
                key={s.label}
                type="button"
                className="w-full flex items-center gap-3 px-4 h-11 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition text-sm font-medium text-gray-700 shadow-sm"
              >
                <Image src={s.icon} alt={s.label} width={s.iconW} height={s.iconH} className="object-contain flex-shrink-0" />
                <span className="flex-1 text-center">{s.label}</span>
              </button>
            ))}
          </div>

          {/* OR divider */}
          <div className="flex items-center gap-3 mb-5">
            <span className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <span className="flex-1 h-px bg-gray-200" />
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-11 rounded-lg border-gray-200 text-sm"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Password</label>
                  <button type="button" className="text-xs font-medium hover:underline" style={{ color: BRAND }}>
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showPwd ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-11 pr-10 rounded-lg border-gray-200 text-sm"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPwd(!showPwd)}
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300 accent-[#2e5090]" />
                <label htmlFor="remember">Remember me</label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-full text-sm font-bold tracking-wide mt-1 hover:opacity-90 transition-opacity"
                style={{ background: BRAND }}
                disabled={loading}
              >
                {loading ? "Signing in…" : "Login"}
              </Button>

              <p className="text-center text-sm text-gray-500 pt-1">
                New to Neurocruit?{" "}
                <button type="button" onClick={() => setTab("signup")} className="font-semibold hover:underline" style={{ color: BRAND }}>
                  Register Now
                </button>
              </p>
            </form>
          )}

          {/* ── SIGNUP FORM ── */}
          {tab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="Sarah Johnson"
                  className="h-11 rounded-lg border-gray-200 text-sm"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 rounded-lg border-gray-200 text-sm"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPwd2 ? "text" : "password"}
                    placeholder="Create a password"
                    className="h-11 pr-10 rounded-lg border-gray-200 text-sm"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPwd2(!showPwd2)}>
                    {showPwd2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showPwd3 ? "text" : "password"}
                    placeholder="Re-enter your password"
                    className="h-11 pr-10 rounded-lg border-gray-200 text-sm"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    required
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPwd3(!showPwd3)}>
                    {showPwd3 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-full text-sm font-bold tracking-wide mt-1 hover:opacity-90 transition-opacity"
                style={{ background: BRAND }}
                disabled={loading}
              >
                {loading ? "Creating account…" : "Create Account"}
              </Button>

              <p className="text-center text-xs text-gray-500 pt-1">
                By registering you agree to our{" "}
                <span className="cursor-pointer hover:underline" style={{ color: BRAND }}>Terms of Service</span>{" "}
                &amp;{" "}
                <span className="cursor-pointer hover:underline" style={{ color: BRAND }}>Privacy Policy</span>.
              </p>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <button type="button" onClick={() => setTab("login")} className="font-semibold hover:underline" style={{ color: BRAND }}>
                  Login Now
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
