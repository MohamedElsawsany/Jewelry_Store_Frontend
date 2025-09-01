import api from './api';
import { ENDPOINTS } from '../utils/constants';

export const userService = {
  getUsers: (params) => api.get(ENDPOINTS.USERS, { params }),
  
  createUser: (userData) => api.post(ENDPOINTS.USERS, userData),
  
  updateUser: (id, userData) => api.patch(`${ENDPOINTS.USERS}${id}/`, userData),
  
  deleteUser: (id) => api.delete(`${ENDPOINTS.USERS}${id}/`),
  
  toggleUserStatus: (id) => api.post(`${ENDPOINTS.USERS}${id}/toggle_status/`),
  
  changeUserPassword: (id, passwordData) => 
    api.post(`${ENDPOINTS.USERS}${id}/change_password/`, passwordData),
  
  restoreUser: (id) => api.post(`${ENDPOINTS.USERS}${id}/restore/`),
};