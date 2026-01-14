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

// Add CORS headers to all requests
api.interceptors.request.use((config) => {
  config.headers["Access-Control-Allow-Origin"] = "*";
  return config;
});

// Add a request interceptor to add the token to all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get random questions for quiz
const getRandomQuestions = async (
  categoryId,
  count = 10,
  difficulty = "mixed"
) => {
  const params = { count, difficulty };
  const response = await api.get(`/questions/random/${categoryId}`, { params });
  return response.data;
};

// Get all questions (admin)
// const getQuestions = async (params = {}) => {
//   const response = await api.get("/questions", { params });
//   return response.data;
// };
const getQuestions = async (params = {}) => {
  // ✅ FIX: Create a new object for clean parameters
  let cleanParams = { ...params };
  
  if (!cleanParams.limit) {
      cleanParams.limit = 100; // Request 100 items per page
  }
  // 🛑 CRITICAL CHECK: Remove the category filter if it's set to 'all'
  if (cleanParams.category === 'all') {
    delete cleanParams.category;
  }
  
  const response = await api.get("/questions", { params: cleanParams });
  return response.data;
};

// Get single question (admin)
const getQuestion = async (id) => {
  const response = await api.get(`/questions/${id}`);
  return response.data;
};

// Create question (admin)
const createQuestion = async (questionData) => {
  const response = await api.post("/questions", questionData);
  return response.data;
};

// Update question (admin)
const updateQuestion = async (id, questionData) => {
  const response = await api.put(`/questions/${id}`, questionData);
  return response.data;
};

// Delete question (admin)
const deleteQuestion = async (id) => {
  const response = await api.delete(`/questions/${id}`);
  return response.data;
};

const questionService = {
  getRandomQuestions,
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};

export default questionService;
