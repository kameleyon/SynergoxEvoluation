import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import '../../styles/chat.css';

const MessageInput = ({ onSendMessage, isProcessing = false, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef(null);
  const { user } = useUser();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  const handleSend = async () => {
    if (!message.trim() || isSending || disabled) return;

    try {
      setIsSending(true);
      await onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input-container">
      <motion.div 
        className="message-input-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button 
          className="action-button"
          title="Attach file"
          disabled={disabled || isProcessing}
        >
          <Paperclip className="theme-icon" size={20} />
        </button>
        
        <textarea
          ref={textareaRef}
          className="message-input"
          placeholder={
            disabled ? "Please wait..." :
            isProcessing ? "Processing previous message..." :
            "Type your message here..."
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled || isProcessing}
          rows={1}
        />
        
        <AnimatePresence mode="wait">
          <motion.button 
            key={isSending ? 'sending' : 'send'}
            className={`action-button ${(!message.trim() || disabled || isProcessing) ? 'disabled' : ''}`}
            onClick={handleSend}
            disabled={!message.trim() || disabled || isProcessing}
            title={
              disabled ? "Input disabled" :
              isProcessing ? "Processing" :
              "Send message"
            }
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {isSending || isProcessing ? (
              <Loader className="theme-icon animate-spin" size={20} />
            ) : (
              <Send className="theme-icon" size={20} />
            )}
          </motion.button>
        </AnimatePresence>
      </motion.div>

      {user && (
        <motion.div
          className="user-typing-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
        >
          {user.fullName || user.username}
        </motion.div>
      )}
    </div>
  );
};

export default MessageInput;
