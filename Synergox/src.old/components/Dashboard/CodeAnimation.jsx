import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';

const CodeAnimation = () => {
  const [snippets, setSnippets] = useState([]);
  const timeoutRef = useRef(null);

  const examples = [
    {
      type: 'code',
      title: "React Component",
      content: `const Button = ({ onClick, children }) => (
  <button className="btn-primary">
    {children}
  </button>
);`
    },
    {
      type: 'code',
      title: "API Call",
      content: `async function fetchData() {
  const response = await api.get('/data');
  return response.data;
}`
    },
    {
      type: 'conversation',
      title: "Login Form",
      content: `User: Generate a login form with validation
Assistant: Here's a React login form with validation...`
    },
    {
      type: 'conversation',
      title: "Dark Mode",
      content: `User: How do I implement dark mode?
Assistant: Let's create a theme toggle using CSS variables...`
    },
    {
      type: 'code',
      title: "Custom Hook",
      content: `const useForm = (initial = {}) => {
  const [values, setValues] = useState(initial);
  return { values, handleChange };
};`
    },
    {
      type: 'conversation',
      title: "Infinite Scroll",
      content: `User: How can I implement infinite scrolling?
Assistant: We can use Intersection Observer with useEffect...`
    },
    {
      type: 'code',
      title: "Redux Slice",
      content: `const userSlice = createSlice({
  name: 'user',
  initialState: { data: null },
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
    }
  }
});`
    },
    {
      type: 'conversation',
      title: "File Upload",
      content: `User: How do I handle file uploads?
Assistant: Let's create a drag-and-drop file upload component...`
    }
  ];

  // Function to get a random position around the form
  const getRandomPosition = () => {
    // Define areas around the center, but not directly in the middle
    const areas = [
      // Left side
      { x: [-600, -200], y: [-200, 200] },
      // Right side
      { x: [200, 600], y: [-200, 200] },
      // Top corners
      { x: [-500, -200], y: [-400, -200] },
      { x: [200, 500], y: [-400, -200] },
      // Bottom corners
      { x: [-500, -200], y: [200, 400] },
      { x: [200, 500], y: [200, 400] }
    ];

    const area = areas[Math.floor(Math.random() * areas.length)];
    return {
      x: area.x[0] + Math.random() * (area.x[1] - area.x[0]),
      y: area.y[0] + Math.random() * (area.y[1] - area.y[0])
    };
  };

  // Function to check if a position overlaps with existing snippets
  const isOverlapping = (newPos, existingSnippets) => {
    return existingSnippets.some(snippet => {
      const dx = newPos.x - snippet.x;
      const dy = newPos.y - snippet.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < 300; // Increased minimum distance
    });
  };

  // Get a valid position that doesn't overlap
  const getValidPosition = (existingSnippets) => {
    let position;
    let attempts = 0;
    do {
      position = getRandomPosition();
      attempts++;
    } while (isOverlapping(position, existingSnippets) && attempts < 10);
    return position;
  };

  useEffect(() => {
    const addSnippet = () => {
      setSnippets(current => {
        const newSnippets = [...current];
        if (newSnippets.length >= 4) { // Show more snippets simultaneously
          newSnippets.shift();
        }

        const position = getValidPosition(newSnippets);
        const example = examples[Math.floor(Math.random() * examples.length)];
        
        newSnippets.push({
          ...example,
          id: Date.now(),
          x: position.x,
          y: position.y,
          typedContent: '',
          fullContent: example.content,
          charIndex: 0
        });
        return newSnippets;
      });
    };

    const interval = setInterval(addSnippet, 4000); // Slightly faster interval
    addSnippet();

    return () => clearInterval(interval);
  }, []);

  // Typing animation effect
  useEffect(() => {
    const typeInterval = setInterval(() => {
      setSnippets(current =>
        current.map(snippet => {
          if (snippet.charIndex >= snippet.fullContent.length) {
            return snippet;
          }
          return {
            ...snippet,
            typedContent: snippet.fullContent.slice(0, snippet.charIndex + 1),
            charIndex: snippet.charIndex + 1
          };
        })
      );
    }, 30);

    return () => clearInterval(typeInterval);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {snippets.map((snippet) => (
        <Box
          key={snippet.id}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(calc(-50% + ${snippet.x}px), calc(-50% + ${snippet.y}px))`,
            maxWidth: '300px',
            minWidth: '250px',
            opacity: 0.2,
            transition: 'opacity 0.3s ease-out',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'var(--text-color)',
              fontFamily: 'Fira Code, monospace',
              mb: 1,
              display: 'block',
              opacity: 0.8,
              fontSize: '15px',
              fontWeight: 500
            }}
          >
            {snippet.title}
          </Typography>
          <Box
            sx={{
              backgroundColor: 'transparent',
              borderRadius: '8px',
              p: 2,
              fontFamily: 'Fira Code, monospace',
              fontSize: '15px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              color: 'var(--text-color)',
              border: '1px solid rgba(56, 157, 81, 0.1)',
              width: '100%',
              minHeight: '80px',
            }}
          >
            {snippet.typedContent}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CodeAnimation;