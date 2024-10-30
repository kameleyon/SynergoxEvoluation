import { database } from '../firebaseConfig';
import { ref, set, push, serverTimestamp } from 'firebase/database';

// Project Model
export const createProject = async (name, chatHistory = null) => {
  const project = {
    id: Date.now().toString(),
    name: name || `Project ${new Date().toLocaleString()}`,
    files: {},
    chatHistory,
    status: 'In Progress',
    timestamp: serverTimestamp(),
    type: 'project',
    settings: {
      language: 'javascript',
      theme: 'dark',
      autoSave: true
    }
  };

  try {
    await set(ref(database, `projects/${project.id}`), project);
    return project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// File Templates
export const FILE_TEMPLATES = {
  'JavaScript': {
    ext: '.js',
    content: '// JavaScript code here\n\n'
  },
  'HTML': {
    ext: '.html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Page</title>
</head>
<body>
    
</body>
</html>`
  },
  'CSS': {
    ext: '.css',
    content: `/* CSS styles */
:root {
    /* Variables */
}

body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}`
  },
  'JSON': {
    ext: '.json',
    content: `{
    "name": "project-name",
    "version": "1.0.0",
    "description": ""
}`
  },
  'TypeScript': {
    ext: '.ts',
    content: `// TypeScript code here
interface Example {
    property: string;
    method(): void;
}

class Implementation implements Example {
    property: string;

    constructor() {
        this.property = '';
    }

    method(): void {
        // Implementation
    }
}`
  },
  'React': {
    ext: '.jsx',
    content: `import React from 'react';

const Component = () => {
    return (
        <div>
            <h1>New Component</h1>
        </div>
    );
};

export default Component;`
  },
  'SCSS': {
    ext: '.scss',
    content: `// SCSS styles
$primary-color: #007bff;
$secondary-color: #6c757d;

@mixin flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    @include flex-center;
    
    .content {
        // Nested styles
    }
}`
  }
};

// File Model
export const createFile = async (projectId, name, content = '', language = 'javascript') => {
  const file = {
    fileId: Date.now().toString(),
    name,
    content,
    language,
    timestamp: serverTimestamp(),
    lastModifiedBy: null,
    version: 1,
    history: []
  };

  try {
    await set(ref(database, `projects/${projectId}/files/${file.fileId}`), file);
    return file;
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
};

// Create new file with template
export const createNewFile = async (projectId, fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  let template = null;

  // Find matching template
  for (const [name, t] of Object.entries(FILE_TEMPLATES)) {
    if (fileName.endsWith(t.ext)) {
      template = t;
      break;
    }
  }

  // Get language from extension
  const language = getLanguageFromExt(ext);

  // Create file with template content or empty content
  return await createFile(
    projectId,
    fileName,
    template?.content || '',
    language
  );
};

// Helper Functions
export const getLanguageFromExt = (ext) => {
  switch (ext) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'html':
    case 'htm':
      return 'html';
    case 'css':
    case 'scss':
    case 'sass':
      return 'css';
    case 'json':
      return 'json';
    default:
      return 'plaintext';
  }
};

// File Operations
export const updateFile = async (projectId, fileId, content) => {
  try {
    const fileRef = ref(database, `projects/${projectId}/files/${fileId}`);
    await set(fileRef, {
      content,
      lastModified: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating file:', error);
    return false;
  }
};

export const addFileVersion = async (projectId, fileId, content, userId) => {
  try {
    const versionRef = push(ref(database, `projects/${projectId}/files/${fileId}/history`));
    await set(versionRef, {
      content,
      timestamp: serverTimestamp(),
      userId
    });
    return true;
  } catch (error) {
    console.error('Error adding file version:', error);
    return false;
  }
};

// Project Status Types
export const PROJECT_STATUS = {
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived'
};
