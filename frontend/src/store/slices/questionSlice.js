import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import questionService from '../../services/questionService'

const initialState = {
  questions: [],
  currentQuestion: null,
  isLoading: false,
  isError: false,
  message: ''
}

// Get random questions for quiz
export const getRandomQuestions = createAsyncThunk(
  'questions/getRandom',
  async ({ categoryId, count, difficulty }, thunkAPI) => {
    try {
      return await questionService.getRandomQuestions(categoryId, count, difficulty)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ''
    },
    clearQuestions: (state) => {
      state.questions = []
      state.currentQuestion = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRandomQuestions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getRandomQuestions.fulfilled, (state, action) => {
        state.isLoading = false
        state.questions = action.payload.data
      })
      .addCase(getRandomQuestions.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export const { reset, clearQuestions } = questionSlice.actions
export default questionSlice.reducer