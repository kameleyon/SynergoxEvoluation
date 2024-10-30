import { useState, useEffect } from 'react';
import { Menu, Search, LogOut, Settings, HelpCircle, Bell, Sun, Moon } from 'lucide-react';
import { UserButton, SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, onValue, query, orderByChild, set } from 'firebase/database';
import { database } from '../firebaseConfig';
import ActivityList from './Project/ProjectList';
import Chat from './Chat/Chat';
import Project from './Project/Project';
import MessageInput from './Chat/MessageInput';
import { createChat, createMessage } from '../models/chat';
import { createProject } from '../models/project';
import axios from 'axios';

export default function Dashboard() {
  // Core UI State
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Application State
  const [activities, setActivities] = useState({
    chats: [],
    projects: []
  });
  const [activeItem, setActiveItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  
  const bottomIcons = [LogOut, HelpCircle, Settings, Bell];

  useEffect(() => {
    const handleResize = () => {
      const isMobileSize = window.innerWidth < 769;
      setIsMobile(isMobileSize);
      if (isMobileSize) {
        setIsLeftPanelOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Firebase Listeners
  useEffect(() => {
    if (!user) return;

    setIsLoading(true);

    // Listen for chats
    const chatsQuery = query(ref(database, 'chats'), orderByChild('timestamp'));
    const chatsUnsubscribe = onValue(chatsQuery, (snapshot) => {
      const chatsData = snapshot.val();
      if (chatsData) {
        const chatsArray = Object.values(chatsData).sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        setActivities(prev => ({ ...prev, chats: chatsArray }));
      }
    });

    // Listen for projects
    const projectsQuery = query(ref(database, 'projects'), orderByChild('timestamp'));
    const projectsUnsubscribe = onValue(projectsQuery, (snapshot) => {
      const projectsData = snapshot.val();
      if (projectsData) {
        const projectsArray = Object.values(projectsData).sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        setActivities(prev => ({ ...prev, projects: projectsArray }));
      }
      setIsLoading(false);
    });

    return () => {
      chatsUnsubscribe();
      projectsUnsubscribe();
    };
  }, [user]);

  // UI Controls
  const toggleLeftPanel = () => setIsLeftPanelOpen(prev => !prev);
  const toggleTheme = () => setIsDarkTheme(prev => !prev);

  // Activity Management
  const handleNewProject = async () => {
    try {
      const newProject = await createProject('New Project');
      setActiveItem({ type: 'project', id: newProject.id });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleSendMessage = async (messageText) => {
    try {
      // Create new chat if needed
      let currentChatId = activeItem?.type === 'chat' ? activeItem.id : null;
      
      if (!currentChatId) {
        const newChat = await createChat();
        currentChatId = newChat.id;
        setActiveItem({ type: 'chat', id: newChat.id });
      }

      // Add user message to chat
      await createMessage(currentChatId, 'User', messageText);

      // Send message to Botpress
      try {
        const response = await axios.post('http://localhost:5000/api/botpress/message', {
          message: messageText,
          botName: 'my-bot',
          userId: user?.id || 'anonymous'
        });

        // Add bot response to chat
        if (response.data && response.data.responses && response.data.responses[0]) {
          await createMessage(currentChatId, 'AI', response.data.responses[0].text);
        }
      } catch (error) {
        console.error('Error communicating with Botpress:', error);
        await createMessage(
          currentChatId,
          'AI',
          'Sorry, I encountered an error processing your message.'
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteActivity = async (id, type) => {
    try {
      await set(ref(database, `${type}s/${id}`), null);
      if (activeItem?.id === id) {
        setActiveItem(null);
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const getActiveContent = () => {
    if (!activeItem) return null;

    const item = activeItem.type === 'project'
      ? activities.projects.find(p => p.id === activeItem.id)
      : activities.chats.find(c => c.id === activeItem.id);

    if (!item) return null;

    return activeItem.type === 'project' ? (
      <Project project={item} isActive={true} onDelete={id => handleDeleteActivity(id, 'project')} />
    ) : (
      <Chat chat={item} isActive={true} />
    );
  };

  const mainContent = (
    <div className={`app-container ${isDarkTheme ? 'dark' : 'light'}`}>
      {/* Left Panel */}
      <AnimatePresence>
        {(isLeftPanelOpen || !isMobile) && (
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`left-panel ${isLeftPanelOpen ? 'left-panel-open' : 'left-panel-closed'}`}
          >
            <div className="panel-content">
              <div className="search-container">
                <div className="search-wrapper">
                  <Search className="search-icon" size={18} />
                  <input type="text" placeholder="Search..." className="search-input" />
                </div>
              </div>
              <ActivityList
                projects={activities.projects}
                chats={activities.chats}
                onNewProject={handleNewProject}
                onDelete={handleDeleteActivity}
                activeItem={activeItem}
                onSelectItem={setActiveItem}
                isLoading={isLoading}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`main-content ${!isLeftPanelOpen ? 'main-content-closed' : ''}`}>
        {/* Header */}
        <header className="header-container">
          <div className="header-left">
            <button onClick={toggleLeftPanel} className="menu-button">
              <Menu className="theme-icon" size={24} />
            </button>
            <h1 className="header-title">SYNERGOX</h1>
          </div>
          <div className="header-right">
            <button onClick={toggleTheme} className="theme-toggle-button">
              {isDarkTheme ? <Sun className="theme-icon" size={24} /> : <Moon className="theme-icon" size={24} />}
            </button>
            <UserButton />
          </div>
        </header>

        {/* Main Section */}
        <main className="main-section">
          {isLoading ? (
            <div className="loading-state">Loading...</div>
          ) : activeItem ? (
            getActiveContent()
          ) : (
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="main-title"
            >
              How can I help you with?
            </motion.h2>
          )}
        </main>

        {/* Message Input */}
        <MessageInput onSendMessage={handleSendMessage} />
      </div>

      {/* Bottom Icons */}
      <div className={`bottom-icons ${!isLeftPanelOpen && isMobile ? 'bottom-icons-hidden' : 'bottom-icons'}`}>
        {bottomIcons.map((Icon, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="icon-button"
          >
            <Icon className="theme-icon" size={20} />
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <SignedIn>
        {mainContent}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
