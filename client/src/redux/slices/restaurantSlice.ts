import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import restaurantService from "../../services/restaurantService"

export interface Restaurant {
  id: string
  name: string
  description: string
  address: string
  district: string
  cuisine: string
  rating: number
  priceRange: string
  imageUrl: string
  occupancy: number
  totalSeats: number
}

interface RestaurantState {
  restaurants: Restaurant[]
  currentRestaurant: Restaurant | null
  isLoading: boolean
  error: string | null
}

const initialState: RestaurantState = {
  restaurants: [],
  currentRestaurant: null,
  isLoading: false,
  error: null,
}

// 모든 레스토랑 가져오기
export const fetchRestaurants = createAsyncThunk("restaurant/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await restaurantService.getAllRestaurants()
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "레스토랑 정보를 불러오는 중 오류가 발생했습니다.")
  }
})

// 레스토랑 검색
export const searchRestaurants = createAsyncThunk(
  "restaurant/search",
  async (searchParams: { query?: string; cuisine?: string; district?: string }, { rejectWithValue }) => {
    try {
      return await restaurantService.searchRestaurants(searchParams)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "레스토랑 검색 중 오류가 발생했습니다.")
    }
  },
)

// 특정 레스토랑 상세 정보 가져오기
export const fetchRestaurantById = createAsyncThunk("restaurant/fetchById", async (id: string, { rejectWithValue }) => {
  try {
    return await restaurantService.getRestaurantById(id)
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "레스토랑 상세 정보를 불러오는 중 오류가 발생했습니다.")
  }
})

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    clearCurrentRestaurant: (state) => {
      state.currentRestaurant = null
    },
  },
  extraReducers: (builder) => {
    builder
      // 모든 레스토랑 가져오기
      .addCase(fetchRestaurants.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRestaurants.fulfilled, (state, action: PayloadAction<Restaurant[]>) => {
        state.isLoading = false
        state.restaurants = action.payload
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // 레스토랑 검색
      .addCase(searchRestaurants.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(searchRestaurants.fulfilled, (state, action: PayloadAction<Restaurant[]>) => {
        state.isLoading = false
        state.restaurants = action.payload
      })
      .addCase(searchRestaurants.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // 특정 레스토랑 상세 정보 가져오기
      .addCase(fetchRestaurantById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action: PayloadAction<Restaurant>) => {
        state.isLoading = false
        state.currentRestaurant = action.payload
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentRestaurant } = restaurantSlice.actions
export default restaurantSlice.reducer
