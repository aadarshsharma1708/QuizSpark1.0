import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import categoryService from '../../services/categoryService'

const initialState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  isError: false,
  message: ''
}

// Get all categories
export const getCategories = createAsyncThunk(
  'categories/getAll',
  async (params, thunkAPI) => {
    try {
      return await categoryService.getCategories(params)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get single category
export const getCategory = createAsyncThunk(
  'categories/getOne',
  async (id, thunkAPI) => {
    try {
      return await categoryService.getCategory(id)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ''
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false
        state.categories = action.payload.data
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getCategory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentCategory = action.payload.data
      })
      .addCase(getCategory.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export const { reset, clearCurrentCategory } = categorySlice.actions
export default categorySlice.reducer