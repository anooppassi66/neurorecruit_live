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

const BRAND = "#165dd3"
const BRAND_BTN = "#155dfc"

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
  // 0 = off, 1 = enter email, 2 = enter OTP, 3 = set new password
  const [forgotStep, setForgotStep] = useState<0 | 1 | 2 | 3>(0)
  // false = signup form, true = verify the code sent to signupData.email
  const [signupOtpStep, setSignupOtpStep] = useState(false)
  const [signupOtp, setSignupOtp] = useState("")
  const [forgotEmail, setForgotEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [newPwd, setNewPwd] = useState({ password: "", confirmPassword: "" })
  const [showNewPwd, setShowNewPwd] = useState(false)
  const [showNewPwd2, setShowNewPwd2] = useState(false)
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

  const handleSignup = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setLoading(true)
    setError("")
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }
    try {
      await apiFetch<any>(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: signupData.name, email: signupData.email, password: signupData.password }),
      }, { toastId: "auth:register" })
      setSignupOtp("")
      setSignupOtpStep(true)
    } catch (err: any) {
      setError(err?.message || "Network error")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifySignupOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const data = await apiFetch<any>(`${API_BASE}/api/auth/register/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupData.email, otp: signupOtp }),
      }, { toastId: "auth:register-verify" })
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

  const backToSignupForm = () => {
    setSignupOtpStep(false)
    setError("")
  }

  const openForgot = () => {
    setForgotStep(1)
    setForgotEmail(loginData.email)
    setOtp("")
    setResetToken("")
    setNewPwd({ password: "", confirmPassword: "" })
    setError("")
  }

  const closeForgot = () => {
    setForgotStep(0)
    setError("")
  }

  const sendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setLoading(true)
    setError("")
    try {
      await apiFetch<any>(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      }, { toastId: "auth:forgot" })
      setOtp("")
      setForgotStep(2)
    } catch (err: any) {
      setError(err?.message || "Network error")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const data = await apiFetch<any>(`${API_BASE}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp }),
      }, { toastId: "auth:verify-otp" })
      setResetToken(data.resetToken)
      setForgotStep(3)
    } catch (err: any) {
      setError(err?.message || "Network error")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPwd.password !== newPwd.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    setError("")
    try {
      await apiFetch<any>(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, password: newPwd.password }),
      }, { toastId: "auth:reset-password" })
      setForgotStep(0)
      setTab("login")
      setLoginData({ email: forgotEmail, password: "" })
    } catch (err: any) {
      setError(err?.message || "Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex font-sans" style={{ background: "#f5f7fa" }}>
{/* Neurocruit logo (white) — pinned to top-right of the panel */}
        <div className="absolute top-10 right-12 z-30">
          <Image
            src="/neurocruit_logo_rectangle.png"
            alt="Neurocruit"
            width={190}
            height={76}
            priority
          />
        </div>
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
          {forgotStep === 0 && !signupOtpStep && (
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
          )}

          {/* ── Forgot password heading ── */}
          {forgotStep > 0 && (
            <div className="mb-7">
              <h1 className="text-xl font-bold text-[#165dd3]">
                {forgotStep === 1 && "Forgot password?"}
                {forgotStep === 2 && "Enter verification code"}
                {forgotStep === 3 && "Set a new password"}
              </h1>
              <p className="text-sm text-gray-500 mt-1.5">
                {forgotStep === 1 && "Enter your email and we'll send you a 6-digit code."}
                {forgotStep === 2 && `We sent a 6-digit code to ${forgotEmail}. It expires in 10 minutes.`}
                {forgotStep === 3 && "Choose a new password for your account."}
              </p>
            </div>
          )}

          {/* ── Signup verification heading ── */}
          {forgotStep === 0 && signupOtpStep && (
            <div className="mb-7">
              <h1 className="text-xl font-bold text-[#165dd3]">Verify your email</h1>
              <p className="text-sm text-gray-500 mt-1.5">
                {`We sent a 6-digit code to ${signupData.email}. It expires in 10 minutes.`}
              </p>
            </div>
          )}

          {/* ── Social login buttons ── */}
          { /*<div className="flex flex-col gap-3 mb-5">
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
          </div> */ }

          {/* OR divider */}
          {/* <div className="flex items-center gap-3 mb-5">
            <span className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <span className="flex-1 h-px bg-gray-200" />
          </div> */}

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {forgotStep === 0 && !signupOtpStep && tab === "login" && (
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
                  <button type="button" onClick={openForgot} className="text-xs font-medium hover:underline" style={{ color: BRAND }}>
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
                <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300 accent-[#155dfc]" />
                <label htmlFor="remember">Remember me</label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-full text-sm font-bold tracking-wide mt-1 hover:opacity-90 transition-opacity"
                style={{ background: BRAND_BTN }}
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
          {forgotStep === 0 && !signupOtpStep && tab === "signup" && (
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
                style={{ background: BRAND_BTN }}
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

          {/* ── SIGNUP · VERIFY EMAIL ── */}
          {forgotStep === 0 && signupOtpStep && (
            <form onSubmit={handleVerifySignupOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Verification Code
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  className="h-11 rounded-lg border-gray-200 text-center text-lg font-semibold tracking-[0.5em]"
                  value={signupOtp}
                  onChange={(e) => setSignupOtp(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-full text-sm font-bold tracking-wide mt-1 hover:opacity-90 transition-opacity"
                style={{ background: BRAND_BTN }}
                disabled={loading || signupOtp.length !== 6}
              >
                {loading ? "Verifying…" : "Verify & Create Account"}
              </Button>

              <p className="text-center text-sm text-gray-500 pt-1">
                Didn&apos;t get the code?{" "}
                <button type="button" onClick={() => handleSignup()} disabled={loading} className="font-semibold hover:underline disabled:opacity-50" style={{ color: BRAND }}>
                  Resend
                </button>
              </p>

              <p className="text-center text-sm text-gray-500">
                <button type="button" onClick={backToSignupForm} className="font-semibold hover:underline" style={{ color: BRAND }}>
                  Back
                </button>
              </p>
            </form>
          )}

          {/* ── FORGOT PASSWORD · STEP 1 — email ── */}
          {forgotStep === 1 && (
            <form onSubmit={sendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Enter your registered email"
                  className="h-11 rounded-lg border-gray-200 text-sm"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-full text-sm font-bold tracking-wide mt-1 hover:opacity-90 transition-opacity"
                style={{ background: BRAND_BTN }}
                disabled={loading}
              >
                {loading ? "Sending code…" : "Send Verification Code"}
              </Button>

              <p className="text-center text-sm text-gray-500 pt-1">
                Remembered your password?{" "}
                <button type="button" onClick={closeForgot} className="font-semibold hover:underline" style={{ color: BRAND }}>
                  Back to Login
                </button>
              </p>
            </form>
          )}

          {/* ── FORGOT PASSWORD · STEP 2 — OTP ── */}
          {forgotStep === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Verification Code
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  className="h-11 rounded-lg border-gray-200 text-center text-lg font-semibold tracking-[0.5em]"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-full text-sm font-bold tracking-wide mt-1 hover:opacity-90 transition-opacity"
                style={{ background: BRAND_BTN }}
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying…" : "Verify Code"}
              </Button>

              <p className="text-center text-sm text-gray-500 pt-1">
                Didn&apos;t get the code?{" "}
                <button type="button" onClick={() => sendOtp()} disabled={loading} className="font-semibold hover:underline disabled:opacity-50" style={{ color: BRAND }}>
                  Resend
                </button>
              </p>

              <p className="text-center text-sm text-gray-500">
                <button type="button" onClick={closeForgot} className="font-semibold hover:underline" style={{ color: BRAND }}>
                  Back to Login
                </button>
              </p>
            </form>
          )}

          {/* ── FORGOT PASSWORD · STEP 3 — new password ── */}
          {forgotStep === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showNewPwd ? "text" : "password"}
                    placeholder="Create a new password"
                    className="h-11 pr-10 rounded-lg border-gray-200 text-sm"
                    value={newPwd.password}
                    onChange={(e) => setNewPwd({ ...newPwd, password: e.target.value })}
                    minLength={6}
                    required
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowNewPwd(!showNewPwd)}>
                    {showNewPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    type={showNewPwd2 ? "text" : "password"}
                    placeholder="Re-enter your new password"
                    className="h-11 pr-10 rounded-lg border-gray-200 text-sm"
                    value={newPwd.confirmPassword}
                    onChange={(e) => setNewPwd({ ...newPwd, confirmPassword: e.target.value })}
                    minLength={6}
                    required
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowNewPwd2(!showNewPwd2)}>
                    {showNewPwd2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-full text-sm font-bold tracking-wide mt-1 hover:opacity-90 transition-opacity"
                style={{ background: BRAND_BTN }}
                disabled={loading}
              >
                {loading ? "Updating…" : "Update Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
