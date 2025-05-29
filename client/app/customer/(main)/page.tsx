"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import CustomerLayout from "@/components/customer-layout"
import { RestaurantCard } from "@/components/restaurant-card"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin } from "lucide-react"
import Link from "next/link"

// 식당 인터페이스 정의
interface Restaurant {
  id: number
  name: string
  cuisine: string
  rating: number
  image: string
  address: string
  district: string // 지역구 추가
  occupancy: number
}

export default function CustomerPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // 검색 상태
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")

  // 식당 목데이터 (지역구 정보 추가)
  const allRestaurants: Restaurant[] = [
    {
      id: 1,
      name: "맛있는 비스트로",
      cuisine: "이탈리안",
      rating: 4.7,
      image: "/placeholder.svg?height=200&width=300",
      address: "서울시 강남구 123번길",
      district: "강남구",
      occupancy: 45,
    },
    {
      id: 2,
      name: "스파이스 가든",
      cuisine: "인도 요리",
      rating: 4.5,
      image: "/placeholder.svg?height=200&width=300",
      address: "서울시 서초구 456번길",
      district: "서초구",
      occupancy: 75,
    },
    {
      id: 3,
      name: "스시 파라다이스",
      cuisine: "일식",
      rating: 4.8,
      image: "/placeholder.svg?height=200&width=300",
      address: "서울시 송파구 789번길",
      district: "송파구",
      occupancy: 90,
    },
    {
      id: 4,
      name: "서울 바베큐",
      cuisine: "한식",
      rating: 4.6,
      image: "/placeholder.svg?height=200&width=300",
      address: "서울시 마포구 567번길",
      district: "마포구",
      occupancy: 30,
    },
    {
      id: 5,
      name: "차이나 하우스",
      cuisine: "중식",
      rating: 4.4,
      image: "/placeholder.svg?height=200&width=300",
      address: "서울시 중구 890번길",
      district: "중구",
      occupancy: 65,
    },
    {
      id: 6,
      name: "파리지앵",
      cuisine: "프랑스 요리",
      rating: 4.9,
      image: "/placeholder.svg?height=200&width=300",
      address: "서울시 용산구 234번길",
      district: "용산구",
      occupancy: 85,
    },
    {
      id: 7,
      name: "강남 치킨",
      cuisine: "치킨",
      rating: 4.3,
      image: "/placeholder.svg?height=200&width=300",
      address: "서울시 강남구 345번길",
      district: "강남구",
      occupancy: 55,
    },
    {
      id: 8,
      name: "종로 냉면",
      cuisine: "한식",
      rating: 4.7,
      image: "/placeholder.svg?height=200&width=300",
      address: "서울시 종로구 678번길",
      district: "종로구",
      occupancy: 70,
    },
    {
      id: 9,
      name: "마포 돈까스",
      cuisine: "일식",
      rating: 4.2,
      image: "/placeholder.svg?height=200&width=300",
      address: "서울시 마포구 901번길",
      district: "마포구",
      occupancy: 40,
    },
  ]

  // 지역구 목록 (중복 제거)
  const districts = Array.from(new Set(allRestaurants.map((r) => r.district))).sort()

  // 필터링된 식당 목록
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(allRestaurants)

  // 검색 처리 함수
  const handleSearch = () => {
    let results = allRestaurants

    // 이름으로 필터링
    if (searchTerm) {
      results = results.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // 지역으로 필터링
    if (selectedDistrict) {
      results = results.filter((restaurant) => restaurant.district === selectedDistrict)
    }

    setFilteredRestaurants(results)

    // 검색 결과 알림
    if (results.length === 0) {
      toast({
        title: "검색 결과 없음",
        description: "검색 조건에 맞는 식당이 없습니다. 다른 검색어를 시도해보세요.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "검색 완료",
        description: `${results.length}개의 식당을 찾았습니다.`,
      })
    }
  }

  // 검색 초기화
  const resetSearch = () => {
    setSearchTerm("")
    setSelectedDistrict("")
    setFilteredRestaurants(allRestaurants)
  }

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

  // 로딩 중이거나 인증되지 않은 경우 빈 페이지 반환
  if (isLoading || !isAuthenticated || user?.role !== "customer") {
    return null
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto p-4 pb-20 md:pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">안녕하세요, {user?.name}님</h1>
            <p className="text-slate-600">오늘은 어떤 식당을 찾고 계신가요?</p>
          </div>
          <div className="mt-4 md:mt-0 hidden md:block">
            <Link href="/customer/bookings">
              <Button variant="outline" className="flex items-center gap-2">
                내 예약 확인하기
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  2
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 검색 섹션 */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">식당 검색</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-slate-500" />
              <Input
                placeholder="식당 이름 또는 음식 종류"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-slate-500" />
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="지역 선택" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSearch} className="flex-1">
                검색
              </Button>
              <Button variant="outline" onClick={resetSearch}>
                초기화
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-xl font-semibold">{searchTerm || selectedDistrict ? "검색 결과" : "추천 식당"}</h2>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span>여유</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                <span>혼잡</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span>복잡</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            {filteredRestaurants.length > 0
              ? "현재 좌석 상황을 확인하고 예약하세요"
              : "검색 조건에 맞는 식당이 없습니다. 다른 검색어를 시도해보세요."}
          </p>
        </div>

        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">검색 결과가 없습니다</p>
            <Button variant="link" onClick={resetSearch}>
              모든 식당 보기
            </Button>
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}
