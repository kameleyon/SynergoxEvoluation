import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// Create axios instance with default config
const openRouter = axios.create({
  baseURL: OPENROUTER_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.origin,
  }
});

export const generateResponse = async (query) => {
  if (!API_KEY) {
    throw new Error('OpenRouter API key is required');
  }

  try {
    // Add API key to headers for this specific request
    const response = await openRouter.post('', {
      model: "anthropic/claude-3-sonnet",
      messages: [{ role: "user", content: query }],
      temperature: 0.7,
      max_tokens: 4096,
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': `${window.location.origin}`,
        'X-Title': 'SynergoX AI Development Platform'
      }
    });

    return {
      content: response.data.choices[0].message.content,
      type: determineResponseType(query),
      title: generateTitle(query)
    };
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    throw error;
  }
};

// Helper function to determine response type
const determineResponseType = (query) => {
  const codeKeywords = ['code', 'function', 'component', 'script', 'program'];
  return codeKeywords.some(keyword => query.toLowerCase().includes(keyword)) 
    ? 'code' 
    : 'text';
};

// Helper function to generate title
const generateTitle = (query) => {
  const maxLength = 150;
  const title = query.trim();
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength - 3) + '...';
};

export default openRouter;