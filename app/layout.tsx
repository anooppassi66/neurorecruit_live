import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import "aos/dist/aos.css";
import ClientAOSProvider from "@/components/ClientAOSProvider";
import ToastRoot from "@/components/ToastRoot";
import ReduxProvider from "@/components/ReduxProvider";

const inter = Inter({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Neurocruit Recruit - Connect Talent with Opportunities",
  description: "Smart AI matching to connect job seekers and recruiters faster, better, smarter.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ClientAOSProvider />
        <ReduxProvider>
          <ToastRoot />
          {children}
        </ReduxProvider>
        <Analytics />
        <footer className="app-footer" style={{
    textAlign: "center",
    padding: "1rem 0",
    fontSize: ".9rem"
        }}><p>Made with ❤ By <a href="http://www.kkeydos.com" target="_blank" style={{ textDecoration: "underline" }}>KKEYDOS</a></p></footer>
      </body>
    </html>
  )
}
