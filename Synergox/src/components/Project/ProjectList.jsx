import React from 'react';
import { Plus, Folder, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/project.css';

const ActivityList = ({ 
  projects = [], 
  chats = [], 
  onNewProject, 
  onDelete, 
  activeItem,
  onSelectItem,
  isLoading = false
}) => {
  const sortedActivities = [...projects, ...chats].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="activity-list">
      <div className="activity-list-header">
        <h2>Recent Activity</h2>
        <button 
          className="action-button" 
          onClick={onNewProject} 
          title="New Project"
        >
          <Plus className="theme-icon" size={18} />
        </button>
      </div>
      
      <div className="activity-list-content">
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="activity-loading"
            >
              <div className="loading-spinner" />
              <p>Loading activities...</p>
            </motion.div>
          ) : sortedActivities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="no-activities"
            >
              <p>No activities yet</p>
              <small>Start a conversation or create a project</small>
            </motion.div>
          ) : (
            sortedActivities.map(activity => {
              const isProject = 'files' in activity;
              const isActive = activeItem?.id === activity.id;

              return (
                <motion.div
                  key={activity.id}
                  className={`activity-item ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectItem({ 
                    type: isProject ? 'project' : 'chat', 
                    id: activity.id 
                  })}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <div className="activity-icon">
                    {isProject ? (
                      <Folder className="theme-icon" size={16} />
                    ) : (
                      <MessageSquare className="theme-icon" size={16} />
                    )}
                  </div>
                  <div className="activity-details">
                    <span className="activity-name">
                      {isProject ? activity.name : activity.title}
                    </span>
                    {activity.status && (
                      <span className="activity-status">
                        {activity.status}
                      </span>
                    )}
                  </div>
                  <span className="activity-timestamp">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActivityList;
