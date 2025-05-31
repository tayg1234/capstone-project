import type React from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { CalendarDays, MapPin, Store, User, Utensils } from "lucide-react"

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* 헤더 */}
      <header className="bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Utensils className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">스마트 좌석 관리</h1>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-600 dark:text-slate-300">안녕하세요, {user?.name}님</span>
                <Link to={user?.role === "customer" ? "/customer" : "/business"}>
                  <Button variant="outline" size="sm">
                    {user?.role === "customer" ? "고객 대시보드" : "사업자 대시보드"}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login?role=customer">
                  <Button variant="outline" size="sm">
                    고객 로그인
                  </Button>
                </Link>
                <Link to="/login?role=business">
                  <Button variant="outline" size="sm">
                    사업자 로그인
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            스마트한 레스토랑 좌석 관리 시스템
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
            실시간 좌석 현황 확인, 간편한 예약, 그리고 효율적인 레스토랑 관리를 위한 올인원 솔루션
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login?role=customer">
              <Button size="lg" className="w-full sm:w-auto">
                <User className="mr-2 h-5 w-5" /> 고객으로 시작하기
              </Button>
            </Link>
            <Link to="/login?role=business">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Store className="mr-2 h-5 w-5" /> 사업자로 시작하기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">주요 기능</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <MapPin className="h-10 w-10 text-primary mb-2" />
                <CardTitle>실시간 좌석 현황</CardTitle>
                <CardDescription>레스토랑의 실시간 좌석 현황을 확인하고 원하는 자리를 선택하세요.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  AI 기반 카메라 시스템으로 실시간 좌석 점유 상태를 정확하게 파악합니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CalendarDays className="h-10 w-10 text-primary mb-2" />
                <CardTitle>간편한 예약 시스템</CardTitle>
                <CardDescription>원하는 날짜와 시간에 예약하고 메뉴까지 미리 선택하세요.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  직관적인 인터페이스로 예약부터 결제까지 한 번에 처리할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Store className="h-10 w-10 text-primary mb-2" />
                <CardTitle>사업자 관리 도구</CardTitle>
                <CardDescription>레스토랑 운영을 위한 다양한 관리 도구를 제공합니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  예약 관리, 메뉴 관리, 좌석 배치 등 비즈니스에 필요한 모든 기능을 제공합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Utensils className="h-6 w-6 mr-2" />
              <span className="text-lg font-bold">스마트 좌석 관리</span>
            </div>
            <div className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} 스마트 좌석 관리 시스템. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
