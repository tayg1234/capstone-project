"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BusinessLayout from "@/components/business-layout"
import { LiveSeatMonitor } from "@/components/live-seat-monitor"
import { BusinessStats } from "@/components/business-stats"
import { ReservationList } from "@/components/reservation-list"
import { CameraManager } from "@/components/camera-manager"
import { MenuManager } from "@/components/menu-manager"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"

export default function BusinessPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // 인증 확인
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "접근 제한",
        description: "로그인이 필요한 페이지입니다.",
        variant: "destructive",
      })
      router.push("/login?role=business")
    } else if (!isLoading && user?.role !== "business") {
      toast({
        title: "접근 제한",
        description: "사업자 계정으로만 접근 가능합니다.",
        variant: "destructive",
      })
      router.push("/")
    }
  }, [isLoading, isAuthenticated, user, router, toast])

  // 로딩 중이거나 인증되지 않은 경우 빈 페이지 반환
  if (isLoading || !isAuthenticated || user?.role !== "business") {
    return null
  }

  return (
    <BusinessLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">안녕하세요, {user?.name}님</h1>
            <p className="text-slate-600">비즈니스 대시보드에 오신 것을 환영합니다</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm">
              <p className="text-sm font-medium">
                오늘 예약: <span className="text-green-600">8건</span>
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="seats">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="seats">실시간 좌석</TabsTrigger>
            <TabsTrigger value="reservations">예약 관리</TabsTrigger>
            <TabsTrigger value="cameras">카메라 관리</TabsTrigger>
            <TabsTrigger value="menus">메뉴 관리</TabsTrigger>
            <TabsTrigger value="stats">통계</TabsTrigger>
          </TabsList>

          <TabsContent value="seats" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>실시간 좌석 모니터링</CardTitle>
                <CardDescription>CCTV와 OpenCV를 활용한 실시간 좌석 가용성</CardDescription>
              </CardHeader>
              <CardContent>
                <LiveSeatMonitor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservations" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>예정된 예약</CardTitle>
                <CardDescription>고객 예약 관리</CardDescription>
              </CardHeader>
              <CardContent>
                <ReservationList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cameras" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>카메라 관리</CardTitle>
                <CardDescription>CCTV 카메라 추가, 제거 및 설정</CardDescription>
              </CardHeader>
              <CardContent>
                <CameraManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menus" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>메뉴 관리</CardTitle>
                <CardDescription>메뉴 추가, 수정 및 제거</CardDescription>
              </CardHeader>
              <CardContent>
                <MenuManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>비즈니스 통계</CardTitle>
                <CardDescription>비즈니스에 대한 인사이트 확인</CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessStats />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BusinessLayout>
  )
}
