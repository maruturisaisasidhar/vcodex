// src/hooks/useProjectSession.js

import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import {
  doc,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,

  arrayRemove,
  serverTimestamp
} from 'firebase/firestore';

export const useProjectSession = (projectId) => {
  const [team, setTeam] = useState(null);
  const [messages, setMessages] = useState([]);
  const [cursors, setCursors] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  // --- REAL-TIME LISTENERS ---
  useEffect(() => {
    if (!projectId || !currentUser) return;

    setLoading(true);
    const projectRef = doc(db, 'projects', projectId);

    // Main listener for the project document (team, etc.)
    const projectUnsub = onSnapshot(projectRef, (docSnap) => {
      if (docSnap.exists()) {
        setTeam(docSnap.data().team);
      }
      setLoading(false);
    });

    // Listener for chat messages
    const chatRef = collection(projectRef, 'chat');
    const chatUnsub = onSnapshot(chatRef, (snapshot) => {
      const chatMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      chatMessages.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds);
      setMessages(chatMessages);
    });

    // Listener for cursor positions
    const cursorRef = collection(projectRef, 'cursors');
    const cursorUnsub = onSnapshot(cursorRef, (snapshot) => {
      const cursorData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(cursor => cursor.id !== currentUser.uid); // Don't show our own cursor
      setCursors(cursorData);
    });

    // Cleanup function to close listeners on unmount
    return () => {
      projectUnsub();
      chatUnsub();
      cursorUnsub();
    };
  }, [projectId, currentUser]);

  // --- ACTION FUNCTIONS ---

  /**
   * Sends a message to the project chat. Can be a group or direct message.
   */
  const sendMessage = async (messageText, recipientId = null) => {
    if (!messageText.trim()) return;

    const chatRef = collection(db, 'projects', projectId, 'chat');
    await addDoc(chatRef, {
      senderId: currentUser.uid,
      senderName: currentUser.displayName,
      text: messageText,
      recipientId: recipientId, // null for group, UID for direct message
      createdAt: serverTimestamp(),
    });
  };

  /**
   * Updates the current user's online status and the file they are viewing.
   */
  const updateUserStatus = async (isOnline, currentFile = null) => {
      // This is a complex update. A backend function (Cloud Function) is often
      // better for this, but for now, we can do it client-side.
      // This logic would need to be more robust in a full app.
      console.log(`Updating status: online=${isOnline}, file=${currentFile}`);
  };

  /**
   * Removes a team member from the project (leader only).
   */
  const removeMember = async (memberId) => {
    if (!team || currentUser.uid !== team.leader) {
      alert("Only the team leader can remove members.");
      return;
    }
    if (memberId === team.leader) {
      alert("The leader cannot be removed.");
      return;
    }

    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      // Find the member object to remove
      'team.members': arrayRemove(team.members.find(m => m.uid === memberId))
    });
  };

  return {
    loading,
    team,
    messages,
    cursors,
    sendMessage,
    updateUserStatus,
    removeMember,
  };
};

export default useProjectSession