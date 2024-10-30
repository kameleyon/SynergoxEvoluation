import React, { useEffect, useRef } from 'react';
import { MessageSquare, Code, Clock, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { useCollaboration } from '../../hooks/useCollaboration';
import { parseMessageContent, MESSAGE_TYPE } from '../../models/chat';
import '../../styles/chat.css';

const Chat = ({ chat, isActive }) => {
  const messagesEndRef = useRef(null);
  const { user } = useUser();
  const { content, collaborators, isLoading, error } = useCollaboration(chat.id, 'chat');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [content?.messages]);

  const renderMessageContent = (content) => {
    const parts = parseMessageContent(content);
    
    return parts.map((part, index) => {
      if (part.type === MESSAGE_TYPE.CODE) {
        return (
          <div key={index} className="code-block-container">
            <div className="code-block-header">
              <Code size={14} className="theme-icon" />
              <span>{part.language}</span>
            </div>
            <pre className="code-block">
              <code>{part.content}</code>
            </pre>
          </div>
        );
      }
      return <span key={index}>{part.content}</span>;
    });
  };

  if (error) {
    return (
      <div className="chat-error">
        <p>Error loading chat: {error.message}</p>
      </div>
    );
  }

  return (
    <motion.div 
      className={`chat-container ${isActive ? 'chat-active' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="chat-header">
        <div className="chat-title-container">
          <MessageSquare className="theme-icon" size={18} />
          <h3 className="chat-title">{chat.title}</h3>
          <span className="chat-status">
            <Clock size={14} className="theme-icon" />
            {new Date(chat.timestamp).toLocaleTimeString()}
          </span>
          {collaborators.length > 0 && (
            <div className="chat-collaborators">
              {collaborators.length} active
            </div>
          )}
        </div>
        {chat.promotable && (
          <div className="chat-actions">
            <motion.button
              className="action-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Promote to Project"
            >
              <ArrowUpRight className="theme-icon" size={18} />
            </motion.button>
          </div>
        )}
      </div>

      <div className="chat-messages">
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="chat-loading"
            >
              Loading messages...
            </motion.div>
          ) : content?.messages?.length > 0 ? (
            content.messages.map((message, index) => (
              <motion.div
                key={message.id || index}
                className={`message ${message.sender.toLowerCase()}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="message-header">
                  <span className="message-sender">
                    {message.sender === 'User' && message.userId === user?.id
                      ? 'You'
                      : message.sender}
                  </span>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="message-content">
                  {renderMessageContent(message.content)}
                </div>
                {message.metadata?.edited && (
                  <div className="message-edited">
                    (edited {new Date(message.metadata.editedAt).toLocaleTimeString()})
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="no-messages"
            >
              <MessageSquare size={24} className="theme-icon" />
              <p>No messages yet</p>
              <small>Start typing to begin the conversation</small>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {collaborators.length > 0 && (
        <div className="chat-footer">
          <div className="collaborators-typing">
            {collaborators
              .filter(c => c.status === 'typing' && c.id !== user?.id)
              .map(c => c.name)
              .join(', ')}
            {collaborators.some(c => c.status === 'typing' && c.id !== user?.id) && ' is typing...'}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Chat;
