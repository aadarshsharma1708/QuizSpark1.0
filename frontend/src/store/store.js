import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import categorySlice from './slices/categorySlice'
import questionSlice from './slices/questionSlice'
import quizSlice from './slices/quizSlice'
import leaderboardSlice from './slices/leaderboardSlice'
import uiSlice from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    categories: categorySlice,
    questions: questionSlice,
    quiz: quizSlice,
    leaderboard: leaderboardSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})