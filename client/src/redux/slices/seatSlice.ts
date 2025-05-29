import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import seatService from "../../services/seatService"

export interface Seat {
  id: string
  restaurantId: string
  tableNumber: number
  capacity: number
  isOccupied: boolean
  x: number
  y: number
  type: "table" | "booth" | "bar"
}

interface SeatState {
  seats: Seat[]
  selectedSeat: Seat | null
  isLoading: boolean
  error: string | null
}

const initialState: SeatState = {
  seats: [],
  selectedSeat: null,
  isLoading: false,
  error: null,
}

// 레스토랑 좌석 정보 가져오기
export const fetchRestaurantSeats = createAsyncThunk(
  "seat/fetchRestaurantSeats",
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      return await seatService.getRestaurantSeats(restaurantId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "좌석 정보를 불러오는 중 오류가 발생했습니다.")
    }
  },
)

const seatSlice = createSlice({
  name: "seat",
  initialState,
  reducers: {
    selectSeat: (state, action: PayloadAction<Seat | null>) => {
      state.selectedSeat = action.payload
    },
    clearSelectedSeat: (state) => {
      state.selectedSeat = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurantSeats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRestaurantSeats.fulfilled, (state, action: PayloadAction<Seat[]>) => {
        state.isLoading = false
        state.seats = action.payload
      })
      .addCase(fetchRestaurantSeats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { selectSeat, clearSelectedSeat } = seatSlice.actions
export default seatSlice.reducer
