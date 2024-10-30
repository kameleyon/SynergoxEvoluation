// Local storage keys
const CHAT_HISTORY_KEY = 'synergox_chat_history';
const MAX_HISTORY_ITEMS = 100;

// Load chat history from localStorage
export const loadChatHistory = () => {
  try {
    const history = localStorage.getItem(CHAT_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

// Save chat history to localStorage
const saveChatHistory = (history) => {
  try {
    // Keep only the latest MAX_HISTORY_ITEMS
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(trimmedHistory));
    return trimmedHistory;
  } catch (error) {
    console.error('Error saving chat history:', error);
    return history;
  }
};

// Add new chat to history
export const addToHistory = (chat) => {
  const history = loadChatHistory();
  const newChat = {
    ...chat,
    id: Date.now(), // Ensure unique ID
    timestamp: new Date().toISOString(),
    favorite: false
  };
  const updatedHistory = [newChat, ...history];
  return saveChatHistory(updatedHistory);
};

// Delete chat from history
export const deleteFromHistory = (chatId) => {
  const history = loadChatHistory();
  const updatedHistory = history.filter(chat => chat.id !== chatId);
  return saveChatHistory(updatedHistory);
};

// Toggle favorite status
export const toggleFavorite = (chatId) => {
  const history = loadChatHistory();
  const updatedHistory = history.map(chat => 
    chat.id === chatId ? { ...chat, favorite: !chat.favorite } : chat
  );
  return saveChatHistory(updatedHistory);
};