import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import reservationService from "../../services/reservationService"

export interface Reservation {
  id: string
  restaurantId: string
  restaurantName: string
  customerId: string
  date: string
  time: string
  partySize: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  tableNumber?: number
  menuItems?: { id: string; name: string; quantity: number; price: number }[]
  totalPrice?: number
}

interface ReservationState {
  reservations: Reservation[]
  currentReservation: Reservation | null
  isLoading: boolean
  error: string | null
}

const initialState: ReservationState = {
  reservations: [],
  currentReservation: null,
  isLoading: false,
  error: null,
}

// 사용자의 모든 예약 가져오기
export const fetchUserReservations = createAsyncThunk(
  "reservation/fetchUserReservations",
  async (_, { rejectWithValue }) => {
    try {
      return await reservationService.getUserReservations()
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "예약 정보를 불러오는 중 오류가 발생했습니다.")
    }
  },
)

// 예약 생성
export const createReservation = createAsyncThunk(
  "reservation/create",
  async (reservationData: Partial<Reservation>, { rejectWithValue }) => {
    try {
      return await reservationService.createReservation(reservationData)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "예약 생성 중 오류가 발생했습니다.")
    }
  },
)

// 예약 취소
export const cancelReservation = createAsyncThunk(
  "reservation/cancel",
  async (reservationId: string, { rejectWithValue }) => {
    try {
      await reservationService.cancelReservation(reservationId)
      return reservationId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "예약 취소 중 오류가 발생했습니다.")
    }
  },
)

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    setCurrentReservation: (state, action: PayloadAction<Reservation | null>) => {
      state.currentReservation = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // 사용자의 모든 예약 가져오기
      .addCase(fetchUserReservations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserReservations.fulfilled, (state, action: PayloadAction<Reservation[]>) => {
        state.isLoading = false
        state.reservations = action.payload
      })
      .addCase(fetchUserReservations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // 예약 생성
      .addCase(createReservation.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createReservation.fulfilled, (state, action: PayloadAction<Reservation>) => {
        state.isLoading = false
        state.reservations.push(action.payload)
        state.currentReservation = action.payload
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // 예약 취소
      .addCase(cancelReservation.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(cancelReservation.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        state.reservations = state.reservations.map((reservation) =>
          reservation.id === action.payload ? { ...reservation, status: "cancelled" } : reservation,
        )
        if (state.currentReservation?.id === action.payload) {
          state.currentReservation = { ...state.currentReservation, status: "cancelled" }
        }
      })
      .addCase(cancelReservation.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setCurrentReservation, clearError } = reservationSlice.actions
export default reservationSlice.reducer
