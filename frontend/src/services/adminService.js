import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
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

// Get admin dashboard stats
const getDashboardStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

// Get recent activity
const getRecentActivity = async () => {
  const response = await api.get("/admin/activity");
  return response.data;
};

// Get all users
const getUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

// Update user status
const updateUserStatus = async (userId, isActive) => {
  const response = await api.patch(`/admin/users/${userId}/status`, {
    isActive,
  });
  return response.data;
};

// Update user role
const updateUserRole = async (userId, role) => {
  const response = await api.patch(`/admin/users/${userId}/role`, { role });
  return response.data;
};

// Delete user
const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

const adminService = {
  getDashboardStats,
  getRecentActivity,
  getUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
};

export default adminService;
