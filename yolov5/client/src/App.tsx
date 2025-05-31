"use client"

import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "./redux/store"
import { loadUser } from "./redux/slices/authSlice"

// 페이지 컴포넌트 import
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/auth/LoginPage"
import SignupPage from "./pages/auth/SignupPage"
import CustomerDashboard from "./pages/customer/Dashboard"
import CustomerBookings from "./pages/customer/Bookings"
import CustomerProfile from "./pages/customer/Profile"
import RestaurantPage from "./pages/customer/RestaurantPage"
import BusinessDashboard from "./pages/business/Dashboard"
import { Toaster } from "./components/ui/toaster"

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children, role }: { children: JSX.Element; role?: "customer" | "business" }) => {
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth)

  // 로딩 중일 때는 로딩 표시
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">로딩 중...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" />
  }

  return children
}

function App() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  return (
    <Router>
      <Routes>
        {/* 공용 라우트 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 고객 라우트 */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/bookings"
          element={
            <ProtectedRoute role="customer">
              <CustomerBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/profile"
          element={
            <ProtectedRoute role="customer">
              <CustomerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/store/:id"
          element={
            <ProtectedRoute role="customer">
              <RestaurantPage />
            </ProtectedRoute>
          }
        />

        {/* 비즈니스 라우트 */}
        <Route
          path="/business"
          element={
            <ProtectedRoute role="business">
              <BusinessDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 페이지 */}
        <Route
          path="*"
          element={<div className="flex h-screen items-center justify-center">페이지를 찾을 수 없습니다.</div>}
        />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
