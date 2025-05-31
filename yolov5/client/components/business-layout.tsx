"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Settings, Store, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
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
      <header className="border-b bg-white dark:bg-slate-950 sticky top-0 z-10">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl flex items-center">
            <Store className="h-5 w-5 mr-2" />
            스마트 좌석 비즈니스
          </Link>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>비즈니스 계정</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user ? (
                  <>
                    <DropdownMenuItem disabled>{user.name}</DropdownMenuItem>
                    <DropdownMenuItem disabled>{user.email}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>로그아웃</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/login?role=business">로그인</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-slate-50 dark:bg-slate-900">{children}</main>

      <footer className="border-t bg-white dark:bg-slate-950 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-slate-600">
          © {new Date().getFullYear()} 스마트 좌석 관리 시스템
        </div>
      </footer>
    </div>
  )
}
