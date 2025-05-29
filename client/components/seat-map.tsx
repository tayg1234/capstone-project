"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface SeatProps {
  id: number
  row: string
  col: number
  status: "available" | "occupied" | "selected"
  onSelect: (id: number, row: string, col: number) => void
}

function Seat({ id, row, col, status, onSelect }: SeatProps) {
  const statusClasses = {
    available: "bg-green-100 hover:bg-green-200 border-green-300 text-green-800",
    occupied: "bg-red-100 border-red-300 text-red-800 cursor-not-allowed",
    selected: "bg-blue-200 border-blue-400 text-blue-800",
  }

  return (
    <button
      className={cn(
        "w-12 h-12 rounded-md border-2 flex items-center justify-center font-medium transition-colors",
        statusClasses[status],
      )}
      onClick={() => status !== "occupied" && onSelect(id, row, col)}
      disabled={status === "occupied"}
    >
      {row}
      {col}
    </button>
  )
}

// SeatMap 컴포넌트의 props 인터페이스에 selectedSeats 추가
interface SeatMapProps {
  restaurantId: number
  onSeatsChange: (seats: { id: number; label: string }[]) => void
  selectedSeats?: { id: number; label: string }[]
}

export function SeatMap({ restaurantId, onSeatsChange, selectedSeats = [] }: SeatMapProps) {
  // Mock seat data - in a real app, this would come from an API
  const initialSeats = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    row: String.fromCharCode(65 + Math.floor(i / 5)),
    col: (i % 5) + 1,
    status: Math.random() > 0.3 ? "available" : ("occupied" as "available" | "occupied" | "selected"),
  }))

  // 이미 선택된 좌석 ID 목록 생성
  const selectedSeatIds = selectedSeats.map((seat) => seat.id)

  // 초기 좌석 데이터에서 이미 선택된 좌석은 "selected" 상태로 설정
  const [seats, setSeats] = useState(
    initialSeats.map((seat) => {
      if (selectedSeatIds.includes(seat.id)) {
        return { ...seat, status: "selected" }
      }
      return seat
    }),
  )

  const handleSeatSelect = (id: number, row: string, col: number) => {
    const updatedSeats = seats.map((seat) =>
      seat.id === id ? { ...seat, status: seat.status === "selected" ? "available" : "selected" } : seat,
    )

    setSeats(updatedSeats)

    // 선택된 좌석 정보를 부모 컴포넌트로 전달
    const selectedSeats = updatedSeats
      .filter((seat) => seat.status === "selected")
      .map((seat) => ({ id: seat.id, label: `${seat.row}${seat.col}` }))

    onSeatsChange(selectedSeats)
  }

  // 선택된 좌석 수
  const selectedSeatsCount = seats.filter((seat) => seat.status === "selected").length

  return (
    <div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">좌석 선택 현황</h3>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            {selectedSeatsCount}개 선택됨
          </Badge>
        </div>
        {selectedSeatsCount > 0 ? (
          <div className="bg-blue-50 dark:bg-blue-900/10 p-2 rounded-md text-sm">
            <p className="font-medium mb-1">선택한 좌석:</p>
            <div className="flex flex-wrap gap-1">
              {seats
                .filter((seat) => seat.status === "selected")
                .map((seat) => (
                  <Badge key={seat.id} variant="outline" className="bg-blue-100 border-blue-200">
                    {seat.row}
                    {seat.col}
                  </Badge>
                ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">아직 선택된 좌석이 없습니다. 좌석을 선택해주세요.</p>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {seats.map((seat) => (
          <Seat
            key={seat.id}
            id={seat.id}
            row={seat.row}
            col={seat.col}
            status={seat.status}
            onSelect={handleSeatSelect}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-1"></div>
          <span>이용 가능</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded mr-1"></div>
          <span>선택됨</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-1"></div>
          <span>사용 중</span>
        </div>
      </div>
    </div>
  )
}
