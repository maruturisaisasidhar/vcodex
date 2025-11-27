// src/components/exam/student/ExamDetailsForm.jsx

import React, { useState } from 'react';

const ExamDetailsForm = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [regdNo, setRegdNo] = useState('');
    const [branch, setBranch] = useState('');
    const [section, setSection] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !regdNo || !branch || !section) {
            alert('Please fill in all details.');
            return;
        }
        onSubmit({
            student_name: name,
            regd_no: regdNo,
            branch: branch,
            section: section,
        });
    };

    return (
        <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Enter Your Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="regdNo" className="block text-sm font-medium text-gray-300">Registration No.</label>
                    <input
                        type="text"
                        id="regdNo"
                        value={regdNo}
                        onChange={(e) => setRegdNo(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-gray-300">Branch</label>
                    <input
                        type="text"
                        id="branch"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="section" className="block text-sm font-medium text-gray-300">Section</label>
                    <input
                        type="text"
                        id="section"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Begin Test
                </button>
            </form>
        </div>
    );
};

export default ExamDetailsForm;