import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { MessageCircle, AlertCircle, Settings, Bell } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import api from '../../services/api';

const Announcements = () => {
  const { user, isLoaded: clerkLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!clerkLoaded) return;
      
      try {
        setLoading(true);
        const data = await api.getAnnouncements();
        setAnnouncements(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError('Failed to load announcements. Please try again later.');
        console.error('Error fetching announcements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [clerkLoaded]);

  if (!clerkLoaded || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Please sign in to view announcements.</Alert>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className="announcements-container">
      <Typography variant="h4" className="announcements-title" gutterBottom>
        Announcements
      </Typography>
      
      <div className="timeline-container">
        <div className="timeline-scrollbar">
          <div className="timeline-arrow top"></div>
          <div className="timeline-track"></div>
          <div className="timeline-handle"></div>
          <div className="timeline-arrow bottom"></div>
        </div>
        
        <div className="announcements-list">
          {announcements.map((announcement) => (
            <Paper 
              key={announcement.id}
              className="announcement-card"
              elevation={0}
            >
              <div className="announcement-date">
                <Typography variant="subtitle2">{announcement.date}</Typography>
                <Typography variant="caption">{announcement.time}</Typography>
              </div>
              
              <div className="announcement-timeline-marker">
                <div className="timeline-dot"></div>
                <div className="timeline-line"></div>
              </div>
              
              <div className="announcement-content">
                <div className="announcement-header">
                  <div className="announcement-type">
                    {announcement.type === 'Announcement' && <Bell size={20} />}
                    {announcement.type === 'Change Log' && <Settings size={20} />}
                    {announcement.type === 'Alert' && <AlertCircle size={20} />}
                    {announcement.type === 'Update' && <MessageCircle size={20} />}
                    <Typography variant="caption">{announcement.type}</Typography>
                  </div>
                  <Typography variant="h6" className="announcement-title">
                    {announcement.title}
                  </Typography>
                </div>
                
                <Typography variant="body2" className="announcement-text">
                  {announcement.content}
                </Typography>
                
                {announcement.link && (
                  <a href={announcement.link} className="announcement-link">
                    Learn more
                  </a>
                )}
              </div>
            </Paper>
          ))}
        </div>
      </div>
    </Box>
  );
};

export default Announcements;