"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Clock, DollarSign, TrendingUp } from "lucide-react"

export function BusinessStats() {
  const dailyChartRef = useRef<HTMLCanvasElement>(null)
  const weeklyChartRef = useRef<HTMLCanvasElement>(null)

  // Mock data for stats
  const stats = {
    customers: 128,
    avgTime: "1h 24m",
    revenue: "$1,842",
    growth: "+12.5%",
  }

  // Function to draw a simple chart
  const drawChart = (canvas: HTMLCanvasElement, data: number[], label: string, color: string) => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 20
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#cbd5e1"
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw data points
    const maxValue = Math.max(...data) * 1.1
    const pointSpacing = chartWidth / (data.length - 1)

    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    // Draw line
    data.forEach((value, index) => {
      const x = padding + index * pointSpacing
      const y = height - padding - (value / maxValue) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Fill area under line
    ctx.lineTo(padding + (data.length - 1) * pointSpacing, height - padding)
    ctx.lineTo(padding, height - padding)
    ctx.fillStyle = `${color}20`
    ctx.fill()

    // Draw points
    data.forEach((value, index) => {
      const x = padding + index * pointSpacing
      const y = height - padding - (value / maxValue) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
    })

    // Draw label
    ctx.fillStyle = "#64748b"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(label, width / 2, height - 5)
  }

  useEffect(() => {
    // Draw daily chart
    if (dailyChartRef.current) {
      const dailyData = [12, 18, 15, 22, 30, 35, 25]
      drawChart(dailyChartRef.current, dailyData, "최근 7일", "#0ea5e9")
    }

    // Draw weekly chart
    if (weeklyChartRef.current) {
      const weeklyData = [120, 145, 135, 160, 180, 210, 190, 220]
      drawChart(weeklyChartRef.current, weeklyData, "최근 8주", "#8b5cf6")
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 고객 수</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers}</div>
            <p className="text-xs text-slate-500">오늘</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 체류 시간</CardTitle>
            <Clock className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgTime}</div>
            <p className="text-xs text-slate-500">고객당</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">매출</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.revenue}</div>
            <p className="text-xs text-slate-500">오늘</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">성장률</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.growth}</div>
            <p className="text-xs text-slate-500">전월 대비</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily">일별</TabsTrigger>
          <TabsTrigger value="weekly">주별</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>일별 고객 트래픽</CardTitle>
            </CardHeader>
            <CardContent>
              <canvas ref={dailyChartRef} width="600" height="300" className="w-full h-auto"></canvas>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>주별 매출</CardTitle>
            </CardHeader>
            <CardContent>
              <canvas ref={weeklyChartRef} width="600" height="300" className="w-full h-auto"></canvas>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
