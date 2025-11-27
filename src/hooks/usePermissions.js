import { db } from '../firebase/config';
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

export const usePermissions = (projectId) => {
  /**
   * Shares the current project with another user by their email address.
   * @param {string} email The email of the user to share with.
   */
  const shareProjectWithUser = async (email) => {
    if (!email || !projectId) return { success: false, message: 'Email or Project ID is missing.' };

    try {
      // 1. Find the user by their email to get their UID
      const usersRef = collection(db, 'users'); // Assuming you have a 'users' collection
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, message: 'User with that email not found.' };
      }

      const userToShareWith = querySnapshot.docs[0];
      const collaboratorId = userToShareWith.id;

      // 2. Add the user's UID to the project's 'collaborators' array
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        collaborators: arrayUnion(collaboratorId),
      });

      return { success: true, message: `Project shared with ${email}!` };
    } catch (error) {
      console.error("Error sharing project:", error);
      return { success: false, message: 'An error occurred while sharing.' };
    }
  };

  /**
   * Checks if a given user has permission to access the current project.
   * @param {string} userId The UID of the user to check.
   * @returns {Promise<boolean>} True if the user has access, false otherwise.
   */
  const checkPermission = async (userId) => {
    if (!userId || !projectId) return false;

    try {
      const projectRef = doc(db, 'projects', projectId);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) {
        console.error("Project not found!");
        return false;
      }

      const projectData = projectSnap.data();
      // Check if the user's ID is in the ownerId field or the collaborators array
      const hasAccess = projectData.ownerId === userId || projectData.collaborators?.includes(userId);
      
      return hasAccess;
    } catch (error) {
      console.error("Error checking permissions:", error);
      return false;
    }
  };

  return { shareProjectWithUser, checkPermission };
};