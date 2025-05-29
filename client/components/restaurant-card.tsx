import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin } from "lucide-react"

interface Restaurant {
  id: number
  name: string
  cuisine: string
  rating: number
  image: string
  address: string
  district?: string // 지역구 추가 (선택적)
  occupancy?: number // 좌석 점유도 (0-100%)
}

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  // 점유도에 따른 상태 및 색상 결정
  const getOccupancyStatus = (occupancy: number) => {
    if (occupancy <= 60) {
      return {
        status: "여유",
        color: "bg-green-500",
        textColor: "text-green-700",
        bgColor: "bg-green-100",
      }
    } else if (occupancy <= 80) {
      return {
        status: "혼잡",
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
        bgColor: "bg-yellow-100",
      }
    } else {
      return {
        status: "복잡",
        color: "bg-red-500",
        textColor: "text-red-700",
        bgColor: "bg-red-100",
      }
    }
  }

  // 점유도 정보가 있는 경우에만 상태 계산
  const occupancyInfo = restaurant.occupancy !== undefined ? getOccupancyStatus(restaurant.occupancy) : null

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden relative">
        <img
          src={restaurant.image || "/placeholder.svg"}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />

        {/* 점유도 배지 */}
        {occupancyInfo && (
          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded-md ${occupancyInfo.bgColor} ${occupancyInfo.textColor} text-xs font-medium`}
          >
            {occupancyInfo.status}
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{restaurant.name}</CardTitle>
        <div className="text-sm text-slate-600">
          {restaurant.cuisine} • {restaurant.rating} ★
        </div>
        <div className="text-sm text-slate-600 mb-2 flex items-center">
          <MapPin className="h-3 w-3 mr-1 inline" />
          {restaurant.address}
        </div>

        {/* 좌석 점유도 바 */}
        {restaurant.occupancy !== undefined && (
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium">현재 좌석 점유도</span>
              <span className={`text-xs font-bold ${occupancyInfo?.textColor}`}>{restaurant.occupancy}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className={`${occupancyInfo?.color} h-2.5 rounded-full`}
                style={{ width: `${restaurant.occupancy}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardFooter>
        <Link href={`/customer/store/${restaurant.id}`} className="w-full">
          <Button className="w-full">보기 & 예약</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
