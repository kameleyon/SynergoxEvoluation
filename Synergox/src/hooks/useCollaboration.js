import { useEffect, useState, useCallback } from 'react';
import { ref, onValue, set, push, serverTimestamp } from 'firebase/database';
import { database } from '../firebaseConfig';

export const useCollaboration = (activityId, type) => {
  const [content, setContent] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    if (!activityId || !type) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const activityRef = ref(database, `${type}s/${activityId}`);
    const collaboratorsRef = ref(database, `${type}s/${activityId}/collaborators`);

    // Listen for content changes
    const contentUnsubscribe = onValue(activityRef, 
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setContent(data);
          setLastUpdate(new Date().toISOString());
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching content:', error);
        setError(error);
        setIsLoading(false);
      }
    );

    // Listen for collaborator changes
    const collaboratorsUnsubscribe = onValue(collaboratorsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCollaborators(Object.values(data));
        }
      },
      (error) => {
        console.error('Error fetching collaborators:', error);
      }
    );

    return () => {
      contentUnsubscribe();
      collaboratorsUnsubscribe();
    };
  }, [activityId, type]);

  const updateContent = useCallback(async (newContent, userId = null) => {
    if (!activityId || !type) return false;
    
    try {
      const updates = {
        content: newContent,
        lastModified: serverTimestamp(),
        lastModifiedBy: userId
      };

      await set(ref(database, `${type}s/${activityId}`), {
        ...content,
        ...updates
      });

      // Add to history
      if (userId) {
        const historyRef = push(ref(database, `${type}s/${activityId}/history`));
        await set(historyRef, {
          ...updates,
          timestamp: serverTimestamp()
        });
      }

      return true;
    } catch (error) {
      console.error('Error updating content:', error);
      setError(error);
      return false;
    }
  }, [activityId, type, content]);

  const addCollaborator = useCallback(async (userId, userInfo) => {
    if (!activityId || !type) return false;
    
    try {
      await set(
        ref(database, `${type}s/${activityId}/collaborators/${userId}`),
        {
          id: userId,
          ...userInfo,
          joinedAt: serverTimestamp(),
          lastActive: serverTimestamp()
        }
      );
      return true;
    } catch (error) {
      console.error('Error adding collaborator:', error);
      setError(error);
      return false;
    }
  }, [activityId, type]);

  const updateCollaboratorStatus = useCallback(async (userId, status) => {
    if (!activityId || !type) return false;

    try {
      await set(
        ref(database, `${type}s/${activityId}/collaborators/${userId}/status`),
        status
      );
      await set(
        ref(database, `${type}s/${activityId}/collaborators/${userId}/lastActive`),
        serverTimestamp()
      );
      return true;
    } catch (error) {
      console.error('Error updating collaborator status:', error);
      setError(error);
      return false;
    }
  }, [activityId, type]);

  const removeCollaborator = useCallback(async (userId) => {
    if (!activityId || !type) return false;

    try {
      await set(
        ref(database, `${type}s/${activityId}/collaborators/${userId}`),
        null
      );
      return true;
    } catch (error) {
      console.error('Error removing collaborator:', error);
      setError(error);
      return false;
    }
  }, [activityId, type]);

  return {
    content,
    collaborators,
    isLoading,
    error,
    lastUpdate,
    updateContent,
    addCollaborator,
    updateCollaboratorStatus,
    removeCollaborator,
    // Helper methods
    hasCollaborator: useCallback((userId) => 
      collaborators.some(c => c.id === userId),
      [collaborators]
    ),
    getCollaborator: useCallback((userId) =>
      collaborators.find(c => c.id === userId),
      [collaborators]
    ),
    isActiveCollaborator: useCallback((userId) => {
      const collaborator = collaborators.find(c => c.id === userId);
      if (!collaborator) return false;
      
      const lastActive = new Date(collaborator.lastActive);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      return lastActive > fiveMinutesAgo;
    }, [collaborators])
  };
};
