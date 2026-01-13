
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import leaderboardService from '../../services/leaderboardService'

const initialState = {
  globalLeaderboard: [],
  categoryLeaderboard: [],
  userRank: null,
  isLoading: false,
  isError: false,
  message: ''
}

// Get global leaderboard
export const getGlobalLeaderboard = createAsyncThunk(
  'leaderboard/getGlobal',
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token
      return await leaderboardService.getGlobalLeaderboard(params, token)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get category leaderboard
export const getCategoryLeaderboard = createAsyncThunk(
  'leaderboard/getCategory',
  async ({ categoryId, params }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token
      return await leaderboardService.getCategoryLeaderboard(categoryId, params, token)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get user rank
export const getUserRank = createAsyncThunk(
  'leaderboard/getUserRank',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token
      return await leaderboardService.getUserRank(token)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ''
    },
    clearLeaderboards: (state) => {
      state.globalLeaderboard = []
      state.categoryLeaderboard = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGlobalLeaderboard.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getGlobalLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false
        state.globalLeaderboard = action.payload.data
      })
      .addCase(getGlobalLeaderboard.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getCategoryLeaderboard.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCategoryLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false
        state.categoryLeaderboard = action.payload.data
      })
      .addCase(getCategoryLeaderboard.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getUserRank.fulfilled, (state, action) => {
        state.userRank = action.payload.data
      })
  }
})

export const { reset, clearLeaderboards } = leaderboardSlice.actions
export default leaderboardSlice.reducer