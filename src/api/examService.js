// // src/api/examService.js

// import { db } from '../firebase/config';
// import { 
//     collection, 
//     doc, 
//     getDoc, 
//     getDocs, 
//     addDoc, 
//     updateDoc, 
//     query, 
//     where, // Make sure 'where' is imported
//     serverTimestamp 
// } from 'firebase/firestore';

// // --- Faculty Functions ---

// export const createQuestion = async (questionData) => {
//     const questionsCollection = collection(db, 'questions');
//     const docRef = await addDoc(questionsCollection, {
//         ...questionData,
//         createdAt: serverTimestamp(),
//     });
//     return docRef.id;
// };

// export const getAllQuestions = async () => {
//     const questionsCollection = collection(db, 'questions');
//     const snapshot = await getDocs(questionsCollection);
//     return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };

// export const createExam = async (examData) => {
//     const examsCollection = collection(db, 'exams');
//     const docRef = await addDoc(examsCollection, {
//         ...examData,
//         createdAt: serverTimestamp(),
//     });
//     return docRef.id;
// };

// /**
//  * Fetches all exams created by a specific faculty member.
//  * @param {string} facultyId - The UID of the faculty member.
//  * @returns {Promise<Array>} A list of exams.
//  */
// export const getExamsByFaculty = async (facultyId) => {
//     const examsCollection = collection(db, 'exams');
//     // Uses the 'where' clause to filter by the 'createdBy' field
//     const q = query(examsCollection, where("createdBy", "==", facultyId));
//     const snapshot = await getDocs(q);
//     return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };

// // --- Student Functions ---

// /**
//  * Fetches all exams a student is registered for.
//  * @param {string} studentId - The UID of the current student.
//  * @returns {Promise<Array>} A list of eligible exams.
//  */
// export const getEligibleExams = async (studentId) => {
//     const examsCollection = collection(db, 'exams');
//     // CORRECTED SYNTAX for the array-contains query
//     const q = query(examsCollection, where("registeredStudents", "array-contains", studentId));
//     const snapshot = await getDocs(q);
//     return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };

// /**
//  * Fetches all of a student's past submissions.
//  * @param {string} studentId - The UID of the student.
//  * @returns {Promise<Array>} A list of their submission documents.
//  */
// export const getStudentSubmissions = async (studentId) => {
//     const submissionsCollection = collection(db, 'submissions');
//     const q = query(submissionsCollection, where("studentId", "==", studentId));
//     const snapshot = await getDocs(q);
//     return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };

// export const getExamDetails = async (examId) => {
//     const examRef = doc(db, 'exams', examId);
//     const examSnap = await getDoc(examRef);

//     if (!examSnap.exists()) {
//         console.error("No such exam found!");
//         return null;
//     }

//     const examData = examSnap.data();
//     const questions = [];

//     if (examData.questionIds && examData.questionIds.length > 0) {
//         for (const questionId of examData.questionIds) {
//             const questionRef = doc(db, 'questions', questionId);
//             const questionSnap = await getDoc(questionRef);
//             if (questionSnap.exists()) {
//                 questions.push({ id: questionSnap.id, ...questionSnap.data() });
//             }
//         }
//     }
    
//     return { id: examSnap.id, ...examData, questions };
// };

// export const startSubmission = async (submissionData) => {
//     const submissionsCollection = collection(db, 'submissions');
//     const docRef = await addDoc(submissionsCollection, {
//         ...submissionData,
//         status: 'started',
//         startTime: serverTimestamp(),
//         answers: [],
//     });
//     return docRef.id;
// };

// export const updateSubmission = async (submissionId, dataToUpdate) => {
//     const submissionRef = doc(db, 'submissions', submissionId);
//     await updateDoc(submissionRef, {
//         ...dataToUpdate,
//         lastUpdated: serverTimestamp(),
//     });
// };










// src/api/examService.js

import { db } from '../firebase/config';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';

// --- Faculty Functions --- (No changes needed here)

export const createQuestion = async (questionData) => {
    const questionsCollection = collection(db, 'questions');
    const docRef = await addDoc(questionsCollection, {
        ...questionData,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};

export const getAllQuestions = async () => {
    const questionsCollection = collection(db, 'questions');
    const snapshot = await getDocs(questionsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createExam = async (examData) => {
    const examsCollection = collection(db, 'exams');
    const docRef = await addDoc(examsCollection, {
        ...examData,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};

export const getExamsByFaculty = async (facultyId) => {
    const examsCollection = collection(db, 'exams');
    const q = query(examsCollection, where("createdBy", "==", facultyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- Student Functions ---

/**
 * ✅ UPDATED: Fetches all exams a student is registered for using their V-CodeX ID.
 * @param {string} studentUid - The internal Firebase UID of the current student.
 * @returns {Promise<Array>} A list of eligible exams.
 */
export const getEligibleExams = async (studentUid) => {
    // Step 1: Get the current user's profile document to find their vcodexId.
    const userRef = doc(db, 'users', studentUid);
    const userSnap = await getDoc(userRef);

    // If the user profile doesn't exist or doesn't have a vcodexId, they can't be registered for any exams.
    if (!userSnap.exists() || !userSnap.data().vcodexId) {
        console.error("User profile or V-CodeX ID not found for UID:", studentUid);
        return []; // Return an empty array to prevent errors.
    }

    const vcodexId = userSnap.data().vcodexId;

    // Step 2: Use the user-friendly vcodexId to query the 'exams' collection.
    const examsCollection = collection(db, 'exams');
    const q = query(examsCollection, where("registeredStudents", "array-contains", vcodexId));

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- Other functions (No changes needed here) ---

export const getStudentSubmissions = async (studentId) => {
    const submissionsCollection = collection(db, 'submissions');
    const q = query(submissionsCollection, where("studentId", "==", studentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getExamDetails = async (examId) => {
    const examRef = doc(db, 'exams', examId);
    const examSnap = await getDoc(examRef);

    if (!examSnap.exists()) {
        console.error("No such exam found!");
        return null;
    }

    const examData = examSnap.data();
    const questions = [];

    if (examData.questionIds && examData.questionIds.length > 0) {
        for (const questionId of examData.questionIds) {
            const questionRef = doc(db, 'questions', questionId);
            const questionSnap = await getDoc(questionRef);
            if (questionSnap.exists()) {
                questions.push({ id: questionSnap.id, ...questionSnap.data() });
            }
        }
    }

    return { id: examSnap.id, ...examData, questions };
};

export const startSubmission = async (submissionData) => {
    const submissionsCollection = collection(db, 'submissions');
    const docRef = await addDoc(submissionsCollection, {
        ...submissionData,
        status: 'started',
        startTime: serverTimestamp(),
        answers: [],
    });
    return docRef.id;
};

export const updateSubmission = async (submissionId, dataToUpdate) => {
    const submissionRef = doc(db, 'submissions', submissionId);
    await updateDoc(submissionRef, {
        ...dataToUpdate,
        lastUpdated: serverTimestamp(),
    });
};