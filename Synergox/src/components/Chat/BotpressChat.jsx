import React, { useState } from 'react';
import axios from 'axios';

const BotpressChat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat history
    setChatHistory(prev => [...prev, { type: 'user', text: message }]);

    try {
      const response = await axios.post('http://localhost:5000/api/botpress/message', {
        message,
        botName: 'my-bot', // Replace with your bot name
        userId: 'user-1' // Replace with actual user ID
      });

      // Add bot response to chat history
      setChatHistory(prev => [...prev, { type: 'bot', text: response.data.responses[0].text }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory(prev => [...prev, { type: 'error', text: 'Error communicating with bot' }]);
    }

    setMessage('');
  };

  return (
    <div className="chat-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div className="chat-history" style={{ 
        height: '400px', 
        overflowY: 'auto', 
        border: '1px solid #ccc', 
        padding: '10px',
        marginBottom: '20px'
      }}>
        {chatHistory.map((msg, index) => (
          <div 
            key={index} 
            style={{
              marginBottom: '10px',
              textAlign: msg.type === 'user' ? 'right' : 'left',
              color: msg.type === 'error' ? 'red' : 'inherit'
            }}
          >
            <div style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: '12px',
              backgroundColor: msg.type === 'user' ? '#007bff' : '#e9ecef',
              color: msg.type === 'user' ? 'white' : 'black',
              maxWidth: '80%'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ 
            flex: 1, 
            padding: '8px', 
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <button 
          type="submit"
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default BotpressChat;
