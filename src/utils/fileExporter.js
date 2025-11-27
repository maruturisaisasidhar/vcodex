// src/utils/fileExporter.js

import { saveAs } from 'file-saver';

/**
 * Converts an array of objects to a CSV string.
 * @param {Array<object>} data - The array of data to convert.
 * @returns {string} The CSV formatted string.
 */
function convertToCSV(data) {
    if (!data || data.length === 0) {
        return "";
    }
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Add the headers
    csvRows.push(headers.join(','));

    // Add the data rows
    for (const row of data) {
        const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '""'); // Escape double quotes
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
}

/**
 * Exports an array of results data to a CSV file.
 * @param {Array<object>} resultsData - The data to be exported.
 * @param {string} fileName - The desired name of the file (e.g., 'exam-results').
 */
export const exportToExcel = (resultsData, fileName) => {
    // We can format the data here to match the required columns
    const formattedData = resultsData.map((item, index) => ({
        'S.No': index + 1,
        'V-CodeX ID': item.studentId,
        'Regd No': item.regd_no,
        'Name': item.student_name,
        'Branch': item.branch,
        'Section': item.section,
        'Score': item.totalScore || 0,
    }));

    const csvData = convertToCSV(formattedData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    
    saveAs(blob, `${fileName}.csv`);
};