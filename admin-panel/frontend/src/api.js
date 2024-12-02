import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/' });

// Custom error handler
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return { message: data.message || 'Invalid request. Please check your input.', type: 'warning' };
      case 401:
        return { message: data.message || 'Authentication failed. Please log in again.', type: 'error' };
      case 403:
        return { message: data.message || 'You do not have permission to access this resource.', type: 'error' };
      case 404:
        return { message: data.message || 'The requested resource was not found.', type: 'warning' };
      case 500:
        return { message: 'Server error. Please try again later.', type: 'error' };
      default:
        return { message: data.message || 'An unexpected error occurred.', type: 'error' };
    }
  } else if (error.request) {
    return { message: 'No response received from server. Please check your network connection.', type: 'error' };
  } else {
    return { message: error.message || 'An unexpected error occurred.', type: 'error' };
  }
};

// Attach token to every request if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth API functions
export const login = async (formData) => {
  try {
    const response = await API.post('/auth/login', formData);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const signup = async (formData) => {
  try {
    const response = await API.post('/auth/signup', formData);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const googleLogin = async (credential) => {
  try {
    const response = await API.post('/auth/google', { credential });
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Staff API functions
export const addStaff = async (staffData) => {
  try {
    const response = await API.post('/staff/add', staffData);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const editStaff = async (id, updates) => {
  try {
    const response = await API.put(`/staff/edit/${id}`, updates);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteStaff = async (id) => {
  try {
    const response = await API.delete(`/staff/delete/${id}`);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const assignRole = async (id, role) => {
  try {
    const response = await API.patch(`/staff/assign-role/${id}`, { role });
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getPerformanceMetrics = async (id) => {
  try {
    const response = await API.get(`/staff/performance/${id}`);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchAllStaff = async () => {
  try {
    const response = await API.get('/staff/all');
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Export error handler for potential custom use
export { handleApiError };
