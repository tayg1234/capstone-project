import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import menuService from "../../services/menuService"

export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  category: string
  imageUrl?: string
  isAvailable: boolean
}

export interface CartItem extends MenuItem {
  quantity: number
}

interface MenuState {
  menuItems: MenuItem[]
  cart: CartItem[]
  isLoading: boolean
  error: string | null
}

const initialState: MenuState = {
  menuItems: [],
  cart: [],
  isLoading: false,
  error: null,
}

// 레스토랑 메뉴 가져오기
export const fetchRestaurantMenu = createAsyncThunk(
  "menu/fetchRestaurantMenu",
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      return await menuService.getRestaurantMenu(restaurantId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "메뉴 정보를 불러오는 중 오류가 발생했습니다.")
    }
  },
)

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<MenuItem>) => {
      const existingItem = state.cart.find((item) => item.id === action.payload.id)
      if (existingItem) {
        state.cart = state.cart.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        state.cart.push({ ...action.payload, quantity: 1 })
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload)
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      state.cart = state.cart.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )
    },
    clearCart: (state) => {
      state.cart = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurantMenu.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRestaurantMenu.fulfilled, (state, action: PayloadAction<MenuItem[]>) => {
        state.isLoading = false
        state.menuItems = action.payload
      })
      .addCase(fetchRestaurantMenu.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = menuSlice.actions
export default menuSlice.reducer
