import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
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
// Register user
const register = async (userData) => {
  const response = await api.post('/auth/register', userData)
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }
  
  return response.data
}

// Login user
const login = async (userData) => {
  const response = await api.post('/auth/login', userData)
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }
  
  return response.data
}

// Get user profile
const getProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  
  const response = await api.get('/auth/profile', config)
  
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }
  
  return response.data
}

// Update profile
const updateProfile = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  
  const response = await api.put('/auth/profile', userData, config)
  
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }
  
  return response.data
}

// Change password
const changePassword = async (passwordData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  
  const response = await api.put('/auth/change-password', passwordData, config)
  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

const authService = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
}

export default authService