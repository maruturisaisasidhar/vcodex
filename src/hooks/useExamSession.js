// src/hooks/useExamSession.js

import { useState, useCallback } from 'react';
import { updateSubmission } from '../api/examService';

/**
 * Manages the state and logic for an active student exam session.
 * @param {object} examData - The full exam object, including the questions array.
 * @param {string} submissionId - The ID of the student's submission document in Firestore.
 */
export const useExamSession = (examData, submissionId) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    const questions = examData?.questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    /**
     * Saves an answer and persists it to Firestore.
     * We use useCallback to prevent this function from being recreated on every render.
     */
    const saveAnswer = useCallback(async (questionId, answer) => {
        const newAnswers = { ...answers, [questionId]: answer };
        setAnswers(newAnswers);

        try {
            // Persist the updated answers array to Firestore to prevent data loss.
            await updateSubmission(submissionId, { 
                answers: Object.entries(newAnswers).map(([qId, ans]) => ({
                    questionId: qId,
                    answer: ans, // Could be a string for MCQ or code for coding questions
                }))
            });
        } catch (error) {
            console.error("Failed to save progress:", error);
            // Optionally, show an error to the user.
        }
    }, [answers, submissionId]);

    const goToNextQuestion = () => {
        if (!isLastQuestion) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    /**
     * Finalizes the exam, calculates the score for MCQs, and marks it as completed.
     */
    const submitExam = async () => {
        // Simple scoring logic for MCQs. Coding questions would be scored by the backend.
        let totalScore = 0;
        questions.forEach(q => {
            if (q.type === 'MCQ' && answers[q.id] === q.correctAnswer) {
                totalScore += q.marks || 0;
            }
        });
        
        try {
            await updateSubmission(submissionId, {
                status: 'completed',
                totalScore: totalScore,
                submittedAt: new Date(),
            });
            console.log("Exam submitted successfully!");
        } catch (error) {
            console.error("Failed to submit exam:", error);
        }
    };
    
    return {
        currentQuestion,
        currentQuestionIndex,
        totalQuestions: questions.length,
        isLastQuestion,
        answers,
        saveAnswer,
        goToNextQuestion,
        submitExam,
    };
};