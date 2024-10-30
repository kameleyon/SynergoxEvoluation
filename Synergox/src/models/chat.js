import { database } from '../firebaseConfig';
import { ref, set, push, serverTimestamp } from 'firebase/database';

// Chat Model
export const createChat = async () => {
  const chat = {
    id: Date.now().toString(),
    title: `Chat ${new Date().toLocaleString()}`,
    messages: [],
    status: 'Active',
    promotable: true,
    timestamp: serverTimestamp(),
    type: 'chat',
    settings: {
      theme: 'dark',
      notifications: true
    }
  };

  try {
    await set(ref(database, `chats/${chat.id}`), chat);
    return chat;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

// Message Model
export const createMessage = async (chatId, sender, content) => {
  const message = {
    id: Date.now().toString(),
    sender,
    content,
    timestamp: serverTimestamp(),
    status: 'sent',
    reactions: {},
    metadata: {
      edited: false,
      editedAt: null,
      attachments: []
    }
  };

  try {
    const messageRef = push(ref(database, `chats/${chatId}/messages`));
    await set(messageRef, message);
    return message;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

// Message Operations
export const updateMessage = async (chatId, messageId, content) => {
  try {
    await set(ref(database, `chats/${chatId}/messages/${messageId}`), {
      content,
      metadata: {
        edited: true,
        editedAt: serverTimestamp()
      }
    });
    return true;
  } catch (error) {
    console.error('Error updating message:', error);
    return false;
  }
};

export const addReaction = async (chatId, messageId, userId, reaction) => {
  try {
    await set(
      ref(database, `chats/${chatId}/messages/${messageId}/reactions/${userId}`),
      reaction
    );
    return true;
  } catch (error) {
    console.error('Error adding reaction:', error);
    return false;
  }
};

export const promoteToProject = async (chatId) => {
  try {
    await set(ref(database, `chats/${chatId}/status`), 'Promoted');
    await set(ref(database, `chats/${chatId}/promotable`), false);
    return true;
  } catch (error) {
    console.error('Error promoting chat:', error);
    return false;
  }
};

// Chat Status Types
export const CHAT_STATUS = {
  ACTIVE: 'Active',
  ARCHIVED: 'Archived',
  PROMOTED: 'Promoted'
};

// Message Types
export const MESSAGE_TYPE = {
  TEXT: 'text',
  CODE: 'code',
  SYSTEM: 'system',
  ERROR: 'error'
};

// Helper Functions
export const formatMessage = (content, type = MESSAGE_TYPE.TEXT) => {
  switch (type) {
    case MESSAGE_TYPE.CODE:
      return `\`\`\`\n${content}\n\`\`\``;
    case MESSAGE_TYPE.SYSTEM:
      return `[System] ${content}`;
    case MESSAGE_TYPE.ERROR:
      return `[Error] ${content}`;
    default:
      return content;
  }
};

export const extractCodeBlocks = (message) => {
  const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
  const blocks = [];
  let match;

  while ((match = codeBlockRegex.exec(message)) !== null) {
    blocks.push(match[1].trim());
  }

  return blocks;
};

export const parseMessageContent = (content) => {
  const parts = [];
  let lastIndex = 0;
  const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      parts.push({
        type: MESSAGE_TYPE.TEXT,
        content: content.slice(lastIndex, match.index)
      });
    }

    // Add code block
    parts.push({
      type: MESSAGE_TYPE.CODE,
      content: match[1],
      language: match[0].match(/```(\w+)?\n/)?.[1] || 'plaintext'
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({
      type: MESSAGE_TYPE.TEXT,
      content: content.slice(lastIndex)
    });
  }

  return parts;
};
