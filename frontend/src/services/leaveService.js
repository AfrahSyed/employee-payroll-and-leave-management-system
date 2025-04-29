import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const leaveService = {
  async applyLeave(leaveData) {
    try {
      const response = await api.post('/leave-application', leaveData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to apply for leave' };
    }
  },

  async getLeaveApplications() {
    try {
      const response = await api.get('/leave-applications');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch leave applications' };
    }
  },

  async updateLeaveStatus(leaveId, status) {
    try {
      const response = await api.put(`/leave-application/${leaveId}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update leave status' };
    }
  },

  async getLeaveBalance(employeeId) {
    try {
      const response = await api.get(`/leave-balance/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch leave balance' };
    }
  }
}; 