import type { User } from "../redux/slices/authSlice"

// 테스트용 더미 데이터
const dummyUsers = {
  customer: {
    id: "customer",
    name: "고객 사용자",
    role: "customer",
    email: "customer@example.com",
  },
  business: {
    id: "business",
    name: "사업자 사용자",
    role: "business",
    email: "business@example.com",
  },
}

const authService = {
  // 로그인
  async login(credentials: { username: string; password: string }): Promise<User> {
    try {
      // 실제 API 호출 (주석 처리)
      // const response = await api.post('/auth/login', credentials);
      // localStorage.setItem('token', response.data.token);
      // localStorage.setItem('user', JSON.stringify(response.data.user));
      // return response.data.user;

      // 테스트용 더미 데이터
      if (
        (credentials.username === "customer" && credentials.password === "1234") ||
        (credentials.username === "business" && credentials.password === "1234")
      ) {
        const user = dummyUsers[credentials.username as keyof typeof dummyUsers]
        localStorage.setItem("token", "dummy-token")
        localStorage.setItem("user", JSON.stringify(user))
        return user as User
      }
      throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.")
    } catch (error) {
      throw error
    }
  },

  // 회원가입
  async signup(userData: { name: string; email: string; password: string; role: string }): Promise<void> {
    try {
      // 실제 API 호출 (주석 처리)
      // const response = await api.post('/auth/signup', userData);
      // return response.data;

      // 테스트용 더미 데이터
      console.log("회원가입 성공:", userData)
      return
    } catch (error) {
      throw error
    }
  },

  // 로그아웃
  async logout(): Promise<void> {
    try {
      // 실제 API 호출 (주석 처리)
      // await api.post('/auth/logout');
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    } catch (error) {
      throw error
    }
  },

  // 현재 사용자 정보 가져오기
  async getCurrentUser(): Promise<User | null> {
    try {
      // 실제 API 호출 (주석 처리)
      // const response = await api.get('/auth/me');
      // return response.data;

      // 테스트용 더미 데이터
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        return JSON.parse(storedUser)
      }
      return null
    } catch (error) {
      throw error
    }
  },
}

export default authService
