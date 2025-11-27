// src/components/exam/faculty/RosterManager.jsx

import React, { useState, useEffect } from 'react';

const RosterManager = ({ exam, onSave }) => {
    // Initialize the roster state with the students from the selected exam
    const [roster, setRoster] = useState([]);
    const [newStudentId, setNewStudentId] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Update the local roster state whenever the selected exam changes
    useEffect(() => {
        setRoster(exam?.registeredStudents || []);
    }, [exam]);

    const handleAddStudent = () => {
        if (newStudentId && !roster.includes(newStudentId.trim())) {
            setRoster([...roster, newStudentId.trim()]);
            setNewStudentId(''); // Clear the input field
        } else {
            alert("Student ID is either empty or already in the roster.");
        }
    };

    const handleRemoveStudent = (studentIdToRemove) => {
        setRoster(roster.filter(id => id !== studentIdToRemove));
    };

    const handleSaveRoster = async () => {
        setIsSaving(true);
        await onSave(exam.id, roster);
        setIsSaving(false);
    };

    if (!exam) {
        return <div className="bg-gray-800 p-8 rounded-lg text-center text-gray-400">Select an exam to manage its roster.</div>;
    }

    return (
        <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Manage Roster for "{exam.title}"</h2>
            
            {/* Input to add a new student */}
            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    placeholder="Enter student's V-CodeX ID"
                    className="flex-grow bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="button"
                    onClick={handleAddStudent}
                    className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg"
                >
                    Add
                </button>
            </div>

            {/* List of current students in the roster */}
            <div className="space-y-2 mb-6 max-h-72 overflow-y-auto p-4 border border-gray-700 rounded-md">
                {roster.length > 0 ? (
                    roster.map(studentId => (
                        <div key={studentId} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                            <span className="font-mono text-sm text-white">{studentId}</span>
                            <button
                                onClick={() => handleRemoveStudent(studentId)}
                                className="text-red-400 hover:text-red-300 font-bold text-lg"
                            >
                                &times;
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No students have been added to this roster yet.</p>
                )}
            </div>

            <button
                onClick={handleSaveRoster}
                disabled={isSaving}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500"
            >
                {isSaving ? 'Saving...' : 'Save Roster'}
            </button>
        </div>
    );
};

export default RosterManager;