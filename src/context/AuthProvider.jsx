// src/context/AuthProvider.jsx

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getUserData } from '../api/userService';
import { AuthContext } from './AuthContext'; // ✨ UPDATED: Import the context from its new file

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userData = await getUserData(user.uid);
        setUserRole(userData?.role || 'student');
      } else {
        setUserRole(null);
      }
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);
  
  const facultyLogin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const setupFacultyPassword = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const sendFacultyPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
  };
  
  const appSignOut = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    userRole,
    authLoading,
    facultyLogin,
    setupFacultyPassword,
    sendFacultyPasswordReset,
    appSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!authLoading && children}
    </AuthContext.Provider>
  );
};