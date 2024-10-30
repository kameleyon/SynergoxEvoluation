import React, { useState } from 'react';
import { Folder, File, Code, Clock, Edit2, Trash2, MessageSquare, Plus, Save, FileText, FileJson, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeEditor from '../Editor/CodeEditor';
import { useCollaboration } from '../../hooks/useCollaboration';
import { createNewFile } from '../../models/project';
import '../../styles/project.css';

const FILE_TEMPLATES = {
  'JavaScript': { ext: '.js', icon: Code },
  'HTML': { ext: '.html', icon: FileText },
  'CSS': { ext: '.css', icon: FileText },
  'JSON': { ext: '.json', icon: FileJson },
  'TypeScript': { ext: '.ts', icon: Code },
  'React': { ext: '.jsx', icon: Code },
  'SCSS': { ext: '.scss', icon: FileText }
};

const Project = ({ project, isActive, onEdit, onDelete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('JavaScript');
  const { collaborators, updateContent } = useCollaboration(project.id, 'project');

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <Code size={16} />;
      case 'json':
        return <FileJson size={16} />;
      case 'html':
      case 'htm':
        return <FileText size={16} />;
      case 'css':
      case 'scss':
      case 'sass':
        return <Coffee size={16} />;
      default:
        return <File size={16} />;
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleNewFile = async () => {
    if (!newFileName.trim()) return;

    try {
      const fileName = newFileName.includes('.')
        ? newFileName
        : `${newFileName}${FILE_TEMPLATES[selectedTemplate].ext}`;

      const file = await createNewFile(project.id, fileName);
      onEdit({
        ...project,
        files: [...(project.files || []), file]
      });
      setSelectedFile(file);
      setIsCreatingFile(false);
      setNewFileName('');
      setSelectedTemplate('JavaScript');
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  const handleContentChange = async (fileId, newContent) => {
    try {
      await updateContent({
        ...project,
        files: {
          ...(project.files || {}),
          [fileId]: {
            ...(project.files?.[fileId] || {}),
            content: newContent,
            lastModified: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Error updating file content:', error);
    }
  };

  return (
    <motion.div 
      className={`project-container ${isActive ? 'project-active' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="project-header">
        <div className="project-title-container">
          <Folder className="theme-icon" size={18} />
          <h3 className="project-title">{project.name}</h3>
          <span className="project-status">
            <Clock size={14} className="theme-icon" />
            {new Date(project.timestamp).toLocaleTimeString()}
          </span>
          {collaborators.length > 0 && (
            <div className="collaborators">
              {collaborators.length} active
            </div>
          )}
        </div>
        <div className="project-actions">
          <button
            className="action-button"
            onClick={() => onEdit(project)}
            title="Edit Project"
          >
            <Edit2 className="theme-icon" size={18} />
          </button>
          <button
            className="action-button"
            onClick={() => onDelete(project.id)}
            title="Delete Project"
          >
            <Trash2 className="theme-icon" size={18} />
          </button>
        </div>
      </div>

      {project.chatHistory && (
        <div className="project-origin">
          <MessageSquare size={14} className="theme-icon" />
          <span>Created from chat: {project.chatHistory.summary}</span>
        </div>
      )}

      <div className="project-content">
        <div className="file-sidebar">
          <div className="files-header">
            <h4>Files</h4>
            {isCreatingFile ? (
              <div className="new-file-form">
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="template-select"
                >
                  {Object.keys(FILE_TEMPLATES).map(template => (
                    <option key={template} value={template}>
                      {template}
                    </option>
                  ))}
                </select>
                <div className="new-file-input">
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder={`filename${FILE_TEMPLATES[selectedTemplate].ext}`}
                    onKeyPress={(e) => e.key === 'Enter' && handleNewFile()}
                    autoFocus
                  />
                  <button
                    className="action-button"
                    onClick={handleNewFile}
                    disabled={!newFileName.trim()}
                  >
                    <Save className="theme-icon" size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="action-button"
                onClick={() => setIsCreatingFile(true)}
                title="New File"
              >
                <Plus className="theme-icon" size={16} />
              </button>
            )}
          </div>
          
          <div className="file-list">
            <AnimatePresence>
              {project.files?.length > 0 ? (
                project.files.map(file => (
                  <motion.div
                    key={file.fileId}
                    className={`file-item ${selectedFile?.fileId === file.fileId ? 'active' : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={() => handleFileSelect(file)}
                  >
                    <div className="file-icon">
                      {getFileIcon(file.name)}
                    </div>
                    <span className="file-name">{file.name}</span>
                    <span className="file-timestamp">
                      {new Date(file.timestamp).toLocaleDateString()}
                    </span>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  exit={{ opacity: 0 }}
                  className="no-files"
                >
                  <p>No files yet</p>
                  <small>Create a new file to get started</small>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="editor-section">
          {selectedFile ? (
            <CodeEditor
              projectId={project.id}
              fileId={selectedFile.fileId}
              fileName={selectedFile.name}
              initialContent={selectedFile.content}
              onContentChange={(content) => handleContentChange(selectedFile.fileId, content)}
            />
          ) : (
            <div className="no-file-selected">
              <Code size={24} className="theme-icon" />
              <p>Select a file to start editing</p>
              <small>Or create a new file using the + button</small>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Project;
