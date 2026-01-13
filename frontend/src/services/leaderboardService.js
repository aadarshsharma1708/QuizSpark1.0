import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Remove or comment out the debug interceptors in production
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", {
      url: config.url,
      method: config.method,
      params: config.params,
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("Response Error:", error);
    return Promise.reject(error);
  }
);

// Get global leaderboard - FIXED
const getGlobalLeaderboard = async (params = {}, token = null) => {
  const config = {
    params,
    ...(token && {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  };

  console.log("Getting global leaderboard with params:", params);

  const response = await api.get("/leaderboard/global", config);

  // Return the data array directly
  if (!response.data.success) {
    throw new Error(
      response.data.message || "Failed to fetch leaderboard data"
    );
  }

  return response.data.data; // Always return the data array from the success response
};

// Get category leaderboard - FIXED
const getCategoryLeaderboard = async (
  categoryId,
  params = {},
  token = null
) => {
  const config = {
    params,
    ...(token && {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  };

  console.log("Getting category leaderboard:", { categoryId, params });

  const response = await api.get(`/leaderboard/category/${categoryId}`, config);

  // Return the data array directly
  if (!response.data.success) {
    throw new Error(
      response.data.message || "Failed to fetch category leaderboard data"
    );
  }

  return response.data.data; // Always return the data array from the success response
};

// Get user rank
const getUserRank = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get("/leaderboard/rank", config);
  return response.data.data || response.data;
};

const leaderboardService = {
  getGlobalLeaderboard,
  getCategoryLeaderboard,
  getUserRank,
};

export default leaderboardService;
