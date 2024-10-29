import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.timeout = 10000;

// Helper to ensure data is serializable
const sanitizeData = (data) => {
  if (!data) return null;
  
  try {
    // Remove any non-serializable properties
    const cleaned = JSON.parse(JSON.stringify(data));
    return cleaned;
  } catch (error) {
    console.warn('Data sanitization warning:', error);
    return null;
  }
};

// Create a custom error object that's guaranteed to be serializable
const createSerializableError = (error) => ({
  message: error.message || 'An unexpected error occurred',
  status: error.response?.status,
  data: error.response?.data,
  code: error.code,
  timestamp: new Date().toISOString()
});

// Retry logic for failed requests
const retryRequest = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 2);
  }
};

const api = {
  // User endpoints
  getUser: async (id) => {
    try {
      const response = await retryRequest(() => 
        axios.get(`/users/${id}`, {
          validateStatus: status => status < 500
        })
      );

      if (response.status !== 200) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }

      return sanitizeData(response.data);
    } catch (error) {
      const serializableError = createSerializableError(error);
      console.error('User fetch error:', serializableError);
      throw serializableError;
    }
  },

  // Projects endpoints
  getProjects: async () => {
    try {
      const response = await retryRequest(() => 
        axios.get('/projects', {
          validateStatus: status => status < 500
        })
      );

      if (response.status !== 200) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }

      return sanitizeData(response.data);
    } catch (error) {
      const serializableError = createSerializableError(error);
      console.error('Projects fetch error:', serializableError);
      throw serializableError;
    }
  },

  // Billing endpoints
  getBillingInfo: async () => {
    try {
      const response = await retryRequest(() => 
        axios.get('/billing', {
          validateStatus: status => status < 500
        })
      );

      if (response.status !== 200) {
        throw new Error(`Failed to fetch billing info: ${response.status}`);
      }

      return sanitizeData(response.data);
    } catch (error) {
      const serializableError = createSerializableError(error);
      console.error('Billing fetch error:', serializableError);
      throw serializableError;
    }
  },

  // Announcements endpoints
  getAnnouncements: async () => {
    try {
      const response = await retryRequest(() => 
        axios.get('/announcements', {
          validateStatus: status => status < 500
        })
      );

      if (response.status !== 200) {
        throw new Error(`Failed to fetch announcements: ${response.status}`);
      }

      return sanitizeData(response.data);
    } catch (error) {
      const serializableError = createSerializableError(error);
      console.error('Announcements fetch error:', serializableError);
      throw serializableError;
    }
  }
};

export default api;