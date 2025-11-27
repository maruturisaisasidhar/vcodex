// // src/pages/FacultyDashboardPage.jsx

// import React, { useState, useEffect, useCallback } from 'react';
// import { useAuth } from '../context/useAuth';

// // Import API functions
// // ✨ FIX: 'query' and 'where' were missing from this import.
// import { 
//     createQuestion, 
//     createExam, 
//     getExamsByFaculty, 
//     updateDoc, 
//     doc, 
//     collection, 
//     getDocs, 
//     query, 
//     where 
// } from '../api/examService';
// import { db } from '../firebase/config'; // Direct import for update

// // Import Faculty Components
// import QuestionForm from '../components/exam/faculty/QuestionForm';
// import ExamEditor from '../components/exam/faculty/ExamEditor';
// import RosterManager from '../components/exam/faculty/RosterManager';
// import ResultsTable from '../components/exam/faculty/ResultsTable';

// const FacultyDashboardPage = () => {
//     const { currentUser } = useAuth();
//     const [view, setView] = useState('dashboard'); // 'dashboard', 'create_question', 'create_exam', 'manage_roster', 'view_results'
//     const [exams, setExams] = useState([]);
//     const [submissions, setSubmissions] = useState([]);
//     const [selectedExam, setSelectedExam] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     const fetchData = useCallback(async () => {
//         if (!currentUser) return;
//         setIsLoading(true);
//         try {
//             const facultyExams = await getExamsByFaculty(currentUser.uid);
//             setExams(facultyExams);
//         } catch (error) {
//             console.error("Failed to fetch data:", error);
//             alert("Error fetching your data.");
//         } finally {
//             setIsLoading(false);
//         }
//     }, [currentUser]);

//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     const handleCreateQuestionSubmit = async (questionData) => {
//         try {
//             await createQuestion({ ...questionData, createdBy: currentUser.uid });
//             alert("Question created successfully!");
//             setView('dashboard'); // Go back to dashboard after creation
//         } catch (error) {
//             console.error("Failed to create question:", error);
//             alert("Error creating question.");
//         }
//     };
    
//     const handleCreateExamSubmit = async (examData) => {
//         try {
//             await createExam({ ...examData, createdBy: currentUser.uid });
//             alert("Exam created successfully!");
//             fetchData(); // Refresh exam list
//             setView('dashboard');
//         } catch (error) {
//             console.error("Failed to create exam:", error);
//             alert("Error creating exam.");
//         }
//     };

//     const handleSaveRoster = async (examId, roster) => {
//         try {
//             const examRef = doc(db, 'exams', examId);
//             await updateDoc(examRef, { registeredStudents: roster });
//             alert("Roster updated successfully!");
//             fetchData(); // Refresh data
//             setView('dashboard');
//         } catch (error) {
//             console.error("Failed to save roster:", error);
//             alert("Error saving roster.");
//         }
//     };
    
//     const handleViewResults = async (exam) => {
//         try {
//             setIsLoading(true);
//             const q = query(collection(db, 'submissions'), where("examId", "==", exam.id));
//             const querySnapshot = await getDocs(q);
//             const subs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setSubmissions(subs);
//             setSelectedExam(exam);
//             setView('view_results');
//         } catch (error) {
//             console.error("Failed to fetch submissions:", error);
//             alert("Error fetching results.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const renderContent = () => {
//         switch (view) {
//             case 'create_question':
//                 return <QuestionForm onSubmit={handleCreateQuestionSubmit} />;
//             case 'create_exam':
//                 return <ExamEditor onSubmit={handleCreateExamSubmit} />;
//             case 'manage_roster':
//                 return <RosterManager exam={selectedExam} onSave={handleSaveRoster} />;
//             case 'view_results':
//                 return <ResultsTable submissions={submissions} examTitle={selectedExam?.title} />;
//             default:
//                 return (
//                     <div className="space-y-4">
//                         {exams.length > 0 ? exams.map(exam => (
//                             <div key={exam.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
//                                 <div>
//                                     <h3 className="font-bold">{exam.title}</h3>
//                                     <p className="text-sm text-gray-400">{exam.questionIds?.length || 0} questions</p>
//                                 </div>
//                                 <div className="flex gap-2">
//                                     <button onClick={() => { setSelectedExam(exam); setView('manage_roster'); }} className="bg-gray-600 hover:bg-gray-500 text-sm font-semibold py-1 px-3 rounded">Manage Roster</button>
//                                     <button onClick={() => handleViewResults(exam)} className="bg-blue-600 hover:bg-blue-500 text-sm font-semibold py-1 px-3 rounded">View Results</button>
//                                 </div>
//                             </div>
//                         )) : <p className="text-gray-400 text-center">You haven't created any exams yet.</p>}
//                     </div>
//                 );
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-900 text-white p-8">
//             <header className="flex items-center justify-between mb-8">
//                 <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
//                 {view !== 'dashboard' && (
//                     <button onClick={() => setView('dashboard')} className="text-blue-400 hover:underline">
//                         &larr; Back to Dashboard
//                     </button>
//                 )}
//             </header>
            
