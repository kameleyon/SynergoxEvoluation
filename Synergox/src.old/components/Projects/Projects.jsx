import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Divider,
  Alert,
} from '@mui/material';
import {
  Search,
  Star,
  MoreVertical,
  Archive,
  Edit3,
  Trash2,
  Calendar,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const Projects = ({ chatHistory = [], onDelete, onToggleFavorite }) => {
  const { user, isLoaded: clerkLoaded } = useUser();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const handleMenuClick = (event, chat) => {
    setAnchorEl(event.currentTarget);
    setSelectedChat(chat);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedChat(null);
  };

  const handleDelete = () => {
    if (selectedChat && onDelete) {
      onDelete(selectedChat.id);
    }
    handleMenuClose();
  };

  const handleFavorite = (chatId) => {
    if (onToggleFavorite) {
      onToggleFavorite(chatId);
    }
  };

  const handleNewChat = () => {
    navigate('/');
  };

  const filteredChats = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.query.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedChats = filteredChats.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (!clerkLoaded) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="info">Loading chat history...</Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Please sign in to view your chat history.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, color: 'var(--text-color)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'var(--text-color)' }}>Chat History</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={handleNewChat}
          sx={{ color: 'var(--text-color)', bgcolor: '#88ab75' }}
        >
          New Chat
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
        <TextField
          fullWidth
          placeholder="Search chat history..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} style={{ color: 'var(--text-color)' }} />
              </InputAdornment>
            ),
            sx: { color: 'var(--text-color)' }
          }}
        />
      </Paper>

      {paginatedChats.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No chat history found. Start a new conversation!
        </Alert>
      ) : (
        paginatedChats.map((chat) => (
          <Paper 
            key={chat.id} 
            sx={{ 
              p: 3, 
              mb: 2, 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-color)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" sx={{ color: 'var(--text-color)' }}>
                  {chat.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-color)', opacity: 0.8 }}>
                  {chat.query}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Calendar size={16} style={{ color: 'var(--text-color)' }} />
                  <Typography variant="body2" sx={{ color: 'var(--text-color)' }}>
                    {new Date(chat.timestamp).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <IconButton 
                  onClick={() => handleFavorite(chat.id)}
                  sx={{ color: 'var(--text-color)' }}
                >
                  <Star
                    size={20}
                    fill={chat.favorite ? 'currentColor' : 'none'}
                  />
                </IconButton>
                <IconButton 
                  onClick={(e) => handleMenuClick(e, chat)}
                  sx={{ color: 'var(--text-color)' }}
                >
                  <MoreVertical size={20} />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1 }}>
        {Array.from(
          { length: Math.ceil(filteredChats.length / itemsPerPage) },
          (_, i) => (
            <Button
              key={i + 1}
              variant={page === i + 1 ? 'contained' : 'outlined'}
              onClick={() => setPage(i + 1)}
              sx={{ color: 'var(--text-color)' }}
            >
              {i + 1}
            </Button>
          )
        )}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { 
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-color)'
          }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Edit3 size={20} style={{ color: 'var(--text-color)' }} />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Archive size={20} style={{ color: 'var(--text-color)' }} />
          </ListItemIcon>
          <ListItemText>Archive</ListItemText>
        </MenuItem>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        <MenuItem onClick={handleDelete} sx={{ color: '#ff6b6b' }}>
          <ListItemIcon>
            <Trash2 size={20} style={{ color: '#ff6b6b' }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Projects;