import type { Restaurant } from "../redux/slices/restaurantSlice"

// 테스트용 더미 데이터
const dummyRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "맛있는 식당",
    description: "한국 전통 음식을 제공하는 맛있는 식당입니다.",
    address: "서울시 강남구 테헤란로 123",
    district: "강남구",
    cuisine: "한식",
    rating: 4.5,
    priceRange: "$$",
    imageUrl: "/cozy-italian-restaurant.png",
    occupancy: 75,
    totalSeats: 100,
  },
  {
    id: "2",
    name: "이탈리안 비스트로",
    description: "정통 이탈리안 요리를 맛볼 수 있는 비스트로입니다.",
    address: "서울시 마포구 와우산로 45",
    district: "마포구",
    cuisine: "이탈리안",
    rating: 4.2,
    priceRange: "$$$",
    imageUrl: "/italian-restaurant-exterior.png",
    occupancy: 50,
    totalSeats: 80,
  },
  {
    id: "3",
    name: "스시 하우스",
    description: "신선한 해산물로 만든 스시를 제공합니다.",
    address: "서울시 서초구 서초대로 78",
    district: "서초구",
    cuisine: "일식",
    rating: 4.8,
    priceRange: "$$$$",
    imageUrl: "/bustling-sushi-restaurant.png",
    occupancy: 90,
    totalSeats: 60,
  },
]

const restaurantService = {
  // 모든 레스토랑 가져오기
  async getAllRestaurants(): Promise<Restaurant[]> {
    try {
      // 실제 API 호출 (주석 처리)
      // const response = await api.get('/restaurants');
      // return response.data;

      // 테스트용 더미 데이터
      return dummyRestaurants
    } catch (error) {
      throw error
    }
  },

  // 레스토랑 검색
  async searchRestaurants(searchParams: { query?: string; cuisine?: string; district?: string }): Promise<
    Restaurant[]
  > {
    try {
      // 실제 API 호출 (주석 처리)
      // const response = await api.get('/restaurants/search', { params: searchParams });
      // return response.data;

      // 테스트용 더미 데이터 필터링
      let filteredRestaurants = [...dummyRestaurants]

      if (searchParams.query) {
        const query = searchParams.query.toLowerCase()
        filteredRestaurants = filteredRestaurants.filter(
          (restaurant) =>
            restaurant.name.toLowerCase().includes(query) || restaurant.description.toLowerCase().includes(query),
        )
      }

      if (searchParams.cuisine) {
        filteredRestaurants = filteredRestaurants.filter((restaurant) => restaurant.cuisine === searchParams.cuisine)
      }

      if (searchParams.district) {
        filteredRestaurants = filteredRestaurants.filter((restaurant) => restaurant.district === searchParams.district)
      }

      return filteredRestaurants
    } catch (error) {
      throw error
    }
  },

  // 특정 레스토랑 상세 정보 가져오기
  async getRestaurantById(id: string): Promise<Restaurant> {
    try {
      // 실제 API 호출 (주석 처리)
      // const response = await api.get(`/restaurants/${id}`);
      // return response.data;

      // 테스트용 더미 데이터
      const restaurant = dummyRestaurants.find((r) => r.id === id)
      if (!restaurant) {
        throw new Error("레스토랑을 찾을 수 없습니다.")
      }
      return restaurant
    } catch (error) {
      throw error
    }
  },
}

export default restaurantService
