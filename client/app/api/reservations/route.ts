import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 예약을 위한 목 데이터베이스
const reservations = [
  {
    id: 1,
    customerId: 101,
    customerName: "김철수",
    restaurantId: 1,
    time: "18:30",
    date: "2023-06-15",
    seats: ["A1", "A2"],
    status: "confirmed",
  },
  {
    id: 2,
    customerId: 102,
    customerName: "이영희",
    restaurantId: 1,
    time: "19:00",
    date: "2023-06-15",
    seats: ["B3", "B4", "B5"],
    status: "pending",
  },
]

// 예약을 검색하는 GET 핸들러
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const restaurantId = searchParams.get("restaurantId")
  const customerId = searchParams.get("customerId")
  const date = searchParams.get("date")

  let filteredReservations = [...reservations]

  if (restaurantId) {
    filteredReservations = filteredReservations.filter((r) => r.restaurantId === Number.parseInt(restaurantId))
  }

  if (customerId) {
    filteredReservations = filteredReservations.filter((r) => r.customerId === Number.parseInt(customerId))
  }

  if (date) {
    filteredReservations = filteredReservations.filter((r) => r.date === date)
  }

  return NextResponse.json(filteredReservations)
}

// 새 예약을 생성하는 POST 핸들러
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // 필수 필드 검증
    if (!data.customerName || !data.restaurantId || !data.date || !data.time || !data.seats) {
      return NextResponse.json({ error: "필수 필드가 누락되었습니다" }, { status: 400 })
    }

    // 새 예약 생성
    const newReservation = {
      id: reservations.length + 1,
      customerId: data.customerId || 999, // 익명 고객을 위한 기본값
      customerName: data.customerName,
      restaurantId: data.restaurantId,
      time: data.time,
      date: data.date,
      seats: data.seats,
      status: "pending",
    }

    // "데이터베이스"에 추가
    reservations.push(newReservation)

    return NextResponse.json(newReservation, { status: 201 })
  } catch (error) {
    console.error("예약 생성 중 오류:", error)
    return NextResponse.json({ error: "예약 생성에 실패했습니다" }, { status: 500 })
  }
}

// 예약을 업데이트하는 PATCH 핸들러
export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: "예약 ID가 필요합니다" }, { status: 400 })
    }

    const reservationIndex = reservations.findIndex((r) => r.id === data.id)

    if (reservationIndex === -1) {
      return NextResponse.json({ error: "예약을 찾을 수 없습니다" }, { status: 404 })
    }

    // 예약 업데이트
    reservations[reservationIndex] = {
      ...reservations[reservationIndex],
      ...data,
    }

    return NextResponse.json(reservations[reservationIndex])
  } catch (error) {
    console.error("예약 업데이트 중 오류:", error)
    return NextResponse.json({ error: "예약 업데이트에 실패했습니다" }, { status: 500 })
  }
}
