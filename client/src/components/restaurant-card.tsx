import type React from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { MapPin, Star, Utensils } from "lucide-react"
import type { Restaurant } from "../redux/slices/restaurantSlice"

interface RestaurantCardProps {
  restaurant: Restaurant
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const occupancyPercentage = (restaurant.occupancy / restaurant.totalSeats) * 100

  let occupancyStatus: { label: string; color: string } = { label: "여유", color: "bg-green-500" }

  if (occupancyPercentage >= 80) {
    occupancyStatus = { label: "혼잡", color: "bg-red-500" }
  } else if (occupancyPercentage >= 50) {
    occupancyStatus = { label: "보통", color: "bg-yellow-500" }
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.imageUrl || "/placeholder.svg"}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge className={`${occupancyStatus.color} text-white`}>{occupancyStatus.label}</Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{restaurant.name}</CardTitle>
          <div className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm">{restaurant.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
          <Utensils className="h-3 w-3 mr-1" />
          <span>{restaurant.cuisine}</span>
          <span className="mx-2">•</span>
          <span>{restaurant.priceRange}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex items-start text-sm text-slate-500 dark:text-slate-400 mb-2">
          <MapPin className="h-3 w-3 mr-1 mt-0.5 shrink-0" />
          <span>{restaurant.address}</span>
        </div>
        <p className="text-sm line-clamp-2">{restaurant.description}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <Link to={`/customer/store/${restaurant.id}`} className="w-full">
          <Button className="w-full">상세 보기</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default RestaurantCard
