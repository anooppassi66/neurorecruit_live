"use client";

import Link from "next/link";
import Image from "next/image";
import { ShootingStars } from "../components/ShootingStars";
import { StarsBackground } from "../components/StarsBackground";

/* ───────── SVG Icons ───────── */

type IconProps = { className?: string; style?: React.CSSProperties };

function SparklesIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

function BrainCircuitIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  );
}

function TargetIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function ZapIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

function ShieldIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ArrowRightIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ClipboardIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function SearchIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChartIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="m7 11 4-4 4 4 6-6" />
    </svg>
  );
}

function CheckCircleIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" />
    </svg>
  );
}

function UsersIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function FileTextIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
    </svg>
  );
}

function DownloadIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function CodeIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function GraduationCapIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  );
}

function BriefcaseIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  );
}

/* ───────── Data ───────── */

const features = [
  {
    icon: BrainCircuitIcon,
    title: "AI-Powered JD Analysis",
    description: "Powered by Claude AI, our engine reads your job description and automatically extracts skills, programming languages, experience requirements, and job titles.",
    iconColor: "#7C3AED",
    borderColor: "rgba(124, 58, 237, 0.15)",
  },
  {
    icon: TargetIcon,
    title: "Smart Match Scoring",
    description: "Every resume gets a weighted score: 60% skills match, 20% experience alignment, 20% language proficiency — normalized to a clear 0–100 score.",
    iconColor: "#0891B2",
    borderColor: "rgba(8, 145, 178, 0.15)",
  },
  {
    icon: FileTextIcon,
    title: "Resume Viewer & Download",
    description: "View matched resumes as PDFs directly in your browser or download them instantly. All files served securely from AWS S3.",
    iconColor: "#059669",
    borderColor: "rgba(5, 150, 105, 0.15)",
  },
  {
    icon: ZapIcon,
    title: "Instant Results",
    description: "From paste to ranked results in under 3 seconds. No manual filtering, no spreadsheet wrangling — just AI-ranked candidates.",
    iconColor: "#D97706",
    borderColor: "rgba(217, 119, 6, 0.15)",
  },
  {
    icon: CodeIcon,
    title: "AI + Manual Modes",
    description: "Let AI extract everything automatically, or switch to manual mode to fine-tune with your own job title, skills, languages, and experience filters.",
    iconColor: "#E11D48",
    borderColor: "rgba(225, 29, 72, 0.15)",
  },
  {
    icon: ShieldIcon,
    title: "Enterprise-Grade Security",
    description: "JWT authentication, encrypted credentials, and GDPR-compliant data handling. Your data stays protected end to end.",
    iconColor: "#2563EB",
    borderColor: "rgba(37, 99, 235, 0.15)",
  },
];

const stats = [
  { value: "10K+", label: "Resumes Matched" },
  { value: "95%", label: "Match Accuracy" },
  { value: "500+", label: "Recruiters" },
  { value: "<3s", label: "Average Match Time" },
];

const steps = [
  {
    icon: ClipboardIcon,
    step: "01",
    title: "Paste Your Job Description",
    description: "Drop in any JD. Our AI engine powered by Claude reads the full context — understanding skills, languages, experience, and role nuances automatically.",
    color: "#7C3AED",
  },
  {
    icon: SearchIcon,
    step: "02",
    title: "AI Matches & Ranks",
    description: "The neural engine scans your resume database, scores each candidate on skills (60%), experience (20%), and languages (20%), then ranks them instantly.",
    color: "#0891B2",
  },
  {
    icon: ChartIcon,
    step: "03",
    title: "Review, View & Download",
    description: "See ranked results with match scores, extracted requirements, and skill breakdowns. View or download any resume PDF directly from the dashboard.",
    color: "#059669",
  },
];

const aiExtractedTags = [
  { label: "Job Title", example: "Senior Full Stack Developer", color: "#7C3AED" },
  { label: "Skills", example: "React, Node.js, AWS, Docker, CI/CD", color: "#0891B2" },
  { label: "Languages", example: "JavaScript, Python, TypeScript", color: "#059669" },
  { label: "Experience", example: "5+ years", color: "#D97706" },
];

const trustPoints = [
  "No credit card required",
  "GDPR compliant",
  "Results in under 3 seconds",
  "Cancel anytime",
];

const forStudents = [
  "Upload your resume and get discovered by recruiters",
  "See how well you match real job descriptions",
  "Understand which skills make you stand out",
];

const forRecruiters = [
  "Paste any JD and get ranked candidates instantly",
  "AI extracts requirements — no manual tagging needed",
  "View & download matched resumes as PDFs",
];

