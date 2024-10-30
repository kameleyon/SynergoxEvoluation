import React, { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from '@codemirror/basic-setup';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { useCollaboration } from '../../hooks/useCollaboration';
import './editor.css';

const getLanguageExtension = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return javascript();
    case 'html':
    case 'htm':
      // Dynamically import HTML language support
      return import('@codemirror/lang-html').then(m => m.html());
    case 'css':
    case 'scss':
    case 'sass':
      // Dynamically import CSS language support
      return import('@codemirror/lang-css').then(m => m.css());
    default:
      return javascript();
  }
};

const CodeEditor = ({ 
  projectId, 
  fileId, 
  initialContent = '', 
  fileName = 'untitled.js',
  onContentChange 
}) => {
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  const { content, updateContent, isLoading } = useCollaboration(projectId, 'project');

  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const setupEditor = async () => {
      const languageExtension = await getLanguageExtension(fileName);
      const startState = EditorState.create({
        doc: content?.files?.[fileId]?.content || initialContent,
        extensions: [
          basicSetup,
          languageExtension,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newContent = update.state.doc.toString();
              updateContent({
                ...content,
                files: {
                  ...content.files,
                  [fileId]: {
                    ...content.files[fileId],
                    content: newContent,
                    lastModified: new Date().toISOString()
                  }
                }
              });
              onContentChange?.(newContent);
            }
          })
        ]
      });

      const view = new EditorView({
        state: startState,
        parent: editorRef.current
      });

      viewRef.current = view;
    };

    setupEditor();

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [content, initialContent, fileName]);

  // Update editor content when it changes in Firebase
  useEffect(() => {
    if (!viewRef.current || !content?.files?.[fileId]?.content || isLoading) return;

    const currentContent = viewRef.current.state.doc.toString();
    const newContent = content.files[fileId].content;

    if (newContent !== currentContent) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: currentContent.length,
          insert: newContent
        }
      });
    }
  }, [content?.files?.[fileId]?.content, isLoading]);

  return (
    <div className="code-editor-container">
      {isLoading ? (
        <div className="editor-loading">
          <div className="loading-spinner" />
          <span>Loading editor...</span>
        </div>
      ) : (
        <div className="editor-wrapper">
          <div className="editor-header">
            <span className="file-name">{fileName}</span>
            <span className="file-type">{fileName.split('.').pop().toUpperCase()}</span>
          </div>
          <div className="editor-content" ref={editorRef} />
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
