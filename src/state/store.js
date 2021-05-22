import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import dataReducer from './dataSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer
  }
})