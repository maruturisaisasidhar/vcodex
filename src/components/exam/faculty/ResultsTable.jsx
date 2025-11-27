// src/components/exam/faculty/ResultsTable.jsx

import React, { useState, useMemo } from 'react';
import { exportToExcel } from '../../../utils/fileExporter';

const ResultsTable = ({ submissions, examTitle }) => {
    const [filterBranch, setFilterBranch] = useState('all');
    const [filterSection, setFilterSection] = useState('all');

    // useMemo will cache these expensive calculations, preventing re-runs on every render.
    const uniqueBranches = useMemo(() => ['all', ...new Set(submissions.map(s => s.branch))], [submissions]);
    const uniqueSections = useMemo(() => ['all', ...new Set(submissions.map(s => s.section))], [submissions]);

    const filteredAndSortedSubmissions = useMemo(() => {
        return submissions
            .filter(s => filterBranch === 'all' || s.branch === filterBranch)
            .filter(s => filterSection === 'all' || s.section === filterSection)
            .sort((a, b) => a.regd_no.localeCompare(b.regd_no)); // Sort by registration number
    }, [submissions, filterBranch, filterSection]);

    const handleExport = () => {
        if (filteredAndSortedSubmissions.length === 0) {
            alert("There is no data to export.");
            return;
        }
        // Sanitize the title to be a valid filename
        const safeFileName = examTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        exportToExcel(filteredAndSortedSubmissions, `${safeFileName}_results`);
    };

    if (submissions.length === 0) {
        return <div className="bg-gray-800 p-8 rounded-lg text-center text-gray-400">No submissions found for this exam yet.</div>;
    }

    return (
        <div className="bg-gray-800 p-8 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Results for "{examTitle}"</h2>
                <button
                    onClick={handleExport}
                    className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg"
                >
                    Export to Excel
                </button>
            </div>

            {/* Filter Controls */}
            <div className="flex gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400">Filter by Branch</label>
                    <select
                        value={filterBranch}
                        onChange={e => setFilterBranch(e.target.value)}
                        className="mt-1 bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white"
                    >
                        {uniqueBranches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400">Filter by Section</label>
                    <select
                        value={filterSection}
                        onChange={e => setFilterSection(e.target.value)}
                        className="mt-1 bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white"
                    >
                        {uniqueSections.map(section => <option key={section} value={section}>{section}</option>)}
                    </select>
                </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">S.No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Regd No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Branch</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Section</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {filteredAndSortedSubmissions.map((sub, index) => (
                            <tr key={sub.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white">{sub.regd_no}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{sub.student_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{sub.branch}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{sub.section}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-400">{sub.totalScore || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredAndSortedSubmissions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No results match the current filters.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsTable;