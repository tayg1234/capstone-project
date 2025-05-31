"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { ArrowLeft, Store, User } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { login } = useAuth()

  // URL에서 role 파라미터 가져오기 (customer 또는 business)
  const defaultRole = searchParams.get("role") || "customer"

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: defaultRole,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 테스트 계정 확인
      if (
        (formData.role === "customer" && formData.username === "customer" && formData.password === "1234") ||
        (formData.role === "business" && formData.username === "business" && formData.password === "1234")
      ) {
        // 로그인 성공
        await login({
          id: formData.username,
          name: formData.role === "customer" ? "고객 사용자" : "사업자 사용자",
          role: formData.role as "customer" | "business",
          email: `${formData.username}@example.com`,
        })

        toast({
          title: "로그인 성공",
          description: "환영합니다!",
        })

        // 적절한 페이지로 리다이렉트
        router.push(formData.role === "customer" ? "/customer" : "/business")
      } else {
        // 로그인 실패
        toast({
          title: "로그인 실패",
          description: "아이디 또는 비밀번호가 올바르지 않습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "로그인 중 문제가 발생했습니다. 다시 시도해주세요.",
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
              {formData.role === "customer" ? (
                <User className="h-8 w-8 text-slate-600" />
              ) : (
                <Store className="h-8 w-8 text-slate-600" />
              )}
            </div>
            <CardTitle className="text-center">
              {formData.role === "customer" ? "고객 로그인" : "사업자 로그인"}
            </CardTitle>
            <CardDescription className="text-center">
              {formData.role === "customer"
                ? "고객 계정으로 로그인하여 예약을 관리하세요"
                : "사업자 계정으로 로그인하여 비즈니스를 관리하세요"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">아이디</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder={formData.role === "customer" ? "customer" : "business"}
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="1234"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <p>테스트 계정:</p>
                <p>아이디: {formData.role === "customer" ? "customer" : "business"}</p>
                <p>비밀번호: 1234</p>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
            <div className="text-center text-sm">
              계정이 없으신가요?{" "}
              <Link href={`/signup?role=${formData.role}`} className="text-blue-600 hover:underline dark:text-blue-400">
                회원가입
              </Link>
            </div>
            <div className="text-center text-sm">
              {formData.role === "customer" ? (
                <Link href="/login?role=business" className="text-slate-600 hover:underline dark:text-slate-400">
                  사업자로 로그인하기
                </Link>
              ) : (
                <Link href="/login?role=customer" className="text-slate-600 hover:underline dark:text-slate-400">
                  고객으로 로그인하기
                </Link>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
