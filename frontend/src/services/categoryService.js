import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
// Get all categories
const getCategories = async (params = {}) => {
  const response = await api.get("/categories", { params });
  if (response.data.success) {
    return {
      data: response.data.data,
      total: response.data.total,
    };
  }
  throw new Error(response.data.message || "Failed to fetch categories");
};

// Get single category
const getCategory = async (id) => {
  const response = await api.get(`/categories/${id}`);
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || "Failed to fetch category");
};

// Get category stats
const getCategoryStats = async (id) => {
  const response = await api.get(`/categories/${id}/stats`);
  return response.data;
};

// Create category (admin)
const createCategory = async (categoryData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.post("/categories", categoryData, config);
  return response.data;
};

// Update category (admin)
const updateCategory = async (id, categoryData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.put(`/categories/${id}`, categoryData, config);
  return response.data;
};

// Delete category (admin)
const deleteCategory = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.delete(`/categories/${id}`, config);
  return response.data;
};

const categoryService = {
  getCategories,
  getCategory,
  getCategoryStats,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
