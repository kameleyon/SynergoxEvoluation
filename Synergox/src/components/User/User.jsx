import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Tabs,
  Tab,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Mail,
  Phone,
  Calendar,
  Shield,
  Bell,
  CreditCard,
  Edit,
  MessageCircle,
  FileText,
  Star,
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

// Common styles
const textStyles = {
  color: 'var(--text-color)'
};

const buttonStyles = {
  color: 'var(--text-color)',
  borderColor: 'var(--text-color)',
  '&:hover': {
    borderColor: 'var(--text-color)',
    opacity: 0.8,
  }
};

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ padding: '24px 0' }}>
    {value === index && children}
  </div>
);

const User = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const [activeTab, setActiveTab] = useState(0);

  if (!clerkLoaded) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="info">Loading profile...</Alert>
      </Box>
    );
  }

  if (!clerkUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Please sign in to view your profile.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }} className="user-profile-container">
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#151e29' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={clerkUser.imageUrl}
              sx={{ width: 80, height: 80 }}
            />
            <Box>
              <Typography variant="h4" sx={textStyles}>
                {clerkUser.fullName || 'Anonymous User'}
              </Typography>
              <Chip
                label="No role set"
                sx={{ 
                  mt: 1,
                  color: 'var(--text-color)',
                  borderColor: 'var(--text-color)',
                }}
                variant="outlined"
              />
            </Box>
          </Box>
          <Button
            startIcon={<Edit size={18} style={{ color: 'var(--text-color)' }} />}
            variant="outlined"
            sx={buttonStyles}
          >
            Edit Profile
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ mt: 3, bgcolor: '#151e29' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, val) => setActiveTab(val)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              color: 'var(--text-color)',
              opacity: 0.7,
              '&.Mui-selected': {
                color: 'var(--text-color)',
                opacity: 1,
              },
            },
          }}
        >
          <Tab icon={<Mail size={20} style={{ color: 'var(--text-color)' }} />} label="OVERVIEW" />
          <Tab icon={<CreditCard size={20} style={{ color: 'var(--text-color)' }} />} label="SUBSCRIPTION" />
          <Tab icon={<MessageCircle size={20} style={{ color: 'var(--text-color)' }} />} label="ACTIVITY" />
          <Tab icon={<Shield size={20} style={{ color: 'var(--text-color)' }} />} label="SETTINGS" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={activeTab} index={0}>
            <Typography variant="h6" gutterBottom sx={textStyles}>
              Quick Actions
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Mail size={20} style={{ color: 'var(--text-color)' }} />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography sx={textStyles}>Email</Typography>}
                  secondary={
                    <Typography sx={{ ...textStyles, opacity: 0.7 }}>
                      {clerkUser.primaryEmailAddress?.emailAddress || 'No email set'}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone size={20} style={{ color: 'var(--text-color)' }} />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography sx={textStyles}>Phone</Typography>}
                  secondary={
                    <Typography sx={{ ...textStyles, opacity: 0.7 }}>
                      No phone number set
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Calendar size={20} style={{ color: 'var(--text-color)' }} />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography sx={textStyles}>Member Since</Typography>}
                  secondary={
                    <Typography sx={{ ...textStyles, opacity: 0.7 }}>
                      {new Date(clerkUser.createdAt).toLocaleDateString()}
                    </Typography>
                  }
                />
              </ListItem>
            </List>

            <Box sx={{ mt: 3 }}>
              <Button
                startIcon={<Shield size={18} style={{ color: 'var(--text-color)' }} />}
                fullWidth
                variant="outlined"
                sx={{ ...buttonStyles, mb: 2 }}
              >
                SECURITY SETTINGS
              </Button>
              <Button
                startIcon={<Bell size={18} style={{ color: 'var(--text-color)' }} />}
                fullWidth
                variant="outlined"
                sx={buttonStyles}
              >
                NOTIFICATIONS
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Typography variant="h6" gutterBottom sx={textStyles}>
              Subscription Status
            </Typography>
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={textStyles}>
                    No Active Plan
                  </Typography>
                  <Typography variant="body2" sx={{ ...textStyles, opacity: 0.7 }}>
                    Choose a plan to get started
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  sx={{ bgcolor: '#88ab75', color: 'var(--text-color)' }}
                >
                  CHOOSE PLAN
                </Button>
              </Box>
            </Paper>

            <Typography variant="h6" gutterBottom sx={textStyles}>
              Available Features
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Star size={20} style={{ color: 'var(--text-color)' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography sx={textStyles}>
                      Unlimited projects
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <MessageCircle size={20} style={{ color: 'var(--text-color)' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography sx={textStyles}>
                      Priority support
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FileText size={20} style={{ color: 'var(--text-color)' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography sx={textStyles}>
                      Advanced analytics
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" gutterBottom sx={textStyles}>
              Recent Activity
            </Typography>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ ...textStyles, opacity: 0.7 }}>
                No activity history available
              </Typography>
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Typography variant="h6" gutterBottom sx={textStyles}>
              Account Settings
            </Typography>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <Shield size={20} style={{ color: 'var(--text-color)' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography sx={textStyles}>
                      SECURITY SETTINGS
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <Bell size={20} style={{ color: 'var(--text-color)' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography sx={textStyles}>
                      NOTIFICATION PREFERENCES
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <CreditCard size={20} style={{ color: 'var(--text-color)' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography sx={textStyles}>
                      BILLING SETTINGS
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default User;