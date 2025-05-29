"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import CustomerLayout from "@/components/customer-layout"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, MapPin, LogOut } from "lucide-react"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  // 프로필 폼 데이터
  const [profileForm, setProfileForm] = useState({
    name: "고객 사용자",
    email: "customer@example.com",
    phone: "010-1234-5678",
    address: "서울시 강남구 123번길 45",
  })

  // 인증 확인
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "접근 제한",
        description: "로그인이 필요한 페이지입니다.",
        variant: "destructive",
      })
      router.push("/login?role=customer")
    } else if (!isLoading && user?.role !== "customer") {
      toast({
        title: "접근 제한",
        description: "고객 계정으로만 접근 가능합니다.",
        variant: "destructive",
      })
      router.push("/")
    }
  }, [isLoading, isAuthenticated, user, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    toast({
      title: "프로필 저장 완료",
      description: "프로필 정보가 성공적으로 저장되었습니다.",
    })
    setIsEditing(false)
  }

  const handleLogout = async () => {
    await logout()
    toast({
      title: "로그아웃 성공",
      description: "성공적으로 로그아웃되었습니다.",
    })
    router.push("/")
  }

  // 로딩 중이거나 인증되지 않은 경우 빈  페이지 반환
  if (isLoading || !isAuthenticated || user?.role !== "customer") {
    return null
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto p-4 pb-20 md:pb-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">내 정보</h1>
          <p className="text-slate-600">개인 정보를 확인하고 관리하세요</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>프로필 정보</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <div className="flex">
                      <User className="h-4 w-4 mr-2 text-slate-500 self-center" />
                      <Input id="name" name="name" value={profileForm.name} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <div className="flex">
                      <Mail className="h-4 w-4 mr-2 text-slate-500 self-center" />
                      <Input id="email" name="email" value={profileForm.email} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <div className="flex">
                      <Phone className="h-4 w-4 mr-2 text-slate-500 self-center" />
                      <Input id="phone" name="phone" value={profileForm.phone} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">주소</Label>
                    <div className="flex">
                      <MapPin className="h-4 w-4 mr-2 text-slate-500 self-center" />
                      <Input id="address" name="address" value={profileForm.address} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      취소
                    </Button>
                    <Button onClick={handleSaveProfile}>저장</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center py-2 border-b">
                    <User className="h-4 w-4 mr-2 text-slate-500" />
                    <span className="text-slate-500 w-20">이름</span>
                    <span className="font-medium">{profileForm.name}</span>
                  </div>
                  <div className="flex items-center py-2 border-b">
                    <Mail className="h-4 w-4 mr-2 text-slate-500" />
                    <span className="text-slate-500 w-20">이메일</span>
                    <span className="font-medium">{profileForm.email}</span>
                  </div>
                  <div className="flex items-center py-2 border-b">
                    <Phone className="h-4 w-4 mr-2 text-slate-500" />
                    <span className="text-slate-500 w-20">전화번호</span>
                    <span className="font-medium">{profileForm.phone}</span>
                  </div>
                  <div className="flex items-center py-2 border-b">
                    <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                    <span className="text-slate-500 w-20">주소</span>
                    <span className="font-medium">{profileForm.address}</span>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setIsEditing(true)}>프로필 수정</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>계정 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2 text-slate-500" />
                    <span>로그아웃</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    로그아웃
                  </Button>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">비밀번호 변경</p>
                    <p className="text-sm text-slate-500">계정 보안을 위해 주기적으로 비밀번호를 변경하세요</p>
                  </div>
                  <Button variant="outline" size="sm">
                    변경하기
                  </Button>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium text-red-600">계정 삭제</p>
                    <p className="text-sm text-slate-500">계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                    계정 삭제
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomerLayout>
  )
}
