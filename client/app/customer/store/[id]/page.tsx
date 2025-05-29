"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CustomerLayout from "@/components/customer-layout"
import { MenuCard } from "@/components/menu-card"
import { SeatMap } from "@/components/seat-map"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Trash2, Calendar, Clock, MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
}

interface OrderItem extends MenuItem {
  quantity: number
}

export default function RestaurantPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("menu")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [selectedSeats, setSelectedSeats] = useState<{ id: number; label: string }[]>([])
  const [reservationDate, setReservationDate] = useState("")
  const [reservationTime, setReservationTime] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 식당 목데이터
  const restaurant = {
    id: Number.parseInt(params.id),
    name: "맛있는 비스트로",
    cuisine: "이탈리안",
    rating: 4.7,
    image: "/placeholder.svg?height=300&width=600",
    description: "정통 파스타와 피자를 제공하는 아늑한 이탈리안 비스트로입니다.",
    address: "서울시 강남구 123번길",
  }

  // 메뉴 목데이터
  const menuItems = [
    {
      id: 1,
      name: "마르게리타 피자",
      description: "토마토 소스, 모짜렐라, 바질을 곁들인 클래식 피자",
      price: 15000,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "스파게티 카르보나라",
      description: "계란, 치즈, 판체타, 후추를 곁들인 파스타",
      price: 16000,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "티라미수",
      description: "커피와 마스카포네를 곁들인 클래식 이탈리안 디저트",
      price: 8000,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      name: "카프레제 샐러드",
      description: "토마토, 모짜렐라, 바질, 발사믹 글레이즈",
      price: 12000,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 5,
      name: "레몬 소르베",
      description: "상큼한 레몬 맛의 이탈리안 소르베",
      price: 6000,
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  // 메뉴 추가 또는 수량 변경
  const handleAddToOrder = (item: MenuItem, quantity: number) => {
    const existingItemIndex = orderItems.findIndex((orderItem) => orderItem.id === item.id)

    if (existingItemIndex >= 0) {
      // 이미 있는 메뉴면 수량 업데이트
      const updatedOrderItems = [...orderItems]
      updatedOrderItems[existingItemIndex].quantity = quantity
      setOrderItems(updatedOrderItems)
      toast({
        title: "메뉴 수량 변경",
        description: `${item.name}의 수량이 ${quantity}개로 변경되었습니다.`,
      })
    } else {
      // 새 메뉴 추가
      setOrderItems([...orderItems, { ...item, quantity }])
      toast({
        title: "메뉴 추가",
        description: `${item.name} ${quantity}개가 주문에 추가되었습니다.`,
      })
    }
  }

  // 메뉴 제거
  const handleRemoveFromOrder = (itemId: number) => {
    setOrderItems(orderItems.filter((item) => item.id !== itemId))
    toast({
      title: "메뉴 제거",
      description: "선택한 메뉴가 주문에서 제거되었습니다.",
    })
  }

  // 좌석 선택 변경 처리
  const handleSeatsChange = (seats: { id: number; label: string }[]) => {
    setSelectedSeats(seats)
  }

  // 주문 총액 계산
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // 예약 제출
  const handleSubmitReservation = () => {
    if (orderItems.length === 0) {
      toast({
        title: "메뉴 선택 필요",
        description: "최소 하나 이상의 메뉴를 선택해주세요.",
        variant: "destructive",
      })
      setActiveTab("menu")
      return
    }

    if (selectedSeats.length === 0) {
      toast({
        title: "좌석 선택 필요",
        description: "좌석을 선택해주세요.",
        variant: "destructive",
      })
      setActiveTab("seats")
      return
    }

    if (!reservationDate || !reservationTime) {
      toast({
        title: "예약 정보 필요",
        description: "예약 날짜와 시간을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setShowConfirmation(true)
  }

  // 예약 확정
  const confirmReservation = () => {
    setIsSubmitting(true)

    // 실제로는 API 호출을 통해 예약 처리
    setTimeout(() => {
      setIsSubmitting(false)
      setShowConfirmation(false)

      toast({
        title: "예약 완료",
        description: "예약이 성공적으로 완료되었습니다.",
      })

      // 예약 정보 초기화
      setOrderItems([])
      setSelectedSeats([])
      setReservationDate("")
      setReservationTime("")
    }, 1500)
  }

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // 메뉴 확정 및 좌석 선택으로 이동
  const handleConfirmMenuAndGoToSeats = () => {
    if (orderItems.length === 0) {
      toast({
        title: "메뉴 선택 필요",
        description: "최소 하나 이상의 메뉴를 선택해주세요.",
        variant: "destructive",
      })
      return
    }
    setActiveTab("seats")
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto p-4 pb-20 md:pb-4">
        <Link href="/customer" className="flex items-center mb-4 text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          식당 목록으로 돌아가기
        </Link>

        <div className="mb-6">
          <img
            src={restaurant.image || "/placeholder.svg"}
            alt={restaurant.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <p className="text-slate-600">
            {restaurant.cuisine} • {restaurant.rating} ★
          </p>
          <p className="text-slate-600">{restaurant.address}</p>
          <p className="mt-2">{restaurant.description}</p>
        </div>

        {/* 주문 요약 */}
        {orderItems.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-medium flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2" />
                주문 내역
              </h2>
              <span className="text-sm font-medium">{orderItems.length}개 메뉴 선택됨</span>
            </div>
            <div className="space-y-2 mb-3">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div>
                    {item.name} x {item.quantity}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">{formatPrice(item.price * item.quantity)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500"
                      onClick={() => handleRemoveFromOrder(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-medium">
              <span>총 주문금액:</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>

            {/* 선택한 좌석 정보 추가 */}
            {selectedSeats.length > 0 && (
              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                <div className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <h3 className="font-medium">선택한 좌석</h3>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedSeats.map((seat) => (
                    <Badge key={seat.id} variant="outline" className="bg-blue-100 border-blue-200">
                      {seat.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 탭 위에 버튼 배치 - 탭에 따라 다른 버튼 표시 */}
        <div className="mb-4">
          {activeTab === "menu" && orderItems.length > 0 && (
            <Button className="w-full" onClick={handleConfirmMenuAndGoToSeats}>
              메뉴 확정 및 좌석 선택으로 이동
            </Button>
          )}

          {activeTab === "seats" && orderItems.length > 0 && selectedSeats.length > 0 && (
            <Button className="w-full" onClick={handleSubmitReservation}>
              예약 확인
            </Button>
          )}
        </div>

        <Tabs defaultValue="menu" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="menu">메뉴</TabsTrigger>
            <TabsTrigger value="seats">좌석</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="mt-4">
            <div className="grid gap-4">
              {menuItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAddToOrder={handleAddToOrder}
                  isInOrder={orderItems.some((orderItem) => orderItem.id === item.id)}
                  currentQuantity={orderItems.find((orderItem) => orderItem.id === item.id)?.quantity || 1}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="seats" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>좌석 선택</CardTitle>
                <CardDescription>이용 가능한 좌석은 녹색, 사용 중인 좌석은 빨간색으로 표시됩니다</CardDescription>
              </CardHeader>
              <CardContent>
                <SeatMap restaurantId={restaurant.id} onSeatsChange={handleSeatsChange} selectedSeats={selectedSeats} />
              </CardContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="reservation-date">예약 날짜</Label>
                    <div className="flex">
                      <Calendar className="h-4 w-4 mr-2 text-slate-500 self-center" />
                      <Input
                        id="reservation-date"
                        type="date"
                        value={reservationDate}
                        onChange={(e) => setReservationDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reservation-time">예약 시간</Label>
                    <div className="flex">
                      <Clock className="h-4 w-4 mr-2 text-slate-500 self-center" />
                      <Input
                        id="reservation-time"
                        type="time"
                        value={reservationTime}
                        onChange={(e) => setReservationTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 예약 확인 다이얼로그 */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>예약 확인</DialogTitle>
              <DialogDescription>아래 예약 정보를 확인하고 예약을 완료해주세요.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-medium mb-2">예약 정보</h3>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-slate-500">식당:</span> {restaurant.name}
                  </p>
                  <p>
                    <span className="text-slate-500">날짜:</span> {reservationDate}
                  </p>
                  <p>
                    <span className="text-slate-500">시간:</span> {reservationTime}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">선택한 좌석</h3>
                <div className="flex flex-wrap gap-1">
                  {selectedSeats.map((seat) => (
                    <Badge key={seat.id} variant="outline" className="bg-blue-100 border-blue-200">
                      {seat.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">주문 메뉴</h3>
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                    <span>총 주문금액:</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmation(false)} disabled={isSubmitting}>
                취소
              </Button>
              <Button onClick={confirmReservation} disabled={isSubmitting}>
                {isSubmitting ? "처리 중..." : "예약 확정"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CustomerLayout>
  )
}
