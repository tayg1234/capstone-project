"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Store, User } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // URL에서 role 파라미터 가져오기 (customer 또는 business)
  const role = (searchParams.get("role") as "customer" | "business") || "customer"
  const [isLoading, setIsLoading] = useState(false)

  // 고객 회원가입 폼 데이터
  const [customerForm, setCustomerForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    phone: "",
  })

  // 사업자 회원가입 폼 데이터
  const [businessForm, setBusinessForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessNumber: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
  })

  // 유효하지 않은 역할이면 메인 페이지로 리다이렉트
  useEffect(() => {
    if (role !== "customer" && role !== "business") {
      router.push("/")
    }
  }, [role, router])

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBusinessForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (customerForm.password !== customerForm.confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // 실제로는 API 호출을 통해 회원가입 처리
      // 여기서는 더미 데이터로 성공 처리
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "회원가입 성공",
        description: "고객 계정이 성공적으로 생성되었습니다. 로그인해주세요.",
      })

      router.push("/login?role=customer")
    } catch (error) {
      toast({
        title: "회원가입 실패",
        description: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (businessForm.password !== businessForm.confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // 실제로는 API 호출을 통해 회원가입 처리
      // 여기서는 더미 데이터로 성공 처리
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "회원가입 성공",
        description: "사업자 계정이 성공적으로 생성되었습니다. 로그인해주세요.",
      })

      router.push("/login?role=business")
    } catch (error) {
      toast({
        title: "회원가입 실패",
        description: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="flex items-center mb-6 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          메인으로 돌아가기
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-2">
              {role === "customer" ? (
                <User className="h-8 w-8 text-slate-600" />
              ) : (
                <Store className="h-8 w-8 text-slate-600" />
              )}
            </div>
            <CardTitle className="text-center">{role === "customer" ? "고객 회원가입" : "사업자 회원가입"}</CardTitle>
            <CardDescription className="text-center">
              {role === "customer"
                ? "고객 계정을 생성하여 예약 서비스를 이용하세요"
                : "사업자 계정을 생성하여 비즈니스를 관리하세요"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {role === "customer" ? (
              <form onSubmit={handleCustomerSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-username">아이디</Label>
                  <Input
                    id="customer-username"
                    name="username"
                    value={customerForm.username}
                    onChange={handleCustomerChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-password">비밀번호</Label>
                  <Input
                    id="customer-password"
                    name="password"
                    type="password"
                    value={customerForm.password}
                    onChange={handleCustomerChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-confirm-password">비밀번호 확인</Label>
                  <Input
                    id="customer-confirm-password"
                    name="confirmPassword"
                    type="password"
                    value={customerForm.confirmPassword}
                    onChange={handleCustomerChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-name">이름</Label>
                  <Input
                    id="customer-name"
                    name="name"
                    value={customerForm.name}
                    onChange={handleCustomerChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-email">이메일</Label>
                  <Input
                    id="customer-email"
                    name="email"
                    type="email"
                    value={customerForm.email}
                    onChange={handleCustomerChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-phone">전화번호</Label>
                  <Input
                    id="customer-phone"
                    name="phone"
                    value={customerForm.phone}
                    onChange={handleCustomerChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                  {isLoading ? "처리 중..." : "고객으로 가입하기"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleBusinessSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business-username">아이디</Label>
                  <Input
                    id="business-username"
                    name="username"
                    value={businessForm.username}
                    onChange={handleBusinessChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-password">비밀번호</Label>
                  <Input
                    id="business-password"
                    name="password"
                    type="password"
                    value={businessForm.password}
                    onChange={handleBusinessChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-confirm-password">비밀번호 확인</Label>
                  <Input
                    id="business-confirm-password"
                    name="confirmPassword"
                    type="password"
                    value={businessForm.confirmPassword}
                    onChange={handleBusinessChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-name">상호명</Label>
                  <Input
                    id="business-name"
                    name="businessName"
                    value={businessForm.businessName}
                    onChange={handleBusinessChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-number">사업자등록번호</Label>
                  <Input
                    id="business-number"
                    name="businessNumber"
                    value={businessForm.businessNumber}
                    onChange={handleBusinessChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner-name">대표자명</Label>
                  <Input
                    id="owner-name"
                    name="ownerName"
                    value={businessForm.ownerName}
                    onChange={handleBusinessChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-email">이메일</Label>
                  <Input
                    id="business-email"
                    name="email"
                    type="email"
                    value={businessForm.email}
                    onChange={handleBusinessChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-phone">전화번호</Label>
                  <Input
                    id="business-phone"
                    name="phone"
                    value={businessForm.phone}
                    onChange={handleBusinessChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-address">주소</Label>
                  <Input
                    id="business-address"
                    name="address"
                    value={businessForm.address}
                    onChange={handleBusinessChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                  {isLoading ? "처리 중..." : "사업자로 가입하기"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm">
              이미 계정이 있으신가요?{" "}
              <Link href={`/login?role=${role}`} className="text-blue-600 hover:underline dark:text-blue-400">
                로그인
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
