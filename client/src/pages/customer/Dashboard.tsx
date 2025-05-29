"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { fetchRestaurants, searchRestaurants } from "../../redux/slices/restaurantSlice"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Search, User, CalendarDays, LogOut } from "lucide-react"
import RestaurantCard from "../../components/restaurant-card"
import { logout } from "../../redux/slices/authSlice"

const CustomerDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { restaurants, isLoading } = useSelector((state: RootState) => state.restaurant)
  const { user } = useSelector((state: RootState) => state.auth)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")

  // 요리 종류와 지역 목록 (실제로는 API에서 가져올 수 있음)
  const cuisines = ["한식", "일식", "이탈리안", "중식", "프랑스", "멕시칸"]
  const districts = ["강남구", "서초구", "마포구", "종로구", "중구", "용산구"]

  useEffect(() => {
    dispatch(fetchRestaurants())
  }, [dispatch])

  const handleSearch = () => {
    dispatch(
      searchRestaurants({
        query: searchQuery,
        cuisine: selectedCuisine,
        district: selectedDistrict,
      }),
    )
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* 헤더 */}
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">레스토랑 찾기</h1>
            <div className="flex items-center space-x-4">
              <Link to="/customer/bookings">
                <Button variant="outline" size="sm">
                  <CalendarDays className="h-4 w-4 mr-2" />내 예약
                </Button>
              </Link>
              <Link to="/customer/profile">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  프로필
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 검색 섹션 */}
      <section className="py-8 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="레스토랑 이름 검색..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                <SelectTrigger>
                  <SelectValue placeholder="요리 종류" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {cuisines.map((cuisine) => (
                    <SelectItem key={cuisine} value={cuisine}>
                      {cuisine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="지역" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch}>검색</Button>
          </div>
        </div>
      </section>

      {/* 레스토랑 목록 */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white">
            {searchQuery || selectedCuisine || selectedDistrict ? "검색 결과" : "추천 레스토랑"}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default CustomerDashboard
