import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import {
  Sun, Moon, Send, Paperclip, MessageCircle,
  User, Star, FileText, CreditCard, Settings as SettingsIcon, 
  Bell, Power, LogIn
} from 'lucide-react';
import BackgroundEffects from './BackgroundEffects';
import Settings from '../Settings/Settings';
import Billing from '../Billing/Billing';
import Projects from '../Projects/Projects';
import UserProfile from '../User/User';
import Announcements from '../Announcements/Announcements';
import ClerkAuth from '../Auth/ClerkAuth';
import CodeAnimation from './CodeAnimation';
import { generateResponse } from '../../services/openRouter';
import { 
  loadChatHistory, 
  addToHistory, 
  deleteFromHistory,
  toggleFavorite 
} from '../../services/chatStorage';

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut, user } = useClerk();
  const [theme, setTheme] = useState('dark');
  const [input, setInput] = useState('');
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [messages, setMessages] = useState([]);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [currentView, setCurrentView] = useState('chat');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const textareaRef = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    const history = loadChatHistory();
    setChatHistory(history);
  }, []);

  useEffect(() => {
    document.body.className = `${theme}-mode`;
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = `${newTheme}-mode`;
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);

    // Add user message
    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Generate response
      const response = await generateResponse(input);

      // Add to messages
      const aiMessage = { 
        type: 'synergox', 
        content: response.content,
        responseType: response.type
      };
      setMessages(prev => [...prev, aiMessage]);

      // Add to chat history
      const newChat = {
        id: Date.now(),
        title: response.title,
        query: input,
        response: response.content,
        type: response.type,
        timestamp: new Date().toISOString(),
        favorite: false
      };

      const updatedHistory = addToHistory(newChat);
      setChatHistory(updatedHistory);

      // Open side panel and clear input
      setSidePanelOpen(true);
      setInput('');
    } catch (err) {
      setError('Failed to generate response. Please try again.');
      console.error('Error generating response:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCloseSidePanel = () => {
    setSidePanelOpen(false);
  };

  const handleSignIn = () => {
    setCurrentView('auth');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setCurrentView('chat');
  };

  const handleDeleteChat = async (chatId) => {
    const updatedHistory = deleteFromHistory(chatId);
    setChatHistory(updatedHistory);
  };

  const handleToggleFavorite = async (chatId) => {
    const updatedHistory = toggleFavorite(chatId);
    setChatHistory(updatedHistory);
  };

  const handleProtectedNavigation = (view) => {
    if (!user) {
      setMessages(prev => [...prev, {
        type: 'synergox',
        content: 'Please sign in to access this feature.'
      }]);
      return;
    }
    setCurrentView(view);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const exampleQueries = [
    "Generate a sticky header",
    "How can I schedule cron jobs?",
    "A function to flatten nested arrays"
  ];

  return (
    <>
      <BackgroundEffects sidePanelOpen={sidePanelOpen} />
      <div className={`chat-container theme-${theme}`}>
        <div className={`sidebar ${sidebarExpanded ? 'sidebar-expanded' : ''}`}>
          <button onClick={() => handleProtectedNavigation('user')}>
            <User size={24} />
            {sidebarExpanded && <span>User</span>}
          </button>
          <button onClick={() => setCurrentView('chat')}>
            <MessageCircle size={24} />
            {sidebarExpanded && <span>Message</span>}
          </button>
          <button onClick={() => handleProtectedNavigation('history')}>
            <FileText size={24} />
            {sidebarExpanded && <span>History</span>}
          </button>
          <button onClick={() => handleProtectedNavigation('billing')}>
            <CreditCard size={24} />
            {sidebarExpanded && <span>Billing</span>}
          </button>
          <button onClick={() => handleProtectedNavigation('settings')}>
            <SettingsIcon size={24} />
            {sidebarExpanded && <span>Settings</span>}
          </button>
          <button onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            {sidebarExpanded && <span>Toggle Theme</span>}
          </button>
          <button onClick={() => handleProtectedNavigation('announcements')}>
            <Bell size={24} />
            {sidebarExpanded && <span>Announcements</span>}
          </button>
          {!user ? (
            <button onClick={handleSignIn}>
              <LogIn size={24} />
              {sidebarExpanded && <span>Sign In</span>}
            </button>
          ) : (
            <button onClick={handleSignOut}>
              <Power size={24} />
              {sidebarExpanded && <span>Sign out</span>}
            </button>
          )}
        </div>

        <div className="main-panel">
          {currentView === 'auth' ? (
            <ClerkAuth />
          ) : currentView === 'chat' ? (
            <div className={`content ${sidePanelOpen ? 'side-panel-open' : ''}`}>
              {!sidePanelOpen && (
                <>
                  <h1 className="topceilling">What can I help you ship?</h1>
                  <div className="example-queries">
                    {exampleQueries.map((query, index) => (
                      <div
                        key={index}
                        className="example-query"
                        onClick={() => setInput(query)}
                      >
                        {query}
                      </div>
                    ))}
                  </div>
                  {/* Add CodeAnimation when chat is not active */}
                  <CodeAnimation />
                </>
              )}
              <div className={`input-container ${sidePanelOpen ? 'side-panel-open' : ''}`}>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Synergox a question..."
                  rows={1}
                  disabled={loading}
                />
                <div className="input-actions">
                  <button disabled={loading}>
                    <Paperclip size={20} />
                  </button>
                  <button onClick={handleSubmit} disabled={loading}>
                    <Send size={20} />
                  </button>
                </div>
              </div>
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              {sidePanelOpen && (
                <div className="chat-messages">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`chat-message ${message.type}-message`}
                    >
                      {message.content}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : !user ? (
            <div className="content">
              <h1 className="topceilling">Please sign in to access this feature</h1>
              <div className="chat-messages">
                <div className="chat-message synergox-message">
                  Please sign in to access this feature. Click the sign-in button in the sidebar to continue.
                </div>
              </div>
            </div>
          ) : currentView === 'settings' ? (
            <Settings />
          ) : currentView === 'billing' ? (
            <Billing />
          ) : currentView === 'history' ? (
            <Projects 
              chatHistory={chatHistory}
              onDelete={handleDeleteChat}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : currentView === 'user' ? (
            <UserProfile />
          ) : currentView === 'announcements' ? (
            <Announcements />
          ) : null}
        </div>

        <div className={`side-panel ${sidePanelOpen ? 'open' : ''}`}>
          <button className="close-button" onClick={handleCloseSidePanel}>
            <span className="close-icon">×</span>
          </button>
          <div className="tab-buttons">
            <button
              className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
            <button
              className={`tab-button ${activeTab === 'code' ? 'active' : ''}`}
              onClick={() => setActiveTab('code')}
            >
              Code
            </button>
          </div>
          <div className="tab-content">
            {activeTab === 'preview' ? (
              <div>{messages[messages.length - 1]?.content || ''}</div>
            ) : (
              <div className="code-content">
                {messages[messages.length - 1]?.content || ''}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;