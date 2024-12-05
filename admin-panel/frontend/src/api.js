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

// Room API functions
export const addRoom = async (roomData) => {
  try {
    const response = await API.post('/rooms/add', roomData);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const editRoom = async (id, updates) => {
  try {
    const response = await API.put(`/rooms/edit/${id}`, updates);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteRoom = async (id) => {
  try {
    const response = await API.delete(`/rooms/delete/${id}`);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchAllRooms = async () => {
  try {
    const response = await API.get('/rooms/all');
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchRoomById = async (id) => {
  try {
    const response = await API.get(`/rooms/${id}`);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};


// Service API functions
export const addService = async (serviceData) => {
  try {
    const response = await API.post('/services/add', serviceData);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const editService = async (id, updates) => {
  try {
    const response = await API.put(`/services/edit/${id}`, updates);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteService = async (id) => {
  try {
    const response = await API.delete(`/services/delete/${id}`);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchAllServices = async () => {
  try {
    const response = await API.get('/services/all');
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchServiceById = async (id) => {
  try {
    const response = await API.get(`/services/${id}`);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchSystemLogs = async () => {
  try {
      const response = await API.get('/system-logs/all');
      return response;
  } catch (error) {
      throw handleApiError(error);
  }
};


// Hotel Stats API functions

// Fetch summary statistics (bookings, revenue, occupancy rate, etc.)
export const fetchSummaryStats = async () => {
  try {
    const response = await API.get('/hotel-stats/summary');
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Fetch all booking data
export const fetchBookingDetails = async () => {
  try {
    const response = await API.get(`/hotel-stats/bookings`);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const sendNotification = async ({ staffId, email, phoneNumber, subject, message }) => {
  try {
    
    const response = await API.post('/notifications/send', {
      staffId,
      email,
      phoneNumber,
      subject,
      message,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};



const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const WEATHER_API_KEY = '07c4fc833f325d21777a7bff1522cf45'; // Replace with your OpenWeather API key
// Weather API Functions
export const fetchWeatherData = async (city, lat, lon) => {
  try {
    const endpoint = city
      ? `${WEATHER_API_BASE_URL}weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
      : `${WEATHER_API_BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const fetchWeatherDataByCoords = async (lat, lon) => {
  try {
    const endpoint = `${WEATHER_API_BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


// Export error handler for potential custom use
export { handleApiError };
