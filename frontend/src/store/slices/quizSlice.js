import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import quizService from "../../services/quizService";

const initialState = {
  currentQuiz: null,
  quizHistory: [],
  quizReview: null,
  userStats: null,
  isLoading: false,
  isError: false,
  message: "",
};

// Start a new quiz
export const startQuiz = createAsyncThunk(
  "quiz/start",
  async ({ quizData, token }, thunkAPI) => {
    try {
      // Double check token
      if (!token) {
        const storeToken = thunkAPI.getState().auth.token;
        if (!storeToken) {
          throw new Error("Authentication required");
        }
        token = storeToken;
      }
      return await quizService.startQuiz(quizData, token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Submit quiz answers
export const submitQuiz = createAsyncThunk(
  "quiz/submit",
  async (submissionData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await quizService.submitQuiz(submissionData, token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get quiz history
export const getQuizHistory = createAsyncThunk(
  "quiz/getHistory",
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await quizService.getQuizHistory(params, token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get quiz review
export const getQuizReview = createAsyncThunk(
  "quiz/getReview",
  async (quizId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await quizService.getQuizReview(quizId, token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user stats
export const getUserStats = createAsyncThunk(
  "quiz/getUserStats",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await quizService.getUserStats(token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
    },
    clearQuizReview: (state) => {
      state.quizReview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startQuiz.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(startQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = "";
        state.currentQuiz = action.payload.data;
        console.log("Quiz started:", action.payload); // Debug log
      })
      .addCase(startQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        console.error("Quiz start failed:", action.payload); // Debug log
        state.currentQuiz = null;
      })
      .addCase(submitQuiz.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentQuiz) {
          state.currentQuiz.results = action.payload.data.results;
          state.currentQuiz.grade = action.payload.data.grade;
          state.currentQuiz.completedAt = action.payload.data.completedAt;

          // Update quiz history if it exists
          if (state.quizHistory) {
            state.quizHistory = [action.payload.data, ...state.quizHistory];
          }

          // Update user stats if they exist
          if (state.userStats) {
            const stats = state.userStats;
            stats.totalQuizzes = (stats.totalQuizzes || 0) + 1;
            stats.totalScore =
              (stats.totalScore || 0) + action.payload.data.results.totalScore;
            stats.averageScore = stats.totalScore / stats.totalQuizzes;
            state.userStats = stats;
          }
        }
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getQuizHistory.fulfilled, (state, action) => {
        state.quizHistory = action.payload.data;
      })
      .addCase(getQuizReview.fulfilled, (state, action) => {
        state.quizReview = action.payload.data;
      })
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.userStats = action.payload.data;
      });
  },
});

export const { reset, clearCurrentQuiz, clearQuizReview } = quizSlice.actions;
export default quizSlice.reducer;
