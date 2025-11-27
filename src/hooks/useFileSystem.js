// import { useState, useCallback } from 'react';
// import { db } from '../firebase/config';
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   doc,
//   getDoc,
//   addDoc,
//   updateDoc,
// } from 'firebase/firestore';

// export const useFileSystem = () => {
//   const [loading, setLoading] = useState(false);

//   // Fetches all projects owned by the user
//   const fetchProjects = useCallback(async (userId) => {
//     if (!userId) return [];
//     setLoading(true);
//     try {
//       const projectsRef = collection(db, 'projects');
//       const q = query(projectsRef, where('ownerId', '==', userId));
//       const querySnapshot = await getDocs(q);
//       const userProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setLoading(false);
//       return userProjects;
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//       setLoading(false);
//       return [];
//     }
//   }, []);

//   // Fetches complete data for a single project
//   const fetchProjectData = async (projectId) => {
//     if (!projectId) return null;
//     setLoading(true);
//     try {
//       const projectRef = doc(db, 'projects', projectId);
//       const docSnap = await getDoc(projectRef);
//       setLoading(false);
//       return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
//     } catch (error) {
//       console.error("Error fetching project data:", error);
//       setLoading(false);
//       return null;
//     }
//   };

//   // Creates a new project
//   const createNewProject = async (userId, projectName) => {
//     if (!userId || !projectName) return null;
//     setLoading(true);
//     try {
//       const newProject = {
//         name: projectName,
//         ownerId: userId,
//         createdAt: new Date(),
//         lastModified: new Date(),
//         collaborators: [userId],
//         files: {
//           'index.html': { language: 'html', content: '<h1>Welcome to your new project!</h1>' },
//           'style.css': { language: 'css', content: 'body { \n  background-color: #282c34; \n}' },
//           'script.js': { language: 'javascript', content: 'console.log("Hello, V-CodeX!");' },
//         },
//       };
//       const docRef = await addDoc(collection(db, 'projects'), newProject);
//       setLoading(false);
//       return docRef.id;
//     } catch (error) {
//       console.error("Error creating new project:", error);
//       setLoading(false);
//       return null;
//     }
//   };

//   // ✅ FIX: This function now accepts 'newLanguage' to save language changes.
//   const updateFileContent = async (projectId, filePath, newContent, newLanguage) => {
//     if (!projectId || !filePath) return;
//     try {
//       const projectRef = doc(db, 'projects', projectId);
      
//       // Define paths for both content and language fields in the database
//       const contentFieldPath = `files.${filePath}.content`;
//       const languageFieldPath = `files.${filePath}.language`;

//       // Atomically update both fields in the Firestore document
//       await updateDoc(projectRef, {
//         [contentFieldPath]: newContent,
//         [languageFieldPath]: newLanguage, // Save the new language
//         lastModified: new Date(),
//       });
//     } catch (error) {
//       console.error("Error updating file:", error);
//     }
//   };

//   // Fetches collaboration requests received by the user
//   const fetchIncomingRequests = async (userEmail) => {
//     if (!userEmail) return [];
//     try {
//       const requestsRef = collection(db, 'collaborationRequests');
//       const q = query(
//         requestsRef,
//         where('to', '==', userEmail),
//         where('status', '==', 'pending')
//       );
//       const querySnapshot = await getDocs(q);
//       return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     } catch (error) {
//       console.error("Error fetching incoming requests:", error);
//       return [];
//     }
//   };

//   // Fetches collaboration requests sent by the user
//   const fetchSentRequests = async (userId) => {
//     if (!userId) return [];
//     try {
//       const requestsRef = collection(db, 'collaborationRequests');
//       const q = query(
//         requestsRef,
//         where('fromId', '==', userId),
//         where('status', '==', 'pending')
//       );
//       const querySnapshot = await getDocs(q);
//       return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     } catch (error) {
//       console.error("Error fetching sent requests:", error);
//       return [];
//     }
//   };

//   // Exporting all functions
//   return {
//     loading,
//     fetchProjects,
//     fetchProjectData,
//     createNewProject,
//     updateFileContent,
//     fetchIncomingRequests,
//     fetchSentRequests,
//   };
// };


/*
 * ✅ FINAL MERGED: src/hooks/useFileSystem.js
 * - All functions combined: user management, projects, file system, collaboration requests
 */

// import { useState, useCallback } from 'react';
// import { db } from '../firebase/config';
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   doc,
//   getDoc,
//   setDoc,   // needed for user docs
//   addDoc,
//   updateDoc,
//   deleteDoc,
// } from 'firebase/firestore';

// export const useFileSystem = () => {
//   const [loading, setLoading] = useState(false);

