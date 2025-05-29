"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, ImagePlus } from "lucide-react"
import { Switch } from "@/components/ui/switch"

// 메뉴 인터페이스 정의
interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  available: boolean
}

export function MenuManager() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // 메뉴 목데이터
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "menu-1",
      name: "마르게리타 피자",
      description: "토마토 소스, 모짜렐라, 바질을 곁들인 클래식 피자",
      price: 15000,
      category: "메인",
      image: "/placeholder.svg?height=100&width=100",
      available: true,
    },
    {
      id: "menu-2",
      name: "스파게티 카르보나라",
      description: "계란, 치즈, 판체타, 후추를 곁들인 파스타",
      price: 16000,
      category: "메인",
      image: "/placeholder.svg?height=100&width=100",
      available: true,
    },
    {
      id: "menu-3",
      name: "티라미수",
      description: "커피와 마스카포네를 곁들인 클래식 이탈리안 디저트",
      price: 8000,
      category: "디저트",
      image: "/placeholder.svg?height=100&width=100",
      available: true,
    },
    {
      id: "menu-4",
      name: "카프레제 샐러드",
      description: "토마토, 모짜렐라, 바질, 발사믹 글레이즈",
      price: 12000,
      category: "전채",
      image: "/placeholder.svg?height=100&width=100",
      available: false,
    },
  ])

  // 카테고리 목록
  const categories = ["전채", "메인", "디저트", "음료", "사이드"]

  // 새 메뉴 폼 상태
  const [newMenuItem, setNewMenuItem] = useState<Omit<MenuItem, "id">>({
    name: "",
    description: "",
    price: 0,
    category: "메인",
    image: "/placeholder.svg?height=100&width=100",
    available: true,
  })

  // 메뉴 수정 상태
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  // 메뉴 추가 처리
  const handleAddMenuItem = () => {
    if (!newMenuItem.name || newMenuItem.price <= 0) {
      toast({
        title: "입력 오류",
        description: "메뉴 이름과 가격을 올바르게 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // 실제로는 API 호출을 통해 메뉴 추가
    setTimeout(() => {
      const newMenuItemWith: MenuItem = {
        ...newMenuItem,
        id: `menu-${menuItems.length + 1}`,
      }

      setMenuItems([...menuItems, newMenuItemWith])
      setNewMenuItem({
        name: "",
        description: "",
        price: 0,
        category: "메인",
        image: "/placeholder.svg?height=100&width=100",
        available: true,
      })

      toast({
        title: "메뉴 추가 완료",
        description: `${newMenuItem.name} 메뉴가 추가되었습니다.`,
      })

      setIsLoading(false)
    }, 1000)
  }

  // 메뉴 수정 처리
  const handleEditMenuItem = () => {
    if (!editingMenuItem) return

    if (!editingMenuItem.name || editingMenuItem.price <= 0) {
      toast({
        title: "입력 오류",
        description: "메뉴 이름과 가격을 올바르게 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // 실제로는 API 호출을 통해 메뉴 수정
    setTimeout(() => {
      setMenuItems(menuItems.map((item) => (item.id === editingMenuItem.id ? editingMenuItem : item)))

      toast({
        title: "메뉴 수정 완료",
        description: `${editingMenuItem.name} 메뉴가 수정되었습니다.`,
      })

      setShowEditDialog(false)
      setEditingMenuItem(null)
      setIsLoading(false)
    }, 1000)
  }

  // 메뉴 삭제 처리
  const handleDeleteMenuItem = (id: string) => {
    setIsLoading(true)

    // 실제로는 API 호출을 통해 메뉴 삭제
    setTimeout(() => {
      const menuToDelete = menuItems.find((item) => item.id === id)
      setMenuItems(menuItems.filter((item) => item.id !== id))

      toast({
        title: "메뉴 삭제 완료",
        description: `${menuToDelete?.name} 메뉴가 삭제되었습니다.`,
      })

      setIsLoading(false)
    }, 1000)
  }

  // 메뉴 가용성 토글
  const toggleMenuAvailability = (id: string) => {
    setMenuItems(menuItems.map((item) => (item.id === id ? { ...item, available: !item.available } : item)))

    const menuItem = menuItems.find((item) => item.id === id)
    toast({
      title: menuItem?.available ? "메뉴 비활성화" : "메뉴 활성화",
      description: `${menuItem?.name} 메뉴가 ${menuItem?.available ? "비활성화" : "활성화"}되었습니다.`,
    })
  }

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* 메뉴 추가 다이얼로그 */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Plus className="mr-2 h-4 w-4" /> 메뉴 추가
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>새 메뉴 추가</DialogTitle>
            <DialogDescription>
              새로운 메뉴를 추가하세요. 메뉴 정보를 입력한 후 추가 버튼을 클릭하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="menu-name" className="text-right">
                메뉴 이름
              </Label>
              <Input
                id="menu-name"
                value={newMenuItem.name}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="menu-description" className="text-right">
                설명
              </Label>
              <Textarea
                id="menu-description"
                value={newMenuItem.description}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="menu-price" className="text-right">
                가격 (원)
              </Label>
              <Input
                id="menu-price"
                type="number"
                value={newMenuItem.price}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, price: Number.parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="menu-category" className="text-right">
                카테고리
              </Label>
              <Select
                value={newMenuItem.category}
                onValueChange={(value) => setNewMenuItem({ ...newMenuItem, category: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="menu-image" className="text-right">
                이미지
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <div className="w-16 h-16 border rounded flex items-center justify-center overflow-hidden">
                  <img
                    src={newMenuItem.image || "/placeholder.svg"}
                    alt="메뉴 이미지"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button variant="outline" size="sm" type="button">
                  <ImagePlus className="h-4 w-4 mr-2" />
                  이미지 업로드
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="menu-available" className="text-right">
                판매 가능
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="menu-available"
                  checked={newMenuItem.available}
                  onCheckedChange={(checked) => setNewMenuItem({ ...newMenuItem, available: checked })}
                />
                <Label htmlFor="menu-available">{newMenuItem.available ? "판매 중" : "판매 중지"}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddMenuItem} disabled={isLoading}>
              {isLoading ? "처리 중..." : "메뉴 추가"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 메뉴 수정 다이얼로그 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>메뉴 수정</DialogTitle>
            <DialogDescription>
              메뉴 정보를 수정하세요. 변경 사항을 저장하려면 저장 버튼을 클릭하세요.
            </DialogDescription>
          </DialogHeader>
          {editingMenuItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-menu-name" className="text-right">
                  메뉴 이름
                </Label>
                <Input
                  id="edit-menu-name"
                  value={editingMenuItem.name}
                  onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-menu-description" className="text-right">
                  설명
                </Label>
                <Textarea
                  id="edit-menu-description"
                  value={editingMenuItem.description}
                  onChange={(e) => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-menu-price" className="text-right">
                  가격 (원)
                </Label>
                <Input
                  id="edit-menu-price"
                  type="number"
                  value={editingMenuItem.price}
                  onChange={(e) =>
                    setEditingMenuItem({
                      ...editingMenuItem,
                      price: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-menu-category" className="text-right">
                  카테고리
                </Label>
                <Select
                  value={editingMenuItem.category}
                  onValueChange={(value) => setEditingMenuItem({ ...editingMenuItem, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-menu-image" className="text-right">
                  이미지
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <div className="w-16 h-16 border rounded flex items-center justify-center overflow-hidden">
                    <img
                      src={editingMenuItem.image || "/placeholder.svg"}
                      alt="메뉴 이미지"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button variant="outline" size="sm" type="button">
                    <ImagePlus className="h-4 w-4 mr-2" />
                    이미지 업로드
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-menu-available" className="text-right">
                  판매 가능
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="edit-menu-available"
                    checked={editingMenuItem.available}
                    onCheckedChange={(checked) => setEditingMenuItem({ ...editingMenuItem, available: checked })}
                  />
                  <Label htmlFor="edit-menu-available">{editingMenuItem.available ? "판매 중" : "판매 중지"}</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleEditMenuItem} disabled={isLoading}>
              {isLoading ? "처리 중..." : "저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 메뉴 카테고리별 그룹화 */}
      <div className="space-y-6">
        {menuItems.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="mt-2 text-lg font-medium">등록된 메뉴가 없습니다</h3>
            <p className="mt-1 text-sm text-slate-500">메뉴를 추가하여 고객에게 제공할 메뉴를 관리하세요.</p>
          </div>
        ) : (
          categories
            .filter((category) => menuItems.some((item) => item.category === category))
            .map((category) => (
              <div key={category} className="space-y-3">
                <h3 className="font-medium text-lg">{category}</h3>
                <div className="space-y-2">
                  {menuItems
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg ${
                          item.available ? "bg-white dark:bg-slate-950" : "bg-slate-50 dark:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center mb-4 sm:mb-0">
                          <div className="w-16 h-16 rounded overflow-hidden mr-4">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium flex items-center">
                              {item.name}
                              {!item.available && (
                                <span className="ml-2 text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                                  판매 중지
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-slate-500 line-clamp-1">{item.description}</p>
                            <p className="text-sm font-medium">{formatPrice(item.price)}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={item.available}
                            onCheckedChange={() => toggleMenuAvailability(item.id)}
                            disabled={isLoading}
                          />

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setEditingMenuItem(item)
                              setShowEditDialog(true)
                            }}
                            disabled={isLoading}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" disabled={isLoading}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>메뉴 삭제</AlertDialogTitle>
                                <AlertDialogDescription>
                                  정말로 이 메뉴를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>취소</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteMenuItem(item.id)}>
                                  삭제
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  )
}
