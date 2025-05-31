"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Camera, Plus, Settings, Trash2, RefreshCw } from "lucide-react"

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

export function CameraManager() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // 카메라 목데이터
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
      status: "offline",
      enabled: false,
    },
  ])

  // 새 카메라 폼 상태
  const [newCamera, setNewCamera] = useState<Omit<CameraDevice, "id" | "status">>({
    name: "",
    location: "",
    type: "ip",
    url: "",
    enabled: true,
  })

  // 카메라 수정 상태
  const [editingCamera, setEditingCamera] = useState<CameraDevice | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  // 카메라 추가 처리
  const handleAddCamera = () => {
    setIsLoading(true)

    // 실제로는 API 호출을 통해 카메라 추가
    setTimeout(() => {
      const newCameraWithId: CameraDevice = {
        ...newCamera,
        id: `cam-${cameras.length + 1}`,
        status: "offline", // 초기 상태는 오프라인
      }

      setCameras([...cameras, newCameraWithId])
      setNewCamera({
        name: "",
        location: "",
        type: "ip",
        url: "",
        enabled: true,
      })

      toast({
        title: "카메라 추가 완료",
        description: `${newCamera.name} 카메라가 추가되었습니다.`,
      })

      setIsLoading(false)
    }, 1000)
  }

  // 카메라 수정 처리
  const handleEditCamera = () => {
    if (!editingCamera) return

    setIsLoading(true)

    // 실제로는 API 호출을 통해 카메라 수정
    setTimeout(() => {
      setCameras(cameras.map((camera) => (camera.id === editingCamera.id ? editingCamera : camera)))

      toast({
        title: "카메라 수정 완료",
        description: `${editingCamera.name} 카메라가 수정되었습니다.`,
      })

      setShowEditDialog(false)
      setEditingCamera(null)
      setIsLoading(false)
    }, 1000)
  }

  // 카메라 삭제 처리
  const handleDeleteCamera = (id: string) => {
    setIsLoading(true)

    // 실제로는 API 호출을 통해 카메라 삭제
    setTimeout(() => {
      const cameraToDelete = cameras.find((camera) => camera.id === id)
      setCameras(cameras.filter((camera) => camera.id !== id))

      toast({
        title: "카메라 삭제 완료",
        description: `${cameraToDelete?.name} 카메라가 삭제되었습니다.`,
      })

      setIsLoading(false)
    }, 1000)
  }

  // 카메라 활성화/비활성화 토글
  const toggleCameraEnabled = (id: string) => {
    setCameras(cameras.map((camera) => (camera.id === id ? { ...camera, enabled: !camera.enabled } : camera)))

    const camera = cameras.find((c) => c.id === id)
    toast({
      title: camera?.enabled ? "카메라 비활성화" : "카메라 활성화",
      description: `${camera?.name} 카메라가 ${camera?.enabled ? "비활성화" : "활성화"}되었습니다.`,
    })
  }

  // 카메라 연결 테스트
  const testCameraConnection = (id: string) => {
    const camera = cameras.find((c) => c.id === id)
    if (!camera) return

    setIsLoading(true)

    // 실제로는 API 호출을 통해 카메라 연결 테스트
    setTimeout(() => {
      // 랜덤하게 성공 또는 실패 (데모용)
      const success = Math.random() > 0.3

      setCameras(cameras.map((c) => (c.id === id ? { ...c, status: success ? "online" : "error" } : c)))

      toast({
        title: success ? "연결 성공" : "연결 실패",
        description: success
          ? `${camera.name} 카메라에 성공적으로 연결되었습니다.`
          : `${camera.name} 카메라 연결에 실패했습니다. 설정을 확인해주세요.`,
        variant: success ? "default" : "destructive",
      })

      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* 카메라 추가 다이얼로그 */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Plus className="mr-2 h-4 w-4" /> 카메라 추가
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>새 카메라 추가</DialogTitle>
            <DialogDescription>
              새로운 CCTV 카메라를 추가하세요. 카메라 정보를 입력한 후 추가 버튼을 클릭하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="camera-name" className="text-right">
                카메라 이름
              </Label>
              <Input
                id="camera-name"
                value={newCamera.name}
                onChange={(e) => setNewCamera({ ...newCamera, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="camera-location" className="text-right">
                설치 위치
              </Label>
              <Input
                id="camera-location"
                value={newCamera.location}
                onChange={(e) => setNewCamera({ ...newCamera, location: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="camera-type" className="text-right">
                카메라 유형
              </Label>
              <Select
                value={newCamera.type}
                onValueChange={(value) => setNewCamera({ ...newCamera, type: value as any })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="카메라 유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ip">IP 카메라</SelectItem>
                  <SelectItem value="usb">USB 카메라</SelectItem>
                  <SelectItem value="rtsp">RTSP 스트림</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="camera-url" className="text-right">
                카메라 URL
              </Label>
              <Input
                id="camera-url"
                value={newCamera.url}
                onChange={(e) => setNewCamera({ ...newCamera, url: e.target.value })}
                className="col-span-3"
                placeholder={
                  newCamera.type === "ip"
                    ? "http://192.168.1.100:8080/video"
                    : newCamera.type === "rtsp"
                      ? "rtsp://username:password@192.168.1.101:554/stream"
                      : "usb://camera-id"
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="camera-enabled" className="text-right">
                활성화
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="camera-enabled"
                  checked={newCamera.enabled}
                  onCheckedChange={(checked) => setNewCamera({ ...newCamera, enabled: checked })}
                />
                <Label htmlFor="camera-enabled">{newCamera.enabled ? "활성화" : "비활성화"}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddCamera} disabled={isLoading}>
              {isLoading ? "처리 중..." : "카메라 추가"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 카메라 수정 다이얼로그 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>카메라 설정 수정</DialogTitle>
            <DialogDescription>
              카메라 설정을 수정하세요. 변경 사항을 저장하려면 저장 버튼을 클릭하세요.
            </DialogDescription>
          </DialogHeader>
          {editingCamera && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-camera-name" className="text-right">
                  카메라 이름
                </Label>
                <Input
                  id="edit-camera-name"
                  value={editingCamera.name}
                  onChange={(e) => setEditingCamera({ ...editingCamera, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-camera-location" className="text-right">
                  설치 위치
                </Label>
                <Input
                  id="edit-camera-location"
                  value={editingCamera.location}
                  onChange={(e) => setEditingCamera({ ...editingCamera, location: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-camera-type" className="text-right">
                  카메라 유형
                </Label>
                <Select
                  value={editingCamera.type}
                  onValueChange={(value) => setEditingCamera({ ...editingCamera, type: value as any })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="카메라 유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ip">IP 카메라</SelectItem>
                    <SelectItem value="usb">USB 카메라</SelectItem>
                    <SelectItem value="rtsp">RTSP 스트림</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-camera-url" className="text-right">
                  카메라 URL
                </Label>
                <Input
                  id="edit-camera-url"
                  value={editingCamera.url}
                  onChange={(e) => setEditingCamera({ ...editingCamera, url: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-camera-enabled" className="text-right">
                  활성화
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="edit-camera-enabled"
                    checked={editingCamera.enabled}
                    onCheckedChange={(checked) => setEditingCamera({ ...editingCamera, enabled: checked })}
                  />
                  <Label htmlFor="edit-camera-enabled">{editingCamera.enabled ? "활성화" : "비활성화"}</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleEditCamera} disabled={isLoading}>
              {isLoading ? "처리 중..." : "저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 카메라 목록 */}
      <div className="space-y-4">
        {cameras.length === 0 ? (
          <div className="text-center py-8">
            <Camera className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-lg font-medium">등록된 카메라가 없습니다</h3>
            <p className="mt-1 text-sm text-slate-500">카메라를 추가하여 실시간 좌석 모니터링을 시작하세요.</p>
          </div>
        ) : (
          cameras.map((camera) => (
            <div
              key={camera.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-white dark:bg-slate-950"
            >
              <div className="flex items-center mb-4 md:mb-0">
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    camera.status === "online"
                      ? "bg-green-500"
                      : camera.status === "offline"
                        ? "bg-slate-400"
                        : "bg-red-500"
                  }`}
                ></div>
                <div>
                  <h3 className="font-medium">{camera.name}</h3>
                  <p className="text-sm text-slate-500">
                    {camera.location} • {camera.type.toUpperCase()} •{" "}
                    {camera.status === "online" ? "온라인" : camera.status === "offline" ? "오프라인" : "오류"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={camera.enabled}
                  onCheckedChange={() => toggleCameraEnabled(camera.id)}
                  disabled={isLoading}
                />

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => testCameraConnection(camera.id)}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setEditingCamera(camera)
                    setShowEditDialog(true)
                  }}
                  disabled={isLoading}
                >
                  <Settings className="h-4 w-4" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" disabled={isLoading}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>카메라 삭제</AlertDialogTitle>
                      <AlertDialogDescription>
                        정말로 이 카메라를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteCamera(camera.id)}>삭제</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