//   // ✅ Create user document if it doesn't exist
//   const manageUserDocument = async (user) => {
//     if (!user) return;
//     const userRef = doc(db, 'users', user.uid);
//     const userSnap = await getDoc(userRef);

//     if (!userSnap.exists()) {
//       try {
//         await setDoc(userRef, {
//           uid: user.uid,
//           email: user.email,
//           displayName: user.displayName,
//           photoURL: user.photoURL,
//           createdAt: new Date(),
//         });
//       } catch (error) {
//         console.error("Error creating user document:", error);
//       }
//     }
//   };

//   // ✅ Fetch all projects owned by the user
//   const fetchProjects = useCallback(async (userId) => {
//     if (!userId) return [];
//     setLoading(true);
//     try {
//       const projectsRef = collection(db, 'projects');
//       const q = query(projectsRef, where('ownerId', '==', userId));
//       const querySnapshot = await getDocs(q);
//       const userProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setLoading(false);
//       return userProjects;
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//       setLoading(false);
//       return [];
//     }
//   }, []);

//   // ✅ Fetch a single project's data
//   const fetchProjectData = useCallback(async (projectId) => {
//     if (!projectId) return null;
//     setLoading(true);
//     try {
//       const projectRef = doc(db, 'projects', projectId);
//       const docSnap = await getDoc(projectRef);
//       setLoading(false);
//       return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
//     } catch (error) {
//       console.error("Error fetching project data:", error);
//       setLoading(false);
//       return null;
//     }
//   }, []);

//   // ✅ Create a new project with default starter files
//   const createNewProject = async (userId, projectName) => {
//     if (!userId || !projectName) return null;
//     setLoading(true);
//     try {
//       const newProject = {
//         name: projectName,
//         ownerId: userId,
//         createdAt: new Date(),
//         lastModified: new Date(),
//         collaborators: [userId],
//         files: {
//           'index.html': { language: 'html', content: '<h1>Welcome to your new project!</h1>' },
//           'style.css': { language: 'css', content: 'body { \n  background-color: #282c34; \n}' },
//           'script.js': { language: 'javascript', content: 'console.log("Hello, V-CodeX!");' },
//         },
//       };
//       const docRef = await addDoc(collection(db, 'projects'), newProject);
//       setLoading(false);
//       return docRef.id;
//     } catch (error) {
//       console.error("Error creating new project:", error);
//       setLoading(false);
//       return null;
//     }
//   };

//   // ✅ Update a file (content + language)
//   const updateFileContent = async (projectId, filePath, newContent, newLanguage) => {
//     if (!projectId || !filePath) return;
//     try {
//       const projectRef = doc(db, 'projects', projectId);
//       const contentFieldPath = `files.${filePath}.content`;
//       const languageFieldPath = `files.${filePath}.language`;

//       await updateDoc(projectRef, {
//         [contentFieldPath]: newContent,
//         [languageFieldPath]: newLanguage,
//         lastModified: new Date(),
//       });
//     } catch (error) {
//       console.error("Error updating file:", error);
//     }
//   };

//   // ✅ Delete a project
//   const deleteProject = async (projectId) => {
//     if (!projectId) return;
//     setLoading(true);
//     try {
//       const projectRef = doc(db, 'projects', projectId);
//       await deleteDoc(projectRef);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error deleting project:", error);
//       setLoading(false);
//       throw error;
//     }
//   };

//   // ✅ --- FILE SYSTEM FUNCTIONS ---

//   // Create a new file in the project
//   const createFileInProject = async (projectId, filePath) => {
//     if (!projectId || !filePath) return;
//     const projectRef = doc(db, 'projects', projectId);
//     const extension = filePath.split('.').pop().toLowerCase();
//     const language = extension || 'plaintext'; // Default if no extension

//     await updateDoc(projectRef, {
//       [`files.${filePath}`]: { language, content: '' },
//       lastModified: new Date(),
//     });
//   };

//   // Create a new folder by adding a placeholder file
//   const createFolderInProject = async (projectId, folderPath) => {
//     if (!projectId || !folderPath) return;
//     const placeholderPath = `${folderPath}/.placeholder`;
//     await createFileInProject(projectId, placeholderPath);
//   };

//   // Delete a file or an entire folder
//   const deleteNodeInProject = async (projectId, path, isFolder) => {
//     if (!projectId || !path) return;
//     const projectRef = doc(db, 'projects', projectId);
//     const projectSnap = await getDoc(projectRef);
//     if (!projectSnap.exists()) return;

//     const currentFiles = projectSnap.data().files;
//     const updates = {};

