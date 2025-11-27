// // src/api/userService.js

// import { db } from '../firebase/config';
// import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

// /**
//  * Checks if a faculty ID exists in the 'faculty' collection.
//  * @param {string} facultyId The ID to verify.
//  * @returns {Promise<object|null>} The faculty member's data if found, otherwise null.
//  */
// export const verifyFacultyId = async (facultyId) => {
//     const facultyRef = doc(db, 'faculty', facultyId);
//     const docSnap = await getDoc(facultyRef);

//     if (docSnap.exists()) {
//         return { id: docSnap.id, ...docSnap.data() };
//     } else {
//         return null;
//     }
// };

// /**
//  * Fetches a user's profile document from the 'users' collection.
//  * This is used to get custom data like the user's role.
//  * @param {string} uid The user's Firebase Auth UID.
//  * @returns {Promise<object|null>} The user's data if found, otherwise null.
//  */
// export const getUserData = async (uid) => {
//     const userRef = doc(db, 'users', uid);
//     const docSnap = await getDoc(userRef);

//     if (docSnap.exists()) {
//         return { id: docSnap.id, ...docSnap.data() };
//     } else {
//         return null;
//     }
// };

// /**
//  * ✨ NEW FUNCTION: Creates the initial document for a new user in the 'users' collection.
//  * @param {string} uid The new user's UID from Firebase Auth.
//  * @param {object} userData The basic user data (e.g., name, email).
//  */
// export const createUserDocument = async (uid, userData) => {
//     const userRef = doc(db, 'users', uid);
//     await setDoc(userRef, {
//         uid: uid,
//         email: userData.email,
//         name: userData.name,
//         role: 'student', // All new users default to 'student'. Will be promoted if faculty.
//         createdAt: new Date(),
//     });
// };

// /**
//  * Links a pre-approved faculty profile to a new V-CodeX auth account.
//  * @param {string} facultyId The faculty member's pre-assigned ID (e.g., "FACULTY-001").
//  * @param {string} uid The new UID from Firebase Authentication.
//  */
// export const linkFacultyAccount = async (facultyId, uid) => {
//     // Step 1: Update the 'faculty' document to include the new vcodex_uid
//     const facultyRef = doc(db, 'faculty', facultyId);
//     await updateDoc(facultyRef, { vcodex_uid: uid });

//     // Step 2: Update the user's document to promote their role to 'faculty'
//     const userRef = doc(db, 'users', uid);
//     await updateDoc(userRef, {
//         role: 'faculty',
//     });
// };




// src/api/userService.js
// src/api/userService.js

import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

/**
 * ✅ FINAL: Checks if a faculty ID exists in the 'faculty' collection.
 */
export const verifyFacultyId = async (facultyId) => {
    const facultyRef = doc(db, 'faculty', facultyId);
    const docSnap = await getDoc(facultyRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        return null;
    }
};

/**
 * ✅ FINAL: Fetches a user's profile document from the 'users' collection.
 */
export const getUserData = async (uid) => {
    const userRef = doc(db, 'users', uid);
    // ✅ FIX: Changed 'docRef' to the correct variable name 'userRef'
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        return null;
    }
};

/**
 * ✅ FINAL & FLEXIBLE: Creates the initial document for any new user.
 */
export const createUserDocument = async (uid, userData, role = 'student') => {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
        uid: uid,
        email: userData.email,
        name: userData.name,
        role: role,
        createdAt: new Date(),
    });
};

/**
 * ✅ FINAL & SIMPLIFIED: Links a pre-approved faculty profile to their auth account.
 */
export const linkFacultyAccount = async (facultyId, uid) => {
    const facultyRef = doc(db, 'faculty', facultyId);
    await updateDoc(facultyRef, { vcodex_uid: uid });
};