import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  Avatar,
  Button,
  TextField,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Select,
  MenuItem,
} from '@mui/material';
import {
  User,
  CreditCard,
  Globe,
  Lock,
  Bell,
  Key,
  HelpCircle,
  FileText,
  Camera,
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const Settings = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const [activeSection, setActiveSection] = useState('account');
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false
  });

  // Common styles for text color
  const textStyles = {
    color: 'var(--text-color)'
  };

  // Common styles for buttons
  const buttonStyles = {
    color: 'var(--text-color)',
    borderColor: 'var(--text-color)',
    '&:hover': {
      borderColor: 'var(--text-color)',
      opacity: 0.8,
    }
  };

  // Common styles for inputs
  const inputStyles = {
    '& .MuiInputBase-input': textStyles,
    '& .MuiInputLabel-root': textStyles,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--text-color)',
      opacity: 0.3
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--text-color)',
      opacity: 0.5
    }
  };

  if (!clerkLoaded) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography sx={textStyles}>Loading settings...</Typography>
      </Box>
    );
  }

  if (!clerkUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography sx={textStyles}>Please sign in to access settings.</Typography>
      </Box>
    );
  }

  const sections = [
    { id: 'account', label: 'ACCOUNT', icon: <User size={20} /> },
    { id: 'billing', label: 'BILLING', icon: <CreditCard size={20} /> },
    { id: 'preferences', label: 'PREFERENCES', icon: <Globe size={20} /> },
    { id: 'security', label: 'SECURITY', icon: <Lock size={20} /> },
    { id: 'notifications', label: 'NOTIFICATIONS', icon: <Bell size={20} /> },
    { id: 'api', label: 'API', icon: <Key size={20} /> },
    { id: 'help', label: 'HELP', icon: <HelpCircle size={20} /> },
    { id: 'legal', label: 'LEGAL', icon: <FileText size={20} /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar
                src={clerkUser.imageUrl}
                sx={{ width: 100, height: 100, mr: 2 }}
              />
              <Button startIcon={<Camera size={20} />} sx={buttonStyles}>
                Click to upload new avatar
              </Button>
            </Box>
            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Full Name"
                defaultValue={clerkUser.fullName || ''}
                sx={{ ...inputStyles, mb: 2 }}
              />
              <TextField
                fullWidth
                label="Username"
                defaultValue={`@${clerkUser.username || ''}`}
                sx={{ ...inputStyles, mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                defaultValue={clerkUser.primaryEmailAddress?.emailAddress || ''}
                sx={inputStyles}
              />
            </Box>
          </Box>
        );

      case 'billing':
        return (
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={textStyles}>Current Plan</Typography>
              <Typography variant="h4" sx={textStyles}>Pro</Typography>
              <Button variant="outlined" sx={{ ...buttonStyles, mt: 2 }}>
                UPGRADE PLAN
              </Button>
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom sx={textStyles}>Payment Method</Typography>
              <Typography sx={textStyles}>•••• •••• •••• 4242</Typography>
              <Button variant="outlined" sx={{ ...buttonStyles, mt: 2 }}>
                UPDATE
              </Button>
            </Box>
          </Box>
        );

      case 'preferences':
        return (
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Switch
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-thumb': {
                      bgcolor: 'var(--text-color)',
                    },
                    '& .MuiSwitch-track': {
                      bgcolor: 'var(--text-color)',
                      opacity: 0.3,
                    }
                  }}
                />
                <Typography sx={textStyles}>Dark Mode</Typography>
              </Box>
              <Box>
                <Typography gutterBottom sx={textStyles}>Language</Typography>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  fullWidth
                  sx={{
                    ...textStyles,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--text-color)',
                      opacity: 0.3
                    }
                  }}
                >
                  <MenuItem value="English" sx={textStyles}>English</MenuItem>
                  <MenuItem value="Spanish" sx={textStyles}>Spanish</MenuItem>
                  <MenuItem value="French" sx={textStyles}>French</MenuItem>
                </Select>
              </Box>
            </Box>
          </Box>
        );

      case 'security':
        return (
          <Box sx={{ p: 3 }}>
            <Button variant="outlined" fullWidth sx={{ ...buttonStyles, mb: 4 }}>
              ENABLE TWO-FACTOR AUTHENTICATION
            </Button>
            <Typography variant="h6" gutterBottom sx={textStyles}>Change Password</Typography>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              sx={{ ...inputStyles, mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              sx={{ ...inputStyles, mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              sx={inputStyles}
            />
          </Box>
        );

      case 'notifications':
        return (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {Object.entries(notifications).map(([key, value]) => (
                <Box key={key} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Switch
                    checked={value}
                    onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                    sx={{
                      '& .MuiSwitch-thumb': {
                        bgcolor: 'var(--text-color)',
                      },
                      '& .MuiSwitch-track': {
                        bgcolor: 'var(--text-color)',
                        opacity: 0.3,
                      }
                    }}
                  />
                  <Typography sx={textStyles}>
                    {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        );

      case 'api':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={textStyles}>API Keys</Typography>
            <TextField
              fullWidth
              value="sk_test_•••••••••••••••••••••••••••••"
              InputProps={{ readOnly: true }}
              sx={{ ...inputStyles, mb: 2 }}
            />
            <Button variant="outlined" sx={buttonStyles}>
              GENERATE NEW KEY
            </Button>
          </Box>
        );

      case 'help':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={textStyles}>Support</Typography>
            <Button variant="outlined" fullWidth sx={{ ...buttonStyles, mb: 2 }}>
              VIEW DOCUMENTATION
            </Button>
            <Button variant="outlined" fullWidth sx={buttonStyles}>
              CONTACT SUPPORT
            </Button>
          </Box>
        );

      case 'legal':
        return (
          <Box sx={{ p: 3 }}>
            <Button variant="outlined" fullWidth sx={{ ...buttonStyles, mb: 2 }}>
              TERMS OF SERVICE
            </Button>
            <Button variant="outlined" fullWidth sx={{ ...buttonStyles, mb: 2 }}>
              PRIVACY POLICY
            </Button>
            <Button variant="outlined" color="error" fullWidth sx={buttonStyles}>
              DELETE ACCOUNT
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }} className="settings-container">
      <Typography variant="h4" gutterBottom sx={{ mb: 4, ...textStyles }}>
        Settings
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Paper sx={{ width: 250, bgcolor: '#151e29' }}>
          <List>
            {sections.map((section) => (
              <ListItemButton
                key={section.id}
                selected={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'rgba(56, 157, 81, 0.1)',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(56, 157, 81, 0.05)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'var(--text-color)' }}>
                  {section.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={section.label}
                  sx={{ 
                    '& .MuiTypography-root': { 
                      color: 'var(--text-color)',
                      fontSize: '0.9rem',
                    }
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>

        <Paper sx={{ flexGrow: 1, bgcolor: '#151e29', minHeight: 400 }}>
          {renderContent()}
        </Paper>
      </Box>
    </Box>
  );
};

export default Settings;