//     if (isFolder) {
//       // Delete everything under the folder
//       Object.keys(currentFiles).forEach(filePath => {
//         if (!filePath.startsWith(path + '/')) {
//           updates[`files.${filePath}`] = currentFiles[filePath];
//         }
//       });
//     } else {
//       // Delete single file
//       Object.keys(currentFiles).forEach(filePath => {
//         if (filePath !== path) {
//           updates[`files.${filePath}`] = currentFiles[filePath];
//         }
//       });
//     }

//     await updateDoc(projectRef, {
//       files: updates,
//       lastModified: new Date(),
//     });
//   };

//   // ✅ --- COLLABORATION REQUESTS ---

//   // Fetch incoming collaboration requests
//   const fetchIncomingRequests = async (userEmail) => {
//     if (!userEmail) return [];
//     try {
//       const requestsRef = collection(db, 'collaborationRequests');
//       const q = query(
//         requestsRef,
//         where('to', '==', userEmail),
//         where('status', '==', 'pending')
//       );
//       const querySnapshot = await getDocs(q);
//       return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     } catch (error) {
//       console.error("Error fetching incoming requests:", error);
//       return [];
//     }
//   };

//   // Fetch sent collaboration requests
//   const fetchSentRequests = async (userId) => {
//     if (!userId) return [];
//     try {
//       const requestsRef = collection(db, 'collaborationRequests');
//       const q = query(
//         requestsRef,
//         where('fromId', '==', userId),
//         where('status', '==', 'pending')
//       );
//       const querySnapshot = await getDocs(q);
//       return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     } catch (error) {
//       console.error("Error fetching sent requests:", error);
//       return [];
//     }
//   };

//   return {
//     loading,
//     manageUserDocument,
//     fetchProjects,
//     fetchProjectData,
//     createNewProject,
//     updateFileContent,
//     deleteProject,
//     createFileInProject,
//     createFolderInProject,
//     deleteNodeInProject,
//     fetchIncomingRequests,
//     fetchSentRequests,
//   };
// };



// src/hooks/useFileSystem.js
import { useState, useCallback } from 'react';
import { db } from '../firebase/config';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp // <-- Merged import
} from 'firebase/firestore';

