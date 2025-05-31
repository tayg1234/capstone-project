import type { MenuItem } from "../redux/slices/menuSlice"

// 테스트용 더미 데이터
const dummyMenuItems: Record<string, MenuItem[]> = {
  "1": [
    {
      id: "1",
      restaurantId: "1",
      name: "불고기",
      description: "한국 전통 불고기 요리",
      price: 15000,
      category: "메인",
      imageUrl: "/bulgogi.png",
      isAvailable: true,
    },
    {
      id: "2",
      restaurantId: "1",
      name: "된장찌개",
      description: "구수한 된장찌개",
      price: 8000,
      category: "찌개",
      imageUrl: "/placeholder-ews9h.png",
      isAvailable: true,
    },
    {
      id: "3",
      restaurantId: "1",
      name: "비빔밥",
      description: "신선한 야채와 함께 제공되는 비빔밥",
      price: 10000,
      category: "메인",
      imageUrl: "/colorful-bibimbap.png",
      isAvailable: true,
    },
  ],
  "2": [
    {
      id: "4",
      restaurantId: "2",
      name: "파스타",
      description: "토마토 소스 파스타",
      price: 18000,
      category: "메인",
      imageUrl: "/placeholder.svg?height=150&width=150&query=pasta",
      isAvailable: true,
    },
    {
      id: "5",
      restaurantId: "2",
      name: "샐러드",
      description: "신선한 야채 샐러드",
      price: 12000,
      category: "전채",
      imageUrl: "/placeholder.svg?height=150&width=150&query=salad",
      isAvailable: true,
    },
    {
      id: "6",
      restaurantId: "2",
      name: "티라미수",
      description: "이탈리안 디저트",
      price: 8000,
      category: "디저트",
      imageUrl: "/placeholder.svg?height=150&width=150&query=tiramisu",
      isAvailable: true,
    },
  ],
  "3": [
    {
      id: "7",
      restaurantId: "3",
      name: "사시미",
      description: "신선한 생선회",
      price: 25000,
      category: "메인",
      imageUrl: "/placeholder.svg?height=150&width=150&query=sashimi",
      isAvailable: true,
    },
    {
      id: "8",
      restaurantId: "3",
      name: "스시 세트",
      description: "다양한 스시 세트",
      price: 30000,
      category: "메인",
      imageUrl: "/placeholder.svg?height=150&width=150&query=sushi set",
      isAvailable: true,
    },
    {
      id: "9",
      restaurantId: "3",
      name: "미소 수프",
      description: "일본식 미소 수프",
      price: 5000,
      category: "수프",
      imageUrl: "/placeholder.svg?height=150&width=150&query=miso soup",
      isAvailable: true,
    },
  ],
}

const menuService = {
  // 레스토랑 메뉴 가져오기
  async getRestaurantMenu(restaurantId: string): Promise<MenuItem[]> {
    try {
      // 실제 API 호출 (주석 처리)
      // const response = await api.get(`/restaurants/${restaurantId}/menu`);
      // return response.data;

      // 테스트용 더미 데이터
      return dummyMenuItems[restaurantId] || []
    } catch (error) {
      throw error
    }
  },
}

export default menuService
