import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import restaurantReducer from "./slices/restaurantSlice"
import reservationReducer from "./slices/reservationSlice"
import menuReducer from "./slices/menuSlice"
import seatReducer from "./slices/seatSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurant: restaurantReducer,
    reservation: reservationReducer,
    menu: menuReducer,
    seat: seatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