export const useFileSystem = () => {
  const [loading, setLoading] = useState(false);

  // ✅ Create user document if it doesn't exist
  const manageUserDocument = async (user) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      try {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
      } catch (error) {
        console.error("Error creating user document:", error);
      }
    }
  };

  // ✅ Fetch all projects owned by the user
  const fetchProjects = useCallback(async (userId) => {
    if (!userId) return [];
    setLoading(true);
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, where('ownerId', '==', userId));
      const querySnapshot = await getDocs(q);
      const userProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLoading(false);
      return userProjects;
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
      return [];
    }
  }, []);

  // ✅ Fetch a single project's data
  const fetchProjectData = useCallback(async (projectId) => {
    if (!projectId) return null;
    setLoading(true);
    try {
      const projectRef = doc(db, 'projects', projectId);
      const docSnap = await getDoc(projectRef);
      setLoading(false);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error("Error fetching project data:", error);
      setLoading(false);
      return null;
    }
  }, []);

  // ✅ Create a new project with starter files
  const createNewProject = async (userId, projectName) => {
    if (!userId || !projectName) return null;
    setLoading(true);
    try {
      const newProject = {
        name: projectName,
        ownerId: userId,
        createdAt: new Date(),
        lastModified: new Date(),
        collaborators: [userId],
        files: {
          'index.html': { language: 'html', content: '<h1>Welcome to your new project!</h1>' },
          'style.css': { language: 'css', content: 'body { \n  background-color: #282c34; \n}' },
          'script.js': { language: 'javascript', content: 'console.log("Hello, V-CodeX!");' },
        },
      };
      const docRef = await addDoc(collection(db, 'projects'), newProject);
      setLoading(false);
      return docRef.id;
    } catch (error) {
      console.error("Error creating new project:", error);
      setLoading(false);
      return null;
    }
  };

  // ✅ Update a file (content + language)
  const updateFileContent = async (projectId, filePath, newContent, newLanguage) => {
    if (!projectId || !filePath) return;
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        [`files.${filePath}.content`]: newContent,
        [`files.${filePath}.language`]: newLanguage,
        lastModified: new Date(),
      });
    } catch (error) {
      console.error("Error updating file:", error);
    }
  };

  // ✅ Delete a project
  const deleteProject = async (projectId) => {
    if (!projectId) return;
    setLoading(true);
    try {
      const projectRef = doc(db, 'projects', projectId);
      await deleteDoc(projectRef);
      setLoading(false);
    } catch (error) {
      console.error("Error deleting project:", error);
      setLoading(false);
      throw error;
    }
  };

  // ✅ Create a new file
  const createFileInProject = async (projectId, filePath) => {
    if (!projectId || !filePath) return;
    const projectRef = doc(db, 'projects', projectId);
    const extension = filePath.split('.').pop().toLowerCase();
    const language = extension || 'plaintext';
    await updateDoc(projectRef, {
      [`files.${filePath}`]: { language, content: '' },
      lastModified: new Date(),
    });
  };

  // ✅ Create a new folder with a placeholder
  const createFolderInProject = async (projectId, folderPath) => {
    if (!projectId || !folderPath) return;
    const placeholderPath = `${folderPath}/.placeholder`;
    await createFileInProject(projectId, placeholderPath);
  };

  // ✅ Delete a file or folder
  const deleteNodeInProject = async (projectId, path, isFolder) => {
    if (!projectId || !path) return;
    const projectRef = doc(db, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);
    if (!projectSnap.exists()) return;

    const currentFiles = projectSnap.data().files;
    const updates = {};

    if (isFolder) {
      Object.keys(currentFiles).forEach(filePath => {
        if (!filePath.startsWith(path + '/')) {
          updates[filePath] = currentFiles[filePath];
        }
      });
    } else {
      Object.keys(currentFiles).forEach(filePath => {
        if (filePath !== path) {
          updates[filePath] = currentFiles[filePath];
        }
      });
    }

    await updateDoc(projectRef, { files: updates, lastModified: new Date() });
  };

  // ✅ Rename file/folder
  const renameNodeInProject = async (projectId, oldPath, newPath, isFolder) => {
    if (!projectId || !oldPath || !newPath || oldPath === newPath) return;
    const projectRef = doc(db, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);
    if (!projectSnap.exists()) return;

    const currentFiles = projectSnap.data().files;
    const batch = writeBatch(db);
    const updates = {};

    if (isFolder) {
      Object.keys(currentFiles).forEach(filePath => {
        if (filePath.startsWith(oldPath + '/')) {
          const newFilePath = filePath.replace(oldPath, newPath);
          updates[newFilePath] = currentFiles[filePath];
        } else if (filePath !== oldPath) {
          updates[filePath] = currentFiles[filePath];
        }
      });
    } else {
      Object.keys(currentFiles).forEach(filePath => {
        if (filePath === oldPath) {
          updates[newPath] = currentFiles[filePath];
        } else {
          updates[filePath] = currentFiles[filePath];
        }
      });
    }

    batch.update(projectRef, { files: updates, lastModified: new Date() });
    await batch.commit();
  };

  // ✅ --- NEW USER & INVITATION FUNCTIONS ---

  /**
   * Creates or retrieves a user's unique V-CodeX ID.
   * Example: 'vignancoder123@gmail.com' becomes 'vignancoder123.vcodex'.
   * This is stored in the user's document in the 'users' collection.
   */
  const manageVCodeXId = async (user) => {
    if (!user) return null;
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists() && userSnap.data().vcodexId) {
      return userSnap.data().vcodexId; // Return existing ID
    } else {
      // Create the ID from the email
      const emailPrefix = user.email.split('@')[0];
      const vcodexId = `${emailPrefix}.vcodex`;
      
      // Save it to their user document
      await setDoc(userRef, { vcodexId: vcodexId }, { merge: true });
      return vcodexId;
    }
  };

  /**
   * Finds a user's document by their V-CodeX ID.
   * This is used to get a user's UID when sending an invitation.
   */
  const getUserByVCodeXId = async (vcodexId) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('vcodexId', '==', vcodexId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null; // No user found with that ID
    }
    // Return the first user found (IDs are unique)
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
  };

  /**
   * Creates an invitation document in a new 'invitations' collection.
   */
  const sendCollaborationInvite = async (projectId, fromUser, toUser) => {
    if (!projectId || !fromUser || !toUser) return;

    const invitationsRef = collection(db, 'invitations');
    await addDoc(invitationsRef, {
      projectId: projectId,
      from: {
        uid: fromUser.uid,
        displayName: fromUser.displayName,
        vcodexId: fromUser.vcodexId
      },
      to: {
        uid: toUser.id, // The UID of the user being invited
        vcodexId: toUser.vcodexId
      },
      status: 'pending', // 'pending', 'accepted', 'declined'
      createdAt: serverTimestamp(),
    });
  };

  return {
    loading,
    manageUserDocument,
    fetchProjects,
    fetchProjectData,
    createNewProject,
    updateFileContent,
    deleteProject,
    createFileInProject,
    createFolderInProject,
    deleteNodeInProject,
    renameNodeInProject,
    // ✅ Export the new functions
    manageVCodeXId,
    getUserByVCodeXId,
    sendCollaborationInvite,
  };
};