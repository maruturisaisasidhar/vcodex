// src/components/exam/faculty/ExamEditor.jsx

import React, { useState, useEffect } from 'react';
import { getAllQuestions } from '../../../api/examService';

const ExamEditor = ({ onSubmit, initialData = {} }) => {
    const [title, setTitle] = useState(initialData.title || '');
    const [collegeName, setCollegeName] = useState(initialData.collegeName || '');
    const [durationInMinutes, setDurationInMinutes] = useState(initialData.durationInMinutes || 90);
    
    const [allQuestions, setAllQuestions] = useState([]);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState(initialData.questionIds || []);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch all available questions when the component mounts
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const questions = await getAllQuestions();
                setAllQuestions(questions);
            } catch (error) {
                console.error("Failed to fetch questions:", error);
                alert("Could not load questions for selection.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleQuestionSelect = (questionId) => {
        setSelectedQuestionIds(prevSelected =>
            prevSelected.includes(questionId)
                ? prevSelected.filter(id => id !== questionId)
                : [...prevSelected, questionId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedQuestionIds.length === 0) {
            alert("Please select at least one question for the exam.");
            return;
        }
        setIsSubmitting(true);
        const examData = {
            title,
            collegeName,
            durationInMinutes,
            questionIds: selectedQuestionIds,
        };
        await onSubmit(examData);
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Create New Exam</h2>
            <div>
                <label className="block text-sm font-medium text-gray-300">Exam Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-300">College Name</label>
                <input type="text" value={collegeName} onChange={e => setCollegeName(e.target.value)} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-300">Duration (in minutes)</label>
                <input type="number" value={durationInMinutes} onChange={e => setDurationInMinutes(Number(e.target.value))} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white"/>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300">Select Questions</label>
                {isLoading ? (
                    <p className="text-gray-400">Loading questions...</p>
                ) : (
                    <div className="mt-2 p-4 border border-gray-700 rounded-md max-h-72 overflow-y-auto space-y-2">
                        {allQuestions.length > 0 ? allQuestions.map(q => (
                            <div key={q.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`q-${q.id}`}
                                    checked={selectedQuestionIds.includes(q.id)}
                                    onChange={() => handleQuestionSelect(q.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-gray-700"
                                />
                                <label htmlFor={`q-${q.id}`} className="ml-3 text-sm text-white">
                                    {q.title} <span className="text-xs text-gray-500">({q.type})</span>
                                </label>
                            </div>
                        )) : <p className="text-gray-500">No questions found. Please create some questions first.</p>}
                    </div>
                )}
            </div>

            <button type="submit" disabled={isSubmitting || isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500">
                {isSubmitting ? 'Creating Exam...' : 'Create Exam'}
            </button>
        </form>
    );
};

export default ExamEditor;