"use client"

import Link from "next/link"
import { Twitter, Mail, Instagram } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/neurocruit-logo.jpg"
                alt="NEUROCRUIT"
                width={200}
                height={140}
                className="mt-3"
                priority
              />
            </Link>
            <p className="text-gray-400 text-sm font-medium">Future of Hiring</p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4 text-white-600">Products</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-indigo-600 transition text-sm font-medium">
                  For Job seekers
                </Link>
              </li>
              <li>
                <Link href="https://recruit.neurocruit.ai/signup" className="text-gray-400 hover:text-indigo-600 transition text-sm font-medium">
                  For Recruiters
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-indigo-600 transition text-sm font-medium">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          {/* <div>
            <h4 className="font-semibold mb-4 text-white-600">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-indigo-600 transition text-sm font-medium">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-indigo-600 transition text-sm font-medium">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-indigo-600 transition text-sm font-medium">
                  Careers
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white-600">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-indigo-600 transition text-sm font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-indigo-600 transition text-sm font-medium">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm font-medium">© 2025 Neurocruit Recruit. All rights reserved.</p>
            <p className="text-gray-400 text-sm font-medium">
              <a href="https://www.kkeydos.com/" target="_blank">Made with ❤️ By Kkeydos</a>
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-indigo-600 transition">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-indigo-600 transition">
                <Mail className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-indigo-600 transition">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
