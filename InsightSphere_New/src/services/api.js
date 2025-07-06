import axios from 'axios';

const API_URL = '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// News API endpoints
export const newsApi = {
  getLatestNews: async (params = {}) => {
    const response = await api.get('/news/latest', { params });
    return response.data;
  },

  searchNews: async (query, params = {}) => {
    const response = await api.get(`/news/search?q=${query}`, { params });
    return response.data;
  },

  getSources: async () => {
    const response = await api.get('/news/sources');
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/news/categories');
    return response.data;
  },
};

// Analysis API endpoints
export const analysisApi = {
  getSentimentTrends: async (params = {}) => {
    const response = await api.get('/analysis/sentiment-trends', { params });
    return response.data;
  },

  getTopEntities: async (params = {}) => {
    const response = await api.get('/analysis/top-entities', { params });
    return response.data;
  },

  getCategoryDistribution: async (params = {}) => {
    const response = await api.get('/analysis/category-distribution', { params });
    return response.data;
  },

  getSourceAnalysis: async (params = {}) => {
    const response = await api.get('/analysis/source-analysis', { params });
    return response.data;
  },
};

// Auth API endpoints
export const authApi = {
  login: async (userName, password) => {
    const response = await api.post('/auth/login', { userName, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },
};

export default api; 