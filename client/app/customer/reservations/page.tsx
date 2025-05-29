"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import CustomerLayout from "@/components/customer-layout"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Utensils } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// 예약 인터페이스 정의
interface ReservationMenuItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface Reservation {
  id: number
  restaurantName: string
  date: string
  time: string
  seats: string[]
  status: "pending" | "confirmed" | "completed" | "cancelled"
  menuItems: ReservationMenuItem[]
  totalAmount: number
}

export default function ReservationsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  // 예약 목데이터
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 1,
      restaurantName: "맛있는 비스트로",
      date: "2023-06-20",
      time: "18:30",
      seats: ["A1", "A2"],
      status: "confirmed",
      menuItems: [
        { id: 1, name: "마르게리타 피자", price: 15000, quantity: 1 },
        { id: 2, name: "스파게티 카르보나라", price: 16000, quantity: 2 },
      ],
      totalAmount: 47000,
    },
    {
      id: 2,
      restaurantName: "스시 파라다이스",
      date: "2023-06-25",
      time: "19:00",
      seats: ["B3"],
      status: "pending",
      menuItems: [
        { id: 5, name: "모듬 초밥", price: 25000, quantity: 1 },
        { id: 6, name: "미소 된장국", price: 3000, quantity: 1 },
      ],
      totalAmount: 28000,
    },
    {
      id: 3,
      restaurantName: "스파이스 가든",
      date: "2023-06-15",
      time: "20:00",
      seats: ["C4", "C5"],
      status: "completed",
      menuItems: [
        { id: 7, name: "치킨 커리", price: 18000, quantity: 1 },
        { id: 8, name: "난", price: 3000, quantity: 2 },
        { id: 9, name: "라씨", price: 5000, quantity: 2 },
      ],
      totalAmount: 34000,
    },
    {
      id: 4,
      restaurantName: "맛있는 비스트로",
      date: "2023-06-10",
      time: "12:30",
      seats: ["D2"],
      status: "cancelled",
      menuItems: [
        { id: 3, name: "티라미수", price: 8000, quantity: 1 },
        { id: 4, name: "카프레제 샐러드", price: 12000, quantity: 1 },
      ],
      totalAmount: 20000,
    },
  ])

  // 인증 확인
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "접근 제한",
        description: "로그인이 필요한 페이지입니다.",
        variant: "destructive",
      })
      router.push("/login?role=customer")
    } else if (!isLoading && user?.role !== "customer") {
      toast({
        title: "접근 제한",
        description: "고객 계정으로만 접근 가능합니다.",
        variant: "destructive",
      })
      router.push("/")
    }
  }, [isLoading, isAuthenticated, user, router, toast])

  // 예약 취소 처리
  const handleCancelReservation = (id: number) => {
    setCancelLoading(true)

    // 실제로는 API 호출을 통해 예약 취소
    setTimeout(() => {
      setReservations(
        reservations.map((reservation) =>
          reservation.id === id ? { ...reservation, status: "cancelled" } : reservation,
        ),
      )

      toast({
        title: "예약 취소 완료",
        description: "예약이 성공적으로 취소되었습니다.",
      })

      setCancelLoading(false)
      setShowDetailDialog(false)
    }, 1000)
  }

  // 예약 상세 정보 보기
  const viewReservationDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setShowDetailDialog(true)
  }

  // 상태에 따른 배지 스타일
  const getStatusBadge = (status: Reservation["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            대기 중
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            확정됨
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            완료됨
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            취소됨
          </Badge>
        )
    }
  }

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(date)
  }

  // 로딩 중이거나 인증되지 않은 경우 빈 페이지 반환
  if (isLoading || !isAuthenticated || user?.role !== "customer") {
    return null
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">내 예약</h1>
          <p className="text-slate-600">예약 내역을 확인하고 관리하세요</p>
        </div>

        <div className="space-y-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{reservation.restaurantName}</CardTitle>
                  {getStatusBadge(reservation.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1 text-slate-500" />
                    <span>{formatDate(reservation.date)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1 text-slate-500" />
                    <span>{reservation.time}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-1 text-slate-500" />
                    <span>좌석: {reservation.seats.join(", ")}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Utensils className="h-4 w-4 mr-1 text-slate-500" />
                    <span>
                      메뉴: {reservation.menuItems.length}개 항목 ({formatPrice(reservation.totalAmount)})
                    </span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={() => viewReservationDetails(reservation)}>
                      상세 정보
                    </Button>
                    {(reservation.status === "pending" || reservation.status === "confirmed") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200"
                        onClick={() => handleCancelReservation(reservation.id)}
                      >
                        예약 취소
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 예약 상세 정보 다이얼로그 */}
        {selectedReservation && (
          <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>예약 상세 정보</DialogTitle>
                <DialogDescription>예약 번호: #{selectedReservation.id}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{selectedReservation.restaurantName}</h3>
                  {getStatusBadge(selectedReservation.status)}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">예약 날짜:</span>
                    <span>{formatDate(selectedReservation.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">예약 시간:</span>
                    <span>{selectedReservation.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">좌석:</span>
                    <span>{selectedReservation.seats.join(", ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">인원:</span>
                    <span>{selectedReservation.seats.length}명</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">주문 메뉴</h4>
                  <div className="space-y-2 text-sm">
                    {selectedReservation.menuItems.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                      <span>총 금액:</span>
                      <span>{formatPrice(selectedReservation.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                {(selectedReservation.status === "pending" || selectedReservation.status === "confirmed") && (
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200"
                    onClick={() => handleCancelReservation(selectedReservation.id)}
                    disabled={cancelLoading}
                  >
                    {cancelLoading ? "취소 중..." : "예약 취소"}
                  </Button>
                )}
                <Button onClick={() => setShowDetailDialog(false)}>닫기</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </CustomerLayout>
  )
}
