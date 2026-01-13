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

// Create category (admin)
export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token
      return await categoryService.createCategory(categoryData, token)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update category (admin)
export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, categoryData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token
      return await categoryService.updateCategory(id, categoryData, token)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Delete category (admin)
export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token
      await categoryService.deleteCategory(id, token)
      return id
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
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload.data)
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat._id === action.payload.data._id)
        if (index !== -1) {
          state.categories[index] = action.payload.data
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(cat => cat._id !== action.payload)
      })
  }
})

export const { reset, clearCurrentCategory } = categorySlice.actions
export default categorySlice.reducer