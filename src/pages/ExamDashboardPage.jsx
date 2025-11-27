// // src/pages/ExamDashboardPage.jsx

// import React, { useState, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
// import { useAuth } from '../context/useAuth';

// // ✨ UPDATED: Import the new getStudentSubmissions function
// import { getEligibleExams, startSubmission, getStudentSubmissions } from '../api/examService';
// import ExamListItem from '../components/exam/student/ExamListItem';
// import ExamDetailsForm from '../components/exam/student/ExamDetailsForm';
// import Modal from '../components/ui/Modal';

// const ExamDashboardPage = () => {
//     const { currentUser } = useAuth();
//     const history = useHistory();

//     const [exams, setExams] = useState([]);
//     const [pastSubmissions, setPastSubmissions] = useState([]); // ✨ NEW state for results
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isFormVisible, setIsFormVisible] = useState(false);
//     const [selectedExamId, setSelectedExamId] = useState(null);

//     useEffect(() => {
//         if (currentUser) {
//             const fetchAllData = async () => {
//                 try {
//                     // Fetch both eligible exams and past submissions at the same time
//                     const [eligibleExams, submissions] = await Promise.all([
//                         getEligibleExams(currentUser.uid),
//                         getStudentSubmissions(currentUser.uid)
//                     ]);
//                     setExams(eligibleExams);
//                     setPastSubmissions(submissions);
//                 } catch (err) {
//                     setError("Failed to load your data. Please try again later.");
//                     console.error(err);
//                 } finally {
//                     setIsLoading(false);
//                 }
//             };
//             fetchAllData();
//         }
//     }, [currentUser]);

//     const handleStartExam = (examId) => {
//         // ✨ NEW logic: Prevent re-taking a completed exam
//         const hasTaken = pastSubmissions.some(sub => sub.examId === examId);
//         if (hasTaken) {
//             alert("You have already completed this exam.");
//             return;
//         }
//         setSelectedExamId(examId);
//         setIsFormVisible(true);
//     };

//     const handleFormSubmit = async (studentDetails) => {
//         if (!currentUser || !selectedExamId) return;
        
//         // ✨ For better results display, we add the examTitle to the submission doc
//         const selectedExam = exams.find(e => e.id === selectedExamId);

//         try {
//             const submissionData = {
//                 examId: selectedExamId,
//                 examTitle: selectedExam.title, // Add exam title for easy display later
//                 studentId: currentUser.uid,
//                 ...studentDetails,
//             };
//             const newSubmissionId = await startSubmission(submissionData);
//             history.push(`/exam/${selectedExamId}/${newSubmissionId}`);
//         } catch (err) {
//             console.error("Failed to start exam session:", err);
//             alert("Could not start the exam. Please try again.");
//             setIsFormVisible(false);
//         }
//     };

//     if (isLoading) {
//         return <div className="min-h-screen bg-gray-900 text-white p-8 text-center">Loading...</div>;
//     }

//     if (error) {
//         return <div className="min-h-screen bg-gray-900 p-8 text-center text-red-400">{error}</div>;
//     }

//     return (
//         <div className="min-h-screen bg-gray-900 text-white p-8">
//             {/* ✅ FIXED: Added the Modal component back into the JSX */}
//             <Modal isOpen={isFormVisible} onClose={() => setIsFormVisible(false)} title="Confirm Your Details">
//                 <ExamDetailsForm onSubmit={handleFormSubmit} />
//             </Modal>

//             <header className="mb-8">
//                 <h1 className="text-3xl font-bold">Exam Dashboard</h1>
//             </header>

//             {/* Section for Available Exams */}
//             <section className="mb-12">
//                 <h2 className="text-2xl font-semibold border-b-2 border-gray-700 pb-2 mb-6">Available Exams</h2>
//                 <div className="space-y-6">
//                     {exams.length > 0 ? (
//                         exams.map(exam => (
//                             <ExamListItem key={exam.id} exam={exam} onStart={handleStartExam} />
//                         ))
//                     ) : (
//                         <div className="text-center py-10 bg-gray-800 rounded-lg">
//                             <p className="text-gray-400">You are not registered for any upcoming exams.</p>
//                         </div>
//                     )}
//                 </div>
//             </section>
            
