// src/components/exam/faculty/QuestionForm.jsx

import React, { useState, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { storage } from '../../../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const QuestionForm = ({ onSubmit, initialData = {} }) => {
    const [title, setTitle] = useState(initialData.title || '');
    const [description, setDescription] = useState(initialData.description || '');
    const [type, setType] = useState(initialData.type || 'CODING');
    const [marks, setMarks] = useState(initialData.marks || 100);

    // MCQ state
    const [options, setOptions] = useState(initialData.options || ['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState(initialData.correctAnswer || '');

    // Coding state
    const [testCases, setTestCases] = useState(initialData.testCases || [{ input: '', expectedOutput: '' }]);

    // Status
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Handlers for MCQ
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    // Handlers for Coding
    const handleTestCaseChange = (index, field, value) => {
        const newTestCases = [...testCases];
        newTestCases[index][field] = value;
        setTestCases(newTestCases);
    };

    const addTestCase = () => setTestCases([...testCases, { input: '', expectedOutput: '' }]);
    const removeTestCase = (index) => setTestCases(testCases.filter((_, i) => i !== index));

    // Quill image upload
    const quillRef = useRef();
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const storageRef = ref(storage, `question_images/${Date.now()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error('Upload failed:', error);
                    alert('Image upload failed.');
                    setUploadProgress(0);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        const quill = quillRef.current.getEditor();
                        const range = quill.getSelection(true);
                        quill.insertEmbed(range.index, 'image', downloadURL);
                        setUploadProgress(0);
                    });
                }
            );
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image', 'code-block'],
                ['clean']
            ],
            handlers: { image: imageHandler }
        }
    }), []);

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        let questionData = { title, description, type, marks };
        if (type === 'MCQ') {
            questionData = { ...questionData, options, correctAnswer };
        } else {
            questionData = { ...questionData, testCases };
        }

        await onSubmit(questionData);
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-8 rounded-lg">
            {/* Common Fields */}
            <div>
                <label className="block text-sm font-medium text-gray-300">Question Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-gray-600 rounded-full h-2.5 my-2">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                )}
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    modules={modules}
                    className="bg-white text-black"
                />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300">Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white"
                    >
                        <option value="CODING">Coding</option>
                        <option value="MCQ">MCQ</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300">Marks</label>
                    <input
                        type="number"
                        value={marks}
                        onChange={(e) => setMarks(Number(e.target.value))}
                        required
                        className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white"
                    />
                </div>
            </div>

            {/* Conditional Fields */}
            {type === 'MCQ' && (
                <div className="space-y-4 p-4 border border-gray-700 rounded-md">
                    <h3 className="text-lg font-semibold text-white">MCQ Details</h3>
                    {options.map((opt, index) => (
                        <div key={index}>
                            <label className="block text-sm text-gray-400">Option {index + 1}</label>
                            <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                required
                                className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white"
                            />
                        </div>
                    ))}
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Correct Answer</label>
                        <select
                            value={correctAnswer}
                            onChange={(e) => setCorrectAnswer(e.target.value)}
                            required
                            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white"
                        >
                            <option value="">Select correct option</option>
                            {options.map(
                                (opt, index) => opt && <option key={index} value={opt}>{opt}</option>
                            )}
                        </select>
                    </div>
                </div>
            )}

            {type === 'CODING' && (
                <div className="space-y-4 p-4 border border-gray-700 rounded-md">
                    <h3 className="text-lg font-semibold text-white">Test Cases</h3>
                    {testCases.map((tc, index) => (
                        <div key={index} className="flex gap-4 items-end p-2 border-b border-gray-700">
                            <div className="flex-1">
                                <label className="block text-sm text-gray-400">Input</label>
                                <textarea
                                    value={tc.input}
                                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                                    rows="2"
                                    className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white font-mono"
                                ></textarea>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm text-gray-400">Expected Output</label>
                                <textarea
                                    value={tc.expectedOutput}
                                    onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                                    rows="2"
                                    className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white font-mono"
                                ></textarea>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeTestCase(index)}
                                className="bg-red-600 text-white px-3 py-2 rounded-md h-fit"
                            >
                                -
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addTestCase}
                        className="text-blue-400 hover:text-blue-300 font-semibold text-sm"
                    >
                        + Add Test Case
                    </button>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting || uploadProgress > 0}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500"
            >
                {isSubmitting ? 'Saving...' : 'Save Question'}
            </button>
        </form>
    );
};

export default QuestionForm;