//             {view === 'dashboard' && (
//                 <div className="flex gap-4 mb-8">
//                     <button onClick={() => setView('create_question')} className="bg-green-600 hover:bg-green-500 font-bold py-2 px-4 rounded-lg">Create New Question</button>
//                     <button onClick={() => setView('create_exam')} className="bg-blue-600 hover:bg-blue-500 font-bold py-2 px-4 rounded-lg">Create New Exam</button>
//                 </div>
//             )}
            
//             {isLoading ? <p>Loading...</p> : renderContent()}
//         </div>
//     );
// };

// export default FacultyDashboardPage;




// src/pages/FacultyDashboardPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/useAuth';

// ✅ FIX: The imports have been separated into two lines.
import { createQuestion, createExam, getExamsByFaculty } from '../api/examService';
import { doc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore'; // Imported from Firebase
import { db } from '../firebase/config';

// Import Faculty Components
import QuestionForm from '../components/exam/faculty/QuestionForm';
import ExamEditor from '../components/exam/faculty/ExamEditor';
import RosterManager from '../components/exam/faculty/RosterManager';
import ResultsTable from '../components/exam/faculty/ResultsTable';

const FacultyDashboardPage = () => {
    const { currentUser } = useAuth();
    const [view, setView] = useState('dashboard'); // 'dashboard', 'create_question', 'create_exam', 'manage_roster', 'view_results'
    const [exams, setExams] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!currentUser) return;
        setIsLoading(true);
        try {
            const facultyExams = await getExamsByFaculty(currentUser.uid);
            setExams(facultyExams);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            alert("Error fetching your data.");
        } finally {
            setIsLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreateQuestionSubmit = async (questionData) => {
        try {
            await createQuestion({ ...questionData, createdBy: currentUser.uid });
            alert("Question created successfully!");
            setView('dashboard');
        } catch (error) {
            console.error("Failed to create question:", error);
            alert("Error creating question.");
        }
    };
    
    const handleCreateExamSubmit = async (examData) => {
        try {
            await createExam({ ...examData, createdBy: currentUser.uid });
            alert("Exam created successfully!");
            fetchData();
            setView('dashboard');
        } catch (error) {
            console.error("Failed to create exam:", error);
            alert("Error creating exam.");
        }
    };

    const handleSaveRoster = async (examId, roster) => {
        try {
            const examRef = doc(db, 'exams', examId);
            await updateDoc(examRef, { registeredStudents: roster });
            alert("Roster updated successfully!");
            fetchData();
            setView('dashboard');
        } catch (error) {
            console.error("Failed to save roster:", error);
            alert("Error saving roster.");
        }
    };
    
    const handleViewResults = async (exam) => {
        try {
            setIsLoading(true);
            const q = query(collection(db, 'submissions'), where("examId", "==", exam.id));
            const querySnapshot = await getDocs(q);
            const subs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSubmissions(subs);
            setSelectedExam(exam);
            setView('view_results');
        } catch (error) {
            console.error("Failed to fetch submissions:", error);
            alert("Error fetching results.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        switch (view) {
            case 'create_question':
                return <QuestionForm onSubmit={handleCreateQuestionSubmit} />;
            case 'create_exam':
                return <ExamEditor onSubmit={handleCreateExamSubmit} />;
            case 'manage_roster':
                return <RosterManager exam={selectedExam} onSave={handleSaveRoster} />;
            case 'view_results':
                return <ResultsTable submissions={submissions} examTitle={selectedExam?.title} />;
            default:
                return (
                    <div className="space-y-4">
                        {exams.length > 0 ? exams.map(exam => (
                            <div key={exam.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">{exam.title}</h3>
                                    <p className="text-sm text-gray-400">{exam.questionIds?.length || 0} questions</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setSelectedExam(exam); setView('manage_roster'); }} className="bg-gray-600 hover:bg-gray-500 text-sm font-semibold py-1 px-3 rounded">Manage Roster</button>
                                    <button onClick={() => handleViewResults(exam)} className="bg-blue-600 hover:bg-blue-500 text-sm font-semibold py-1 px-3 rounded">View Results</button>
                                </div>
                            </div>
                        )) : <p className="text-gray-400 text-center">You haven't created any exams yet.</p>}
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
                {view !== 'dashboard' && (
                    <button onClick={() => setView('dashboard')} className="text-blue-400 hover:underline">
                        &larr; Back to Dashboard
                    </button>
                )}
            </header>
            
            {view === 'dashboard' && (
                <div className="flex gap-4 mb-8">
                    <button onClick={() => setView('create_question')} className="bg-green-600 hover:bg-green-500 font-bold py-2 px-4 rounded-lg">Create New Question</button>
                    <button onClick={() => setView('create_exam')} className="bg-blue-600 hover:bg-blue-500 font-bold py-2 px-4 rounded-lg">Create New Exam</button>
                </div>
            )}
            
            {isLoading ? <p>Loading...</p> : renderContent()}
        </div>
    );
};

export default FacultyDashboardPage;