"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 이미 로그인한 사용자는 적절한 페이지로 리다이렉트
    if (isAuthenticated) {
      if (user?.role === "customer") {
        router.push("/customer")
      } else if (user?.role === "business") {
        router.push("/business")
      }
    }
  }, [isAuthenticated, user, router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">스마트 좌석 관리</h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
          OpenCV와 AI를 활용한 지능형 좌석 예약 및 관리 시스템으로 식당 경험을 혁신하세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>고객 포털</CardTitle>
              <CardDescription>식당 찾기, 메뉴 보기, 좌석 예약하기</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <User className="h-16 w-16 text-slate-600" />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Link href="/login?role=customer" className="w-full">
                <Button className="w-full">고객으로 로그인</Button>
              </Link>
              <Link href="/signup?role=customer" className="w-full">
                <Button variant="outline" className="w-full">
                  고객으로 가입하기
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>비즈니스 포털</CardTitle>
              <CardDescription>식당 관리, 좌석 모니터링, 통계 확인</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Store className="h-16 w-16 text-slate-600" />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Link href="/login?role=business" className="w-full">
                <Button className="w-full">사업자로 로그인</Button>
              </Link>
              <Link href="/signup?role=business" className="w-full">
                <Button variant="outline" className="w-full">
                  사업자로 가입하기
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">스마트 좌석 관리 시스템의 장점</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow">
              <h3 className="font-bold mb-2">실시간 좌석 모니터링</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                OpenCV를 활용한 CCTV 연동으로 좌석 상태를 자동으로 인식합니다.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow">
              <h3 className="font-bold mb-2">간편한 예약 시스템</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                고객은 원하는 식당과 좌석을 쉽게 선택하고 예약할 수 있습니다.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow">
              <h3 className="font-bold mb-2">비즈니스 인사이트</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                사업자는 통계 데이터를 통해 비즈니스 의사결정을 개선할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
