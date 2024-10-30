import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.openrouter.com',
  headers: {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
  }
});

export const queryAI = async (query) => {
  try {
    const response = await apiClient.post('/query', { query });
    return response.data;
  } catch (error) {
    console.error('Error querying AI:', error);
  }
};
