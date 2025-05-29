"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Reservation {
  id: number
  customerName: string
  time: string
  date: string
  seats: string[]
  status: "pending" | "confirmed" | "cancelled"
}

export function ReservationList() {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  }

  // 상태 텍스트 한국어로 변경
  const statusText = {
    pending: "대기 중",
    confirmed: "확정됨",
    cancelled: "취소됨",
  }

  // 예약 목데이터
  const initialReservations: Reservation[] = [
    {
      id: 1,
      customerName: "김철수",
      time: "18:30",
      date: "2023-06-15",
      seats: ["A1", "A2"],
      status: "confirmed",
    },
    {
      id: 2,
      customerName: "이영희",
      time: "19:00",
      date: "2023-06-15",
      seats: ["B3", "B4", "B5"],
      status: "pending",
    },
    {
      id: 3,
      customerName: "박민수",
      time: "20:15",
      date: "2023-06-15",
      seats: ["C2"],
      status: "pending",
    },
    {
      id: 4,
      customerName: "정지연",
      time: "18:00",
      date: "2023-06-16",
      seats: ["D1", "D2"],
      status: "confirmed",
    },
    {
      id: 5,
      customerName: "최동욱",
      time: "19:30",
      date: "2023-06-16",
      seats: ["A4", "A5"],
      status: "pending",
    },
  ]

  const [reservations, setReservations] = useState(initialReservations)

  const handleStatusChange = (id: number, newStatus: "confirmed" | "cancelled") => {
    setReservations(
      reservations.map((reservation) => (reservation.id === id ? { ...reservation, status: newStatus } : reservation)),
    )
  }

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <div key={reservation.id} className="border rounded-lg p-4 bg-white dark:bg-slate-950">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">{reservation.customerName}</h3>
              <p className="text-sm text-slate-600">
                {reservation.date} at {reservation.time}
              </p>
            </div>
            <Badge variant="outline" className={statusColors[reservation.status]}>
              {statusText[reservation.status]}
            </Badge>
          </div>

          <div className="mb-3">
            <p className="text-sm font-medium">좌석:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {reservation.seats.map((seat) => (
                <span key={seat} className="inline-block px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded">
                  {seat}
                </span>
              ))}
            </div>
          </div>

          {reservation.status === "pending" && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                onClick={() => handleStatusChange(reservation.id, "confirmed")}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                확정
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={() => handleStatusChange(reservation.id, "cancelled")}
              >
                <XCircle className="h-4 w-4 mr-1" />
                취소
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
