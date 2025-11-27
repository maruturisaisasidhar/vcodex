// src/components/exam/student/ExamListItem.jsx

import React from 'react';

const ExamListItem = ({ exam, onStart }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex justify-between items-center">
            <div>
                <h3 className="text-xl font-bold text-white">{exam.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{exam.collegeName}</p>
                <p className="text-sm text-gray-500 mt-2">Duration: {exam.durationInMinutes} minutes</p>
            </div>
            <button
                onClick={() => onStart(exam.id)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
                Start Exam
            </button>
        </div>
    );
};

export default ExamListItem;