import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to attach token
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

// Register user
const register = async (userData) => {
  const response = await api.post("/api/auth/register", userData);

  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post("/api/auth/login", userData);

  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};

// Get user profile
const getProfile = async () => {
  const response = await api.get("/api/auth/profile");

  if (response.data?.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};

// Update profile
const updateProfile = async (userData) => {
  const response = await api.put("/api/auth/profile", userData);

  if (response.data?.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};

// Change password
const changePassword = async (passwordData) => {
  const response = await api.put(
    "/api/auth/change-password",
    passwordData
  );
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
};
