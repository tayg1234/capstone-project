"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { UserCircle, LogOut, Calendar, Home } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileNav } from "@/components/mobile-nav"

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  const handleLogout = async () => {
    await logout()
    toast({
      title: "로그아웃 성공",
      description: "성공적으로 로그아웃되었습니다.",
    })
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white dark:bg-slate-950 sticky top-0 z-10 hidden md:block">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl">
            스마트 좌석
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center space-x-4">
              <Link
                href="/customer"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/customer"
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                식당 목록
              </Link>
              <Link
                href="/customer/bookings"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/customer/bookings"
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                }`}
              >
                <Calendar className="h-4 w-4 mr-2" />내 예약
              </Link>
            </nav>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <UserCircle className="h-5 w-5" />
                  {user && (
                    <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user ? (
                  <>
                    <DropdownMenuItem disabled>{user.name}</DropdownMenuItem>
                    <DropdownMenuItem disabled>{user.email}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/customer">식당 목록</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/customer/bookings">내 예약</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/customer/profile">내 정보</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>로그아웃</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/login?role=customer">로그인</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-slate-50 dark:bg-slate-900">{children}</main>

      {/* 모바일 하단 네비게이션 */}
      <MobileNav />

      <footer className="border-t bg-white dark:bg-slate-950 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-slate-600">
          © {new Date().getFullYear()} 스마트 좌석 관리 시스템
        </div>
      </footer>
    </div>
  )
}
