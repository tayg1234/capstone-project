"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

// 카메라 인터페이스 정의
interface CameraDevice {
  id: string
  name: string
  location: string
  type: "ip" | "usb" | "rtsp"
  url: string
  status: "online" | "offline" | "error"
  enabled: boolean
}

export function LiveSeatMonitor() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [detectedSeats, setDetectedSeats] = useState<{ id: string; status: string }[]>([])

  // 카메라 관련 상태
  const [cameras, setCameras] = useState<CameraDevice[]>([
    {
      id: "cam-1",
      name: "메인 홀 카메라",
      location: "메인 홀",
      type: "ip",
      url: "http://192.168.1.100:8080/video",
      status: "online",
      enabled: true,
    },
    {
      id: "cam-2",
      name: "입구 카메라",
      location: "입구",
      type: "rtsp",
      url: "rtsp://admin:password@192.168.1.101:554/stream",
      status: "online",
      enabled: true,
    },
    {
      id: "cam-3",
      name: "주방 카메라",
      location: "주방",
      type: "usb",
      url: "usb://camera-3",
      status: "online",
      enabled: true,
    },
    {
      id: "cam-4",
      name: "테라스 카메라",
      location: "테라스",
      type: "ip",
      url: "http://192.168.1.102:8080/video",
      status: "offline",
      enabled: true,
    },
  ])

  // 활성화된 카메라만 필터링
  const activeCameras = cameras.filter((camera) => camera.enabled && camera.status === "online")

  // 현재 선택된 카메라
  const [selectedCameraId, setSelectedCameraId] = useState<string>(activeCameras.length > 0 ? activeCameras[0].id : "")

  // 카메라 뷰 모드 (단일 또는 그리드)
  const [viewMode, setViewMode] = useState<"single" | "grid">("single")

  // Mock function to simulate OpenCV processing
  const processCameraFeed = () => {
    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      // Generate mock seat detection data
      const seats = Array.from({ length: 12 }, (_, i) => ({
        id: `seat-${i + 1}`,
        status: Math.random() > 0.4 ? "available" : "occupied",
      }))

      setDetectedSeats(seats)
      setIsProcessing(false)

      // Draw detection results on canvas
      if (canvasRef.current && videoRef.current) {
        const ctx = canvasRef.current.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

          // Draw the video frame
          ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

          // Draw seat detection boxes
          seats.forEach((seat, index) => {
            const row = Math.floor(index / 4)
            const col = index % 4

            const x = 50 + col * 100
            const y = 50 + row * 100
            const width = 80
            const height = 80

            ctx.strokeStyle = seat.status === "available" ? "green" : "red"
            ctx.lineWidth = 3
            ctx.strokeRect(x, y, width, height)

            ctx.fillStyle = seat.status === "available" ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)"
            ctx.fillRect(x, y, width, height)

            ctx.fillStyle = "white"
            ctx.font = "16px sans-serif"
            ctx.fillText(seat.id, x + 10, y + 20)
          })
        }
      }

      toast({
        title: "좌석 분석 완료",
        description: `${seats.filter((s) => s.status === "available").length}개의 좌석이 이용 가능합니다.`,
      })
    }, 1500)
  }

  // 카메라 변경 시 캔버스 초기화 및 새 카메라 피드 표시
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        // 캔버스 초기화
        ctx.fillStyle = "#f1f5f9"
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        // 선택된 카메라 정보 표시
        const selectedCamera = cameras.find((camera) => camera.id === selectedCameraId)

        if (selectedCamera) {
          ctx.fillStyle = "#64748b"
          ctx.font = "16px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(`${selectedCamera.name} (${selectedCamera.location})`, canvasRef.current.width / 2, 30)
          ctx.fillText("카메라 피드가 여기에 표시됩니다", canvasRef.current.width / 2, canvasRef.current.height / 2)
          ctx.fillText(
            "'좌석 분석' 버튼을 클릭하여 좌석 상태를 확인하세요",
            canvasRef.current.width / 2,
            canvasRef.current.height / 2 + 30,
          )
        } else {
          ctx.fillStyle = "#64748b"
          ctx.font = "16px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText("활성화된 카메라가 없습니다", canvasRef.current.width / 2, canvasRef.current.height / 2)
          ctx.fillText(
            "카메라 관리 탭에서 카메라를 추가하고 활성화하세요",
            canvasRef.current.width / 2,
            canvasRef.current.height / 2 + 30,
          )
        }
      }
    }
  }, [selectedCameraId, cameras])

  // 다음 카메라로 이동
  const goToNextCamera = () => {
    if (activeCameras.length <= 1) return

    const currentIndex = activeCameras.findIndex((camera) => camera.id === selectedCameraId)
    const nextIndex = (currentIndex + 1) % activeCameras.length
    setSelectedCameraId(activeCameras[nextIndex].id)
  }

  // 이전 카메라로 이동
  const goToPrevCamera = () => {
    if (activeCameras.length <= 1) return

    const currentIndex = activeCameras.findIndex((camera) => camera.id === selectedCameraId)
    const prevIndex = (currentIndex - 1 + activeCameras.length) % activeCameras.length
    setSelectedCameraId(activeCameras[prevIndex].id)
  }

  return (
    <div>
      {/* 카메라 선택 UI */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Select value={selectedCameraId} onValueChange={setSelectedCameraId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="카메라 선택" />
            </SelectTrigger>
            <SelectContent>
              {activeCameras.length > 0 ? (
                activeCameras.map((camera) => (
                  <SelectItem key={camera.id} value={camera.id}>
                    {camera.name} ({camera.location})
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  활성화된 카메라 없음
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          <div className="flex items-center">
            <Button variant="outline" size="icon" onClick={goToPrevCamera} disabled={activeCameras.length <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextCamera} disabled={activeCameras.length <= 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "single" | "grid")}>
          <TabsList className="h-9">
            <TabsTrigger value="single" className="px-3">
              단일 화면
            </TabsTrigger>
            <TabsTrigger value="grid" className="px-3">
              그리드 화면
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="relative mb-4">
        {/* 단일 화면 모드 */}
        {viewMode === "single" && (
          <>
            {/* Hidden video element that would contain the camera feed */}
            <video ref={videoRef} className="hidden" width="640" height="480" autoPlay muted />

            {/* Canvas where we draw the processed feed */}
            <canvas ref={canvasRef} width="640" height="480" className="w-full h-auto border rounded-lg" />
          </>
        )}

        {/* 그리드 화면 모드 */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeCameras.length > 0 ? (
              activeCameras.map((camera) => (
                <div
                  key={camera.id}
                  className={`relative border rounded-lg overflow-hidden ${
                    camera.id === selectedCameraId ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedCameraId(camera.id)}
                >
                  <div className="bg-slate-100 dark:bg-slate-800 aspect-video flex items-center justify-center">
                    <div className="text-center p-4">
                      <p className="font-medium">{camera.name}</p>
                      <p className="text-sm text-slate-500">{camera.location}</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {camera.id === selectedCameraId ? "선택됨" : ""}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 border rounded-lg p-8 text-center">
                <Camera className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                <p className="text-slate-500">활성화된 카메라가 없습니다</p>
                <p className="text-sm text-slate-400">카메라 관리 탭에서 카메라를 추가하고 활성화하세요</p>
              </div>
            )}
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <div className="flex flex-col items-center text-white">
              <RefreshCw className="h-8 w-8 animate-spin mb-2" />
              <span>OpenCV로 처리 중...</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button onClick={processCameraFeed} disabled={isProcessing || activeCameras.length === 0}>
          <Camera className="h-4 w-4 mr-2" />
          {isProcessing ? "처리 중..." : "좌석 분석"}
        </Button>

        <div className="text-sm">
          <span className="text-green-600 font-medium mr-2">
            {detectedSeats.filter((s) => s.status === "available").length} 이용 가능
          </span>
          <span className="text-red-600 font-medium">
            {detectedSeats.filter((s) => s.status === "occupied").length} 사용 중
          </span>
        </div>
      </div>

      {/* 카메라 정보 */}
      {selectedCameraId && (
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">
          <h4 className="font-medium mb-1">선택된 카메라 정보</h4>
          {(() => {
            const camera = cameras.find((c) => c.id === selectedCameraId)
            if (!camera) return <p>카메라 정보를 찾을 수 없습니다.</p>

            return (
              <div className="space-y-1">
                <p>
                  <span className="text-slate-500">이름:</span> {camera.name}
                </p>
                <p>
                  <span className="text-slate-500">위치:</span> {camera.location}
                </p>
                <p>
                  <span className="text-slate-500">유형:</span> {camera.type.toUpperCase()}
                </p>
                <p>
                  <span className="text-slate-500">상태:</span>{" "}
                  {camera.status === "online" ? (
                    <span className="text-green-600">온라인</span>
                  ) : camera.status === "offline" ? (
                    <span className="text-slate-500">오프라인</span>
                  ) : (
                    <span className="text-red-600">오류</span>
                  )}
                </p>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
