import type { Seat } from "../redux/slices/seatSlice"

// 테스트용 더미 데이터
const dummySeats: Record<string, Seat[]> = {
  "1": [
    { id: "1", restaurantId: "1", tableNumber: 1, capacity: 4, isOccupied: false, x: 100, y: 100, type: "table" },
    { id: "2", restaurantId: "1", tableNumber: 2, capacity: 2, isOccupied: true, x: 200, y: 100, type: "table" },
    { id: "3", restaurantId: "1", tableNumber: 3, capacity: 6, isOccupied: false, x: 300, y: 100, type: "booth" },
    { id: "4", restaurantId: "1", tableNumber: 4, capacity: 4, isOccupied: false, x: 100, y: 200, type: "table" },
    { id: "5", restaurantId: "1", tableNumber: 5, capacity: 2, isOccupied: true, x: 200, y: 200, type: "table" },
    { id: "6", restaurantId: "1", tableNumber: 6, capacity: 8, isOccupied: false, x: 300, y: 200, type: "booth" },
  ],
  "2": [
    { id: "7", restaurantId: "2", tableNumber: 1, capacity: 2, isOccupied: false, x: 100, y: 100, type: "table" },
    { id: "8", restaurantId: "2", tableNumber: 2, capacity: 4, isOccupied: true, x: 200, y: 100, type: "table" },
    { id: "9", restaurantId: "2", tableNumber: 3, capacity: 2, isOccupied: false, x: 300, y: 100, type: "table" },
    { id: "10", restaurantId: "2", tableNumber: 4, capacity: 6, isOccupied: false, x: 100, y: 200, type: "booth" },
  ],
  "3": [
    { id: "11", restaurantId: "3", tableNumber: 1, capacity: 2, isOccupied: false, x: 100, y: 100, type: "table" },
    { id: "12", restaurantId: "3", tableNumber: 2, capacity: 4, isOccupied: true, x: 200, y: 100, type: "table" },
    { id: "13", restaurantId: "3", tableNumber: 3, capacity: 8, isOccupied: false, x: 300, y: 100, type: "booth" },
    { id: "14", restaurantId: "3", tableNumber: 4, capacity: 1, isOccupied: false, x: 100, y: 200, type: "bar" },
    { id: "15", restaurantId: "3", tableNumber: 5, capacity: 1, isOccupied: true, x: 150, y: 200, type: "bar" },
  ],
}

const seatService = {
  // 레스토랑 좌석 정보 가져오기
  async getRestaurantSeats(restaurantId: string): Promise<Seat[]> {
    try {
      // 실제 API 호출 (주석 처리)
      // const response = await api.get(`/restaurants/${restaurantId}/seats`);
      // return response.data;

      // 테스트용 더미 데이터
      return dummySeats[restaurantId] || []
    } catch (error) {
      throw error
    }
  },
}

export default seatService
