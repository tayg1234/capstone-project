import type { Reservation } from "../redux/slices/reservationSlice"

// 테스트용 더미 데이터
const dummyReservations: Reservation[] = [
  {
    id: "1",
    restaurantId: "1",
    restaurantName: "맛있는 식당",
    customerId: "customer",
    date: "2025-05-20",
    time: "18:00",
    partySize: 4,
    status: "confirmed",
    tableNumber: 12,
    menuItems: [
      { id: "1", name: "불고기", quantity: 2, price: 15000 },
      { id: "2", name: "된장찌개", quantity: 1, price: 8000 },
    ],
    totalPrice: 38000,
  },
  {
    id: "2",
    restaurantId: "2",
    restaurantName: "이탈리안 비스트로",
    customerId: "customer",
    date: "2025-05-25",
    time: "19:30",
    partySize: 2,
    status: "pending",
    tableNumber: 5,
    menuItems: [
      { id: "3", name: "파스타", quantity: 2, price: 18000 },
      { id: "4", name: "샐러드", quantity: 1, price: 12000 },
    ],
    totalPrice: 48000,
  },
]

const reservationService = {
  // 사용자의 모든 예약 가져오기
  async getUserReservations(): Promise<Reservation[]> {
    try {
      // 실제 API 호출 (주석 처리)
      // const response = await api.get('/reservations/user');
      // return response.data;

      // 테스트용 더미 데이터
      return dummyReservations
    } catch (error) {
      throw error
    }
  },

  // 예약 생성
  async createReservation(reservationData: Partial<Reservation>): Promise<Reservation> {
    try {
      // 실제 API 호출 (주석 처리)
      // const response = await api.post('/reservations', reservationData);
      // return response.data;

      // 테스트용 더미 데이터
      const newReservation: Reservation = {
        id: Math.random().toString(36).substring(2, 9),
        restaurantId: reservationData.restaurantId || "",
        restaurantName: reservationData.restaurantName || "",
        customerId: "customer",
        date: reservationData.date || "",
        time: reservationData.time || "",
        partySize: reservationData.partySize || 1,
        status: "confirmed",
        tableNumber: reservationData.tableNumber,
        menuItems: reservationData.menuItems,
        totalPrice: reservationData.totalPrice,
      }

      return newReservation
    } catch (error) {
      throw error
    }
  },

  // 예약 취소
  async cancelReservation(reservationId: string): Promise<void> {
    try {
      // 실제 API 호출 (주석 처리)
      // await api.put(`/reservations/${reservationId}/cancel`);

      // 테스트용 더미 데이터
      console.log(`예약 ID ${reservationId} 취소됨`)
    } catch (error) {
      throw error
    }
  },
}

export default reservationService
