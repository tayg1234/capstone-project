"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { login } from "../../redux/slices/authSlice"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { ArrowLeft, Store, User } from "lucide-react"

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()

  // URL 쿼리 파라미터 파싱
  const queryParams = new URLSearchParams(location.search)
  const defaultRole = queryParams.get("role") || "customer"

  const { isAuthenticated, user, isLoading, error } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: defaultRole,
  })

  // 이미 로그인한 사용자 리디렉션
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "customer") {
        navigate("/customer")
      } else if (user?.role === "business") {
        navigate("/business")
      }
    }
  }, [isAuthenticated, user, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await dispatch(
        login({
          username: formData.username,
          password: formData.password,
        }),
      ).unwrap()

      // 로그인 성공 시 리디렉션은 useEffect에서 처리
    } catch (error) {
      // 에러는 Redux 상태에서 처리
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md">
        <Link
          to="/"
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
              {error && <div className="text-red-500 text-sm">{error}</div>}
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
              <Link to={`/signup?role=${formData.role}`} className="text-blue-600 hover:underline dark:text-blue-400">
                회원가입
              </Link>
            </div>
            <div className="text-center text-sm">
              {formData.role === "customer" ? (
                <Link to="/login?role=business" className="text-slate-600 hover:underline dark:text-slate-400">
                  사업자로 로그인하기
                </Link>
              ) : (
                <Link to="/login?role=customer" className="text-slate-600 hover:underline dark:text-slate-400">
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

export default LoginPage