/* ───────── Component ───────── */

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#FFFFFF" }}>

      {/* Stars + Shooting Stars */}
      <div className="fixed inset-0 z-0">
        <StarsBackground starDensity={0.0004} />
        <ShootingStars
          starColor="#1E293B"
          trailColor="#7C3AED"
          minSpeed={15}
          maxSpeed={35}
          minDelay={2000}
          maxDelay={5000}
          starWidth={12}
          starHeight={1}
        />
      </div>

      {/* Gradient overlays */}
      <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, rgba(8,145,178,0.3) 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, rgba(217,119,6,0.2) 0%, transparent 70%)" }} />
      </div>

      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 mx-auto max-w-6xl" style={{ animation: "fade-in 0.6s ease-out" }}>
        <div className="mx-4 mt-4 flex items-center justify-between rounded-2xl px-6 py-3.5"
          style={{
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}>
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <Image src="/neurocruit_logo_rectangle.png" alt="Neurocruit" width={250} height={100} className="rounded" />
            {/* <span className="text-xl font-bold tracking-tight" style={{ color: "#0F172A" }}>
              Neuro<span style={{ color: "#7C3AED" }}>cruit</span>
            </span> */}
          </Link>
          <div className="flex items-center gap-3">
            <Link href="https://recruit.neurocruit.ai/signup"
              className="px-5 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors duration-200 hover:opacity-80"
              style={{ color: "#D97706" }}>
              Recruiters
            </Link>
            <Link href="https://recruit.neurocruit.ai/signup"
              className="px-5 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors duration-200 hover:opacity-80"
              style={{ color: "#059669" }}>
              New Hire
            </Link>
            <Link href="/join-now"
              className="px-5 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors duration-200 hover:opacity-80"
              style={{ color: "#475569" }}>
              Sign In
            </Link>
            <Link href="/join-now"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                boxShadow: "0 2px 12px rgba(124,58,237,0.25)",
              }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-24 pb-16 text-center"
        style={{ animation: "fade-in-up 0.8s ease-out" }}>

        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10 text-sm font-medium cursor-default"
          style={{
            background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)",
            color: "#7C3AED", backdropFilter: "blur(8px)",
          }}>
          <SparklesIcon className="w-4 h-4" />
          AI-Powered Talent Intelligence
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-[5.25rem] font-bold leading-[1.08] tracking-tight mb-7" style={{ color: "#0F172A" }}>
          Connect Talent with
          <br />
          <span style={{
            background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 40%, #0891B2 70%, #D97706 100%)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "gradient-shift 6s ease infinite",
          }}>
            Opportunities
          </span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: "#64748B" }}>
          Paste a job description and watch AI extract requirements, scan your resume database,
          and rank the best candidates — all in under 3 seconds.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap mb-8">
          <Link href="https://recruit.neurocruit.ai/signup"
            className="group inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl text-base font-semibold text-white cursor-pointer transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
              boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
            }}>
            Start Matching Free
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link href="/join-now"
            className="inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl text-base font-medium cursor-pointer transition-all duration-300 hover:bg-black/[0.04]"
            style={{
              color: "#475569", background: "rgba(0,0,0,0.02)",
              border: "1px solid rgba(0,0,0,0.08)", backdropFilter: "blur(8px)",
            }}>
            Sign In to Dashboard
          </Link>
          <Link href="https://recruit.neurocruit.ai/signup"
            className="inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl text-base font-medium cursor-pointer transition-all duration-300 hover:bg-amber-50"
            style={{
              color: "#D97706", background: "rgba(217,119,6,0.05)",
              border: "1px solid rgba(217,119,6,0.15)", backdropFilter: "blur(8px)",
            }}>
            <BriefcaseIcon className="w-4 h-4" />
            Recruiters
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 flex-wrap">
          {trustPoints.map((point) => (
            <div key={point} className="flex items-center gap-1.5 text-sm" style={{ color: "#94A3B8" }}>
              <CheckCircleIcon className="w-3.5 h-3.5" style={{ color: "#059669" }} />
              {point}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-24"
        style={{ animation: "fade-in-up 0.8s ease-out 0.15s both" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label}
              className="text-center p-6 rounded-2xl cursor-default transition-all duration-300 hover:bg-violet-50/50 hover:shadow-md"
              style={{
                background: "rgba(0,0,0,0.01)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}>
              <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: "#0F172A" }}>{stat.value}</div>
              <div className="text-sm" style={{ color: "#94A3B8" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-28">
        <div className="text-center mb-16" style={{ animation: "fade-in-up 0.7s ease-out 0.2s both" }}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#7C3AED" }}>Features</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-5" style={{ color: "#0F172A" }}>
            Everything You Need to<br className="hidden md:block" /> Hire Smarter
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#64748B" }}>
            From AI analysis to secure resume delivery — the complete recruitment toolkit.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <div key={feature.title}
              className="group relative p-7 rounded-2xl cursor-default transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)",
                border: `1px solid ${feature.borderColor}`,
                animation: `fade-in-up 0.5s ease-out ${0.3 + i * 0.08}s both`,
              }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${feature.iconColor}10`, border: `1px solid ${feature.borderColor}` }}>
                <feature.icon className="w-5 h-5" style={{ color: feature.iconColor }} />
              </div>
              <h3 className="text-lg font-semibold mb-2.5" style={{ color: "#0F172A" }}>{feature.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-28">
        <div className="text-center mb-16" style={{ animation: "fade-in-up 0.7s ease-out 0.2s both" }}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#0891B2" }}>How It Works</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-5" style={{ color: "#0F172A" }}>Three Simple Steps</h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#64748B" }}>
            From job description to ranked candidates in under a minute.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((item, i) => (
            <div key={item.step}
              className="relative text-center p-8 rounded-2xl cursor-default transition-all duration-300 hover:shadow-lg"
              style={{
                background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(0,0,0,0.06)",
                animation: `fade-in-up 0.5s ease-out ${0.3 + i * 0.12}s both`,
              }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                style={{ background: `${item.color}10`, border: `1px solid ${item.color}20` }}>
                <item.icon className="w-7 h-7" style={{ color: item.color }} />
              </div>
              <div className="text-xs font-bold tracking-[0.15em] uppercase mb-3" style={{ color: item.color }}>
                Step {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: "#0F172A" }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{item.description}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2" aria-hidden="true">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#CBD5E1" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── For Students & Recruiters ─── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-28">
        <div className="text-center mb-14" style={{ animation: "fade-in-up 0.7s ease-out 0.2s both" }}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#059669" }}>Built for Both Sides</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-5" style={{ color: "#0F172A" }}>
            Employees & Recruiters
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6" style={{ animation: "fade-in-up 0.7s ease-out 0.35s both" }}>
          {/* Students */}
          <div className="p-8 rounded-2xl transition-all duration-300 hover:shadow-lg"
            style={{
              background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(124,58,237,0.12)",
            }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.12)" }}>
                <GraduationCapIcon className="w-6 h-6" style={{ color: "#7C3AED" }} />
              </div>
              <h3 className="text-xl font-semibold" style={{ color: "#0F172A" }}>For Employees</h3>
            </div>
            <ul className="space-y-3">
              {forStudents.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircleIcon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#7C3AED" }} />
                  <span className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recruiters */}
          <div className="p-8 rounded-2xl transition-all duration-300 hover:shadow-lg"
            style={{
              background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(8,145,178,0.12)",
            }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(8,145,178,0.08)", border: "1px solid rgba(8,145,178,0.12)" }}>
                <BriefcaseIcon className="w-6 h-6" style={{ color: "#0891B2" }} />
              </div>
              <h3 className="text-xl font-semibold" style={{ color: "#0F172A" }}>For Recruiters</h3>
            </div>
            <ul className="space-y-3">
              {forRecruiters.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircleIcon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#0891B2" }} />
                  <span className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── Dashboard Preview ─── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-28">
        <div className="text-center mb-14" style={{ animation: "fade-in-up 0.7s ease-out 0.2s both" }}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#E11D48" }}>Dashboard Preview</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-5" style={{ color: "#0F172A" }}>
            See Results at a Glance
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#64748B" }}>
            Your dashboard shows AI-extracted requirements, ranked candidates with match scores,
            and one-click resume access.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{
          background: "#FAFAFA", border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          animation: "fade-in-up 0.7s ease-out 0.35s both",
        }}>
          {/* Mock header */}
          <div className="flex items-center gap-2 px-5 py-3" style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <div className="w-3 h-3 rounded-full" style={{ background: "#EF4444" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#FBBF24" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#22C55E" }} />
            <span className="ml-3 text-xs" style={{ color: "#94A3B8" }}>Neurocruit Dashboard</span>
          </div>

          <div className="p-6 space-y-4">
            {/* Extracted reqs */}
            <div className="p-4 rounded-xl" style={{ background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.1)" }}>
              <div className="flex items-center gap-2 mb-3">
                <SparklesIcon className="w-3.5 h-3.5" style={{ color: "#7C3AED" }} />
                <span className="text-xs font-semibold" style={{ color: "#0F172A" }}>AI-Extracted Requirements</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["React", "Node.js", "AWS", "Docker"].map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded text-[11px] font-medium"
                    style={{ background: "rgba(124,58,237,0.08)", color: "#7C3AED", border: "1px solid rgba(124,58,237,0.12)" }}>{s}</span>
                ))}
                {["JavaScript", "Python"].map((l) => (
                  <span key={l} className="px-2 py-0.5 rounded text-[11px] font-medium"
                    style={{ background: "rgba(5,150,105,0.08)", color: "#059669", border: "1px solid rgba(5,150,105,0.12)" }}>{l}</span>
                ))}
                <span className="px-2 py-0.5 rounded text-[11px] font-medium"
                  style={{ background: "rgba(217,119,6,0.08)", color: "#D97706", border: "1px solid rgba(217,119,6,0.12)" }}>5+ yrs</span>
              </div>
            </div>

            {/* Mock results */}
            {[
              { name: "alex_chen_resume.pdf", title: "Senior Full Stack Developer", score: 92, yrs: 6 },
              { name: "priya_sharma_cv.pdf", title: "Full Stack Engineer", score: 85, yrs: 5 },
              { name: "james_wilson_resume.pdf", title: "Software Developer", score: 71, yrs: 4 },
            ].map((r, i) => (
              <div key={r.name} className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: "rgba(0,0,0,0.01)", border: "1px solid rgba(0,0,0,0.05)" }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: i === 0 ? "rgba(124,58,237,0.1)" : "rgba(0,0,0,0.03)",
                    color: i === 0 ? "#7C3AED" : "#94A3B8",
                  }}>
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <FileTextIcon className="w-3.5 h-3.5 shrink-0" style={{ color: "#94A3B8" }} />
                    <span className="text-sm font-medium truncate" style={{ color: "#0F172A" }}>{r.name}</span>
                  </div>
                  <span className="text-xs" style={{ color: "#94A3B8" }}>{r.title} &middot; {r.yrs} yrs</span>
                </div>
                {/* Score ring */}
                <div className="relative w-11 h-11 shrink-0">
                  <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                    <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="3" />
                    <circle cx="22" cy="22" r="18" fill="none"
                      stroke={r.score >= 80 ? "#059669" : r.score >= 60 ? "#7C3AED" : "#D97706"}
                      strokeWidth="3"
                      strokeDasharray={`${(r.score / 100) * 113} 113`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold"
                      style={{ color: r.score >= 80 ? "#059669" : r.score >= 60 ? "#7C3AED" : "#D97706" }}>
                      {r.score}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-black/[0.04]"
                    style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)" }}>
                    <FileTextIcon className="w-3.5 h-3.5" style={{ color: "#64748B" }} />
                  </div>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-black/[0.04]"
                    style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)" }}>
                    <DownloadIcon className="w-3.5 h-3.5" style={{ color: "#64748B" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-28">
        <div className="relative overflow-hidden text-center p-12 md:p-16 rounded-3xl"
          style={{
            background: "rgba(124,58,237,0.04)",
            border: "1px solid rgba(124,58,237,0.12)",
            boxShadow: "0 8px 40px rgba(124,58,237,0.06)",
          }}>
          <div className="absolute inset-0 opacity-20" aria-hidden="true"
            style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.1) 0%, transparent 60%)" }} />
          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#D97706" }}>Get Started Today</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-5" style={{ color: "#0F172A" }}>
              Ready to Transform<br className="hidden md:block" /> Your Hiring?
            </h2>
            <p className="text-base md:text-lg mb-10 max-w-lg mx-auto" style={{ color: "#64748B" }}>
              Join thousands of employees and recruiters already using Neurocruit
              to make smarter, faster hiring decisions.
            </p>
            <Link href="/join-now"
              className="group inline-flex items-center gap-2.5 px-10 py-4.5 rounded-2xl text-base font-semibold text-white cursor-pointer transition-all duration-300 hover:shadow-[0_0_50px_rgba(124,58,237,0.4)] hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                boxShadow: "0 4px 24px rgba(124,58,237,0.3)",
              }}>
              Create Free Account
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 py-10 px-6" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/neurocruit_logo_rectangle.png" alt="Neurocruit" width={250} height={100} className="rounded-sm" />
            {/* <span className="text-sm font-semibold" style={{ color: "#0F172A" }}>
              Neuro<span style={{ color: "#7C3AED" }}>cruit</span>
            </span> */}
          </div>
          <p className="text-xs" style={{ color: "#94A3B8" }}>
            &copy; {new Date().getFullYear()} Neurocruit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
