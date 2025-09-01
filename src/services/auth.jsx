import api from './api';
import { ENDPOINTS } from '../utils/constants';

export const authService = {
  login: async (credentials) => {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
    const { access, refresh } = response.data;
    
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT, { refresh_token: refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  getProfile: () => api.get(ENDPOINTS.AUTH.PROFILE),
  
  updateProfile: (data) => api.patch(ENDPOINTS.AUTH.PROFILE, data),
  
  changePassword: (data) => api.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, data),

  isAuthenticated: () => !!localStorage.getItem('access_token'),

  getToken: () => localStorage.getItem('access_token'),
};