//             {/* ✨ NEW Section for Past Results */}
//             <section>
//                 <h2 className="text-2xl font-semibold border-b-2 border-gray-700 pb-2 mb-6">My Past Results</h2>
//                 <div className="space-y-4">
//                     {pastSubmissions.length > 0 ? (
//                         pastSubmissions.map(sub => (
//                             <div key={sub.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
//                                 <div>
//                                     <h3 className="font-bold text-lg">{sub.examTitle}</h3>
//                                     <p className="text-sm text-gray-500">
//                                         Submitted on: {sub.submittedAt ? new Date(sub.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
//                                     </p>
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="text-sm text-gray-400">Score</p>
//                                     <p className="font-bold text-xl text-green-400">{sub.totalScore || 0}</p>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                          <div className="text-center py-10 bg-gray-800 rounded-lg">
//                             <p className="text-gray-400">You have not completed any exams yet.</p>
//                         </div>
//                     )}
//                 </div>
//             </section>
//         </div>
//     );
// };

// export default ExamDashboardPage;


// src/pages/ExamDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

import { getEligibleExams, startSubmission, getStudentSubmissions } from '../api/examService';
import ExamListItem from '../components/exam/student/ExamListItem';
import ExamDetailsForm from '../components/exam/student/ExamDetailsForm';
import Modal from '../components/ui/Modal';

const ExamDashboardPage = () => {
    const { currentUser } = useAuth();
    const history = useHistory();

    const [exams, setExams] = useState([]);
    const [pastSubmissions, setPastSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedExamId, setSelectedExamId] = useState(null);

    useEffect(() => {
        if (currentUser) {
            const fetchAllData = async () => {
                try {
                    const [eligibleExams, submissions] = await Promise.all([
                        getEligibleExams(currentUser.uid),
                        getStudentSubmissions(currentUser.uid)
                    ]);
                    setExams(eligibleExams);
                    setPastSubmissions(submissions);
                } catch (err) {
                    setError("Failed to load your data. Please try again later.");
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchAllData();
        }
    }, [currentUser]);

    const handleStartExam = (examId) => {
        const hasTaken = pastSubmissions.some(sub => sub.examId === examId);
        if (hasTaken) {
            alert("You have already completed this exam.");
            return;
        }
        setSelectedExamId(examId);
        setIsFormVisible(true);
    };

    const handleFormSubmit = async (studentDetails) => {
        if (!currentUser || !selectedExamId) return;
        
        const selectedExam = exams.find(e => e.id === selectedExamId);

        try {
            const submissionData = {
                examId: selectedExamId,
                examTitle: selectedExam.title,
                studentId: currentUser.uid,
                ...studentDetails,
            };
            const newSubmissionId = await startSubmission(submissionData);
            history.push(`/exam/${selectedExamId}/${newSubmissionId}`);
        } catch (err) {
            console.error("Failed to start exam session:", err);
            alert("Could not start the exam. Please try again.");
            setIsFormVisible(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen bg-gray-900 text-white p-8 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-gray-900 p-8 text-center text-red-400">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <Modal isOpen={isFormVisible} onClose={() => setIsFormVisible(false)} title="Confirm Your Details">
                <ExamDetailsForm onSubmit={handleFormSubmit} />
            </Modal>

            <header className="mb-8">
                <h1 className="text-3xl font-bold">Exam Dashboard</h1>
            </header>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold border-b-2 border-gray-700 pb-2 mb-6">Available Exams</h2>
                <div className="space-y-6">
                    {exams.length > 0 ? (
                        exams.map(exam => (
                            <ExamListItem key={exam.id} exam={exam} onStart={handleStartExam} />
                        ))
                    ) : (
                        <div className="text-center py-10 bg-gray-800 rounded-lg">
                            <p className="text-gray-400">You are not registered for any upcoming exams.</p>
                        </div>
                    )}
                </div>
            </section>
            
            <section>
                <h2 className="text-2xl font-semibold border-b-2 border-gray-700 pb-2 mb-6">My Past Results</h2>
                <div className="space-y-4">
                    {pastSubmissions.length > 0 ? (
                        pastSubmissions.map(sub => (
                            <div key={sub.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">{sub.examTitle}</h3>
                                    <p className="text-sm text-gray-500">
                                        {sub.submittedAt ? `Submitted on: ${new Date(sub.submittedAt.seconds * 1000).toLocaleDateString()}` : 'In Progress'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400">Score</p>
                                    <p className="font-bold text-xl text-green-400">{sub.totalScore || 0}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                         <div className="text-center py-10 bg-gray-800 rounded-lg">
                            <p className="text-gray-400">You have not completed any exams yet.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

// Make sure this line exists and is correct
export default ExamDashboardPage;