import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import authService from "../../services/authService"

// 사용자 인터페이스 정의
export interface User {
  id: string
  name: string
  role: "customer" | "business"
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// 로그인 비동기 액션
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      return await authService.login(credentials)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "로그인 중 오류가 발생했습니다.")
    }
  },
)

// 회원가입 비동기 액션
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData: { name: string; email: string; password: string; role: string }, { rejectWithValue }) => {
    try {
      return await authService.signup(userData)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "회원가입 중 오류가 발생했습니다.")
    }
  },
)

// 로그아웃 비동기 액션
export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout()
  return null
})

// 사용자 정보 불러오기 비동기 액션
export const loadUser = createAsyncThunk("auth/loadUser", async (_, { rejectWithValue }) => {
  try {
    return await authService.getCurrentUser()
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "사용자 정보를 불러오는 중 오류가 발생했습니다.")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // 로그인
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // 회원가입
      .addCase(signup.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // 로그아웃
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
      })
      // 사용자 정보 불러오기
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loadUser.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = !!action.payload
      })
      .addCase(loadUser.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
