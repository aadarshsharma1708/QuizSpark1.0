import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor for token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Start a new quiz
const startQuiz = async (quizData, token) => {
  if (!token) {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      throw new Error("Authentication token is required");
    }
    token = storedToken;
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await api.post("/quizzes/start", quizData, config);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }
    throw error;
  }
};

// Submit quiz answers
const submitQuiz = async (submissionData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.post("/quizzes/submit", submissionData, config);
  return response.data;
};

// Get quiz history
const getQuizHistory = async (params = {}, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  };

  const response = await api.get("/quizzes/history", config);
  if (response.data.success) {
    return {
      quizzes: response.data.data,
      total: response.data.total,
      pagination: response.data.pagination,
    };
  }
  throw new Error(response.data.message || "Failed to fetch quiz history");
};

// Get quiz review
const getQuizReview = async (quizId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get(`/quizzes/${quizId}/review`, config);
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || "Failed to fetch quiz review");
};

// Get user stats
const getUserStats = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get("/quizzes/stats", config);
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || "Failed to fetch user stats");
};

const quizService = {
  startQuiz,
  submitQuiz,
  getQuizHistory,
  getQuizReview,
  getUserStats,
};

export default quizService;
