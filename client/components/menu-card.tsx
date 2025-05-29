"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
}

interface MenuCardProps {
  item: MenuItem
  onAddToOrder: (item: MenuItem, quantity: number) => void
  isInOrder: boolean
  currentQuantity: number
}

export function MenuCard({ item, onAddToOrder, isInOrder, currentQuantity }: MenuCardProps) {
  const [quantity, setQuantity] = useState(currentQuantity || 1)

  // 가격을 한국 원화 형식으로 포맷팅
  const formattedPrice = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(item.price)

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1)
  }

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const handleAddToOrder = () => {
    onAddToOrder(item, quantity)
  }

  return (
    <Card className={isInOrder ? "border-green-300 bg-green-50 dark:bg-green-900/10" : ""}>
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <div className="mr-4">
            <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-medium">{item.name}</h3>
              {isInOrder && (
                <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                  <Check className="h-3 w-3 mr-1" />
                  선택됨
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-600">{item.description}</p>
            <p className="font-medium mt-1">{formattedPrice}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-2 mb-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleDecrement}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-6 text-center">{quantity}</span>
              <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={handleIncrement}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Button
              type="button"
              size="sm"
              variant={isInOrder ? "outline" : "default"}
              className={isInOrder ? "text-green-600 border-green-200" : ""}
              onClick={handleAddToOrder}
            >
              {isInOrder ? "수량 변경" : "추가"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
