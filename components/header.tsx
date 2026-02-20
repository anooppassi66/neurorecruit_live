"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { logout, setCredentials } from "@/store/authSlice"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const dispatch = useDispatch()
  const tokenFromStore = useSelector((s: RootState) => s.auth.token)
  const userFromStore = useSelector((s: RootState) => s.auth.user)

  useEffect(() => {
    const token = tokenFromStore || localStorage.getItem('token')
    const userData = userFromStore || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null)
    if (token && userData) {
      setUser(userData)
      if (!userFromStore) {
        dispatch(setCredentials({ token, user: userData }))
      }
    } else {
      setUser(null)
    }
  }, [tokenFromStore, userFromStore, dispatch])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    dispatch(logout())
    router.push('/')
  }

  const isHide = pathname === '/my-profile'
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/neurocruit-logo.png"
              alt="NEUROCRUIT"
              width={100}
              height={90}
              className="mt-2"
              priority
            />
          </Link>

          {/* Navigation */}
          {/* <nav className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
              Home
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
              About
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
              Services
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
              Login
            </Link>
          </nav> */}

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-2 rounded-md border px-2 py-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt={user.name || "User"} />
                      <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuItem onClick={() => router.push('/my-profile')}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              !isHide && (
                <Link href="/join-now">
                  <Button className="text-indigo-600 text-white font-medium">
                    Join Now
                  </Button>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
