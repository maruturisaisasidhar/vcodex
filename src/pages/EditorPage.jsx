// // import React, { useState, useEffect, useCallback } from 'react';
// // import { useParams, Link } from 'react-router-dom';
// // import { useAuth } from '../context/useAuth';
// // import { useFileSystem } from '../hooks/useFileSystem';

// // import CodeEditor from '../components/editor/CodeEditor';
// // import FileTree from '../components/file-explorer/FileTree';
// // import AiBubble from '../components/ui/AiBubble';
// // import SplashScreen from '../components/ui/SplashScreen';
// // import TerminalPanel from '../components/panels/TerminalPanel';
// // import TeamChatPanel from '../components/panels/TeamChatPanel';
// // import PreviewPanel from '../components/panels/PreviewPanel';
// // import SourceControlPanel from '../components/panels/SourceControlPanel';

// // // Placeholder bottom panels
// // const ProblemsPanel = () => <div className="p-4 text-gray-500">No problems have been detected.</div>;
// // const OutputPanel = ({ output }) => <pre className="p-4 text-white whitespace-pre-wrap">{output || 'Program output will appear here.'}</pre>;
// // const DebugConsolePanel = () => <div className="p-4 text-gray-500">Debug console is ready.</div>;
// // const PortsPanel = () => <div className="p-4 text-gray-500">No forwarded ports.</div>;

// // // Language dropdown
// // const languages = [
// //     { value: 'javascript', label: 'JavaScript' }, { value: 'python', label: 'Python' },
// //     { value: 'c', label: 'C' }, { value: 'cpp', label: 'C++' }, { value: 'java', label: 'Java' },
// //     { value: 'html', label: 'HTML' }, { value: 'css', label: 'CSS' },
// //     { value: 'plaintext', label: 'Plain Text' }
// // ];

// // const LanguageDropdown = ({ selectedLanguage, onSelect }) => {
// //     const [isOpen, setIsOpen] = useState(false);
// //     const [searchTerm, setSearchTerm] = useState('');
// //     const filtered = languages.filter(lang => lang.label.toLowerCase().includes(searchTerm.toLowerCase()));
// //     const displayLabel = languages.find(l => l.value === selectedLanguage)?.label || 'Select Language';

// //     return (
// //         <div className="relative">
// //             <button onClick={() => setIsOpen(!isOpen)} className="bg-gray-700 p-2 rounded-md hover:bg-gray-600 font-semibold text-sm w-36 text-left">
// //                 {displayLabel}
// //             </button>
// //             {isOpen && (
// //                 <div className="absolute top-full mt-1 w-48 bg-gray-700 rounded-md shadow-lg z-50">
// //                     <input
// //                         type="text"
// //                         placeholder="Search..."
// //                         value={searchTerm}
// //                         onChange={e => setSearchTerm(e.target.value)}
// //                         className="w-full bg-gray-800 p-2 text-sm rounded-t-md focus:outline-none"
// //                     />
// //                     <ul className="max-h-60 overflow-y-auto">
// //                         {filtered.map(lang => (
// //                             <li key={lang.value}
// //                                 onClick={() => { onSelect(lang.value); setIsOpen(false); }}
// //                                 className="p-2 hover:bg-blue-600 cursor-pointer text-sm">
// //                                 {lang.label}
// //                             </li>
// //                         ))}
// //                     </ul>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // const EditorPage = () => {
// //     const { projectId } = useParams();
// //     const { currentUser } = useAuth();
// //     const { loading, fetchProjectData, updateFileContent, createFile } = useFileSystem();

// //     const [projectData, setProjectData] = useState(null);
// //     const [activeFilePath, setActiveFilePath] = useState(null);
// //     const [editorContent, setEditorContent] = useState('');
// //     const [saveStatus, setSaveStatus] = useState('idle');

// //     // ✅ FIX: Correctly declare all state variables.
// //     const [guestLanguage, setGuestLanguage] = useState('python');
// //     const [scratchpadLanguage, setScratchpadLanguage] = useState('python');
// //     const [guestCode, setGuestCode] = useState('print("Hello, V-CodeX Guest!")');

// //     const [bottomPanelTab, setBottomPanelTab] = useState('terminal');
// //     const [codeOutput] = useState('');
// //     const [showSplash, setShowSplash] = useState(false);
// //     const [isTeamChatOpen, setIsTeamChatOpen] = useState(false);
// //     const [isPreviewOpen, setIsPreviewOpen] = useState(false);

// //     const [ws, setWs] = useState(null);
// //     const [isExecuting, setIsExecuting] = useState(false);

// //     // --- Data Loading Effect ---
// //     useEffect(() => {
// //         if (projectId && currentUser) {
// //             const loadProject = async () => {
// //                 const data = await fetchProjectData(projectId);
// //                 setProjectData(data);
// //                 if (data?.files && Object.keys(data.files).length > 0) {
// //                     const firstFile = Object.keys(data.files)[0];
// //                     setActiveFilePath(firstFile);
// //                     setEditorContent(data.files[firstFile].content || '');
// //                 } else {
// //                     setActiveFilePath(null); // Ensure scratchpad mode is active
// //                     setEditorContent('// This project is empty. Create a file or start coding.');
// //                 }
// //             };
// //             loadProject();
// //         }
// //     }, [projectId, currentUser, fetchProjectData]);

// //     // ✅ FIX: Splash screen timer reduced to a reasonable time.
// //     useEffect(() => {
// //         if (!currentUser && !projectId) {
// //             const timer = setTimeout(() => setShowSplash(true), 500); // Show after 0.5s
// //             return () => clearTimeout(timer);
// //         }
// //     }, [currentUser, projectId]);

// //     // --- Derived State ---
// //     const activeFile = currentUser && projectData ? projectData.files[activeFilePath] : null;

// //     // ✅ FIX: This logic now correctly determines the language for all three user scenarios.
// //     const languageForEditor = (() => {
// //         if (!currentUser) {
// //             return guestLanguage; // SCENARIO 1: Guest mode
// //         }
// //         if (activeFile) {
// //             return activeFile.language || 'python'; // SCENARIO 2: Logged-in, file is active
// //         }
// //         return scratchpadLanguage; // SCENARIO 3: Logged-in, no file is active (scratchpad)
// //     })();

// //     // --- Event Handlers ---
// //     const handleFileSelect = (filePath) => {
// //         if (filePath === activeFilePath) return;
// //         setActiveFilePath(filePath);
// //         setSaveStatus('idle');
// //         if (projectData?.files[filePath]) {
// //             setEditorContent(projectData.files[filePath].content || '');
// //         }
// //     };

// //     const handleCodeChange = (newCode) => {
// //         if (currentUser) {
// //             setEditorContent(newCode);
// //             if (activeFilePath) {
// //                 setSaveStatus('typing');
// //             }
// //         } else {
// //             setGuestCode(newCode);
// //         }
// //     };

// //     const handleSaveCode = useCallback(async () => {
// //         if (!currentUser || !projectId) return;
// //         setSaveStatus('saving');

// //         if (activeFilePath) { // Project Mode
// //             try {
// //                 await updateFileContent(projectId, activeFilePath, editorContent, languageForEditor);
// //                 setSaveStatus('saved');
// //             } catch (error) {
// //                 console.error("Save failed:", error);
// //                 setSaveStatus('typing');
// //             }
// //         } else { // Scratchpad Mode
// //             const newFileName = window.prompt("Enter a filename:", `script.${languageForEditor}`);
// //             if (!newFileName || !newFileName.trim()) return setSaveStatus('idle');
// //             try {
// //                 await createFile(projectId, newFileName, editorContent, languageForEditor);
// //                 const data = await fetchProjectData(projectId);
// //                 setProjectData(data);
// //                 setActiveFilePath(newFileName);
// //                 setSaveStatus('saved');
// //             } catch (error) {
// //                 console.error("Create failed:", error);
// //                 alert("Error creating file.");
// //                 setSaveStatus('idle');
// //             }
// //         }
// //     }, [currentUser, projectId, activeFilePath, editorContent, languageForEditor, updateFileContent, createFile, fetchProjectData]);

// //     // Auto-save effect
// //     useEffect(() => {
// //         if (!currentUser || !activeFilePath || saveStatus !== 'typing') return;
// //         const timer = setTimeout(() => handleSaveCode(), 2000);
// //         return () => clearTimeout(timer);
// //     }, [editorContent, currentUser, activeFilePath, saveStatus, handleSaveCode]);

// //     // ✅ FIX: This handler now correctly manages state for all three user scenarios.
// //     const handleLanguageChange = async (newLang) => {
// //         // SCENARIO 1: Guest User
// //         if (!currentUser) {
// //             setGuestLanguage(newLang);
// //             return;
// //         }

// //         // SCENARIO 2: Logged-in User in "Project Mode" (a file is active)
// //         if (activeFilePath) {
// //             setProjectData(prev => ({
// //                 ...prev,
// //                 files: {
// //                     ...prev.files,
// //                     [activeFilePath]: { ...prev.files[activeFilePath], language: newLang },
// //                 },
// //             }));
// //             try {
// //                 await updateFileContent(projectId, activeFilePath, editorContent, newLang);
// //             } catch (e) {
// //                 console.error("Language update failed:", e);
// //             }
// //         }
// //         // SCENARIO 3: Logged-in User in "Scratchpad Mode" (no file is active)
// //         else {
// //             setScratchpadLanguage(newLang);
// //         }
// //     };

// //     const handleRunCode = () => {
// //         if (isExecuting) return;
// //         const codeToRun = currentUser ? editorContent : guestCode;

// //         setIsExecuting(true);
// //         setBottomPanelTab('terminal');

// //         const socket = new WebSocket('ws://localhost:5000');
// //         setWs(socket);

// //         socket.onopen = () => {
// //             socket.send(JSON.stringify({
// //                 type: 'execute',
// //                 language: languageForEditor,
// //                 code: codeToRun
// //             }));
// //         };

// //         socket.onclose = () => {
// //             setWs(null);
// //             setIsExecuting(false);
// //         };

// //         socket.onerror = (error) => {
// //             console.error('WebSocket error:', error);
// //             setIsExecuting(false);
// //         };
// //     };

// //     const renderBottomPanel = () => {
// //         switch (bottomPanelTab) {
// //             case 'problems': return <ProblemsPanel />;
// //             case 'output': return <OutputPanel output={codeOutput} />;
// //             case 'debug': return <DebugConsolePanel />;
// //             case 'terminal': return <TerminalPanel ws={ws} />;
// //             case 'ports': return <PortsPanel />;
// //             case 'git': return <SourceControlPanel />;
// //             default: return null;
// //         }
// //     };

// //     const SaveDisplay = () => {
// //         if (!activeFilePath) {
// //             return saveStatus === 'saving'
// //                 ? <button disabled className="bg-gray-600 p-2 rounded-md font-semibold text-sm w-24 text-center">Saving...</button>
// //                 : <button onClick={handleSaveCode} className="bg-blue-600 hover:bg-blue-500 p-2 rounded-md font-semibold text-sm w-24 text-center">Save</button>;
// //         }
// //         switch (saveStatus) {
// //             case 'typing': return <span className="text-sm text-gray-400 w-32 text-center">Unsaved changes</span>;
// //             case 'saving': return <span className="text-sm text-yellow-400 w-32 text-center">Saving...</span>;
// //             case 'saved': return <span className="text-sm text-green-400 w-32 text-center flex items-center justify-center">✔ All changes saved</span>;
// //             default: return <span className="w-32" />;
// //         }
// //     };

// //     if (loading && currentUser) return <div className="text-center p-8">Loading project...</div>;

// //     return (
// //         <div className="flex h-screen w-screen bg-gray-900 text-white font-sans relative">
// //             <SplashScreen show={showSplash} onClose={() => setShowSplash(false)} />
// //             {currentUser && <AiBubble />}
// //             {currentUser && (
// //                 <div className="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0 flex flex-col">
// //                     <div className="p-4 border-b border-gray-700">
// //                         <h1 className="text-xl font-bold truncate">{projectData?.name || 'Loading...'}</h1>
// //                     </div>
// //                     <div className="flex-1 overflow-y-auto">
// //                         <FileTree files={projectData?.files} onFileSelect={handleFileSelect} activeFile={activeFilePath} />
// //                     </div>
// //                     <div className="p-2 border-t border-gray-700">
// //                         <Link to="/profile" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700">
// //                             <img src={currentUser.photoURL} alt="avatar" className="w-8 h-8 rounded-full" />
// //                             <span className="font-semibold text-sm">{currentUser.displayName}</span>
// //                         </Link>
// //                     </div>
// //                 </div>
// //             )}

// //             <div className="flex flex-1 flex-col overflow-hidden">
// //                 {/* Top header controls */}
// //                 <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
// //                     <div className="flex-1">{!currentUser && <h1 className="text-xl font-bold">V-CodeX Guest Mode</h1>}</div>
// //                     <div className="flex items-center space-x-3">
// //                         <LanguageDropdown selectedLanguage={languageForEditor} onSelect={handleLanguageChange} />
// //                         {currentUser && <SaveDisplay />}
// //                         <button
// //                             onClick={handleRunCode}
// //                             disabled={isExecuting}
// //                             className="bg-green-600 hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed px-4 py-1.5 rounded-md font-semibold text-sm flex items-center"
// //                         >
// //                             {isExecuting ? 'Running…' : '▶ Run'}
// //                         </button>
// //                         {currentUser ? (
// //                             <>
// //                                 <button onClick={() => setIsPreviewOpen(!isPreviewOpen)} className="bg-gray-700 p-2 rounded-md hover:bg-gray-600 font-semibold text-sm">Preview</button>
// //                                 <button onClick={() => setIsTeamChatOpen(!isTeamChatOpen)} className="bg-gray-700 p-2 rounded-md hover:bg-gray-600 font-semibold text-sm">Chat</button>
// //                             </>
// //                         ) : (
// //                             <Link to="/login" className="bg-blue-600 hover:bg-blue-500 p-2 rounded-md font-semibold text-sm">Login to Save</Link>
// //                         )}
// //                     </div>
// //                 </div>

// //                 <div className="flex-1 relative">
// //                     <CodeEditor
// //                         key={currentUser ? `${activeFilePath}-${languageForEditor}` : guestLanguage}
// //                         language={languageForEditor}
// //                         fileContent={currentUser ? editorContent : guestCode}
// //                         onCodeChange={handleCodeChange}
// //                     />
// //                 </div>

// //                 <div className="h-64 flex flex-col border-t border-gray-700">
// //                     <div className="flex bg-gray-800 px-2 flex-shrink-0">
// //                         {['problems', 'output', 'debug', 'terminal'].map(tab => (
// //                             <button key={tab} onClick={() => setBottomPanelTab(tab)}
// //                                 className={`px-4 py-1 text-sm border-b-2 transition-colors duration-200 ${bottomPanelTab === tab ? 'border-blue-400 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>
// //                                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
// //                             </button>
// //                         ))}
// //                         {currentUser && (
// //                             <>
// //                                 <button onClick={() => setBottomPanelTab('ports')} className={`px-4 py-1 text-sm border-b-2 transition-colors duration-200 ${bottomPanelTab === 'ports' ? 'border-blue-400 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>Ports</button>
// //                                 <button onClick={() => setBottomPanelTab('git')} className={`px-4 py-1 text-sm border-b-2 transition-colors duration-200 ${bottomPanelTab === 'git' ? 'border-blue-400 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>Source Control</button>
// //                             </>
// //                         )}
// //                     </div>
// //                     <div className="flex-1 bg-gray-900 overflow-y-auto">{renderBottomPanel()}</div>
// //                 </div>
// //             </div>

// //             {currentUser && isTeamChatOpen && (
// //                 <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col animate-slide-in">
// //                     <TeamChatPanel />
// //                 </div>
// //             )}
// //             {currentUser && isPreviewOpen && (
// //                 <div className="w-1/2 bg-white border-l border-gray-700 flex flex-col animate-slide-in">
// //                     <PreviewPanel />
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default EditorPage;

// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { useAuth } from '../context/useAuth';
// import { useFileSystem } from '../hooks/useFileSystem';

// import CodeEditor from '../components/editor/CodeEditor';
// import FileTree from '../components/file-explorer/FileTree';
// import AiBubble from '../components/ui/AiBubble';
// import SplashScreen from '../components/ui/SplashScreen';
// import TerminalPanel from '../components/panels/TerminalPanel';
// import TeamChatPanel from '../components/panels/TeamChatPanel';
// import PreviewPanel from '../components/panels/PreviewPanel';
// import SourceControlPanel from '../components/panels/SourceControlPanel';

// // Placeholder bottom panels
// const ProblemsPanel = () => <div className="p-4 text-gray-500">No problems have been detected.</div>;
// const OutputPanel = ({ output }) => <pre className="p-4 text-white whitespace-pre-wrap">{output || 'Program output will appear here.'}</pre>;
// const DebugConsolePanel = () => <div className="p-4 text-gray-500">Debug console is ready.</div>;
// const PortsPanel = () => <div className="p-4 text-gray-500">No forwarded ports.</div>;

// // Language dropdown
// const languages = [
//     { value: 'javascript', label: 'JavaScript' }, { value: 'python', label: 'Python' },
//     { value: 'c', label: 'C' }, { value: 'cpp', label: 'C++' }, { value: 'java', label: 'Java' },
//     { value: 'html', label: 'HTML' }, { value: 'css', label: 'CSS' },
//     { value: 'plaintext', label: 'Plain Text' }
// ];

// const LanguageDropdown = ({ selectedLanguage, onSelect }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const filtered = languages.filter(lang => lang.label.toLowerCase().includes(searchTerm.toLowerCase()));
//     const displayLabel = languages.find(l => l.value === selectedLanguage)?.label || 'Select Language';

//     return (
//         <div className="relative">
//             <button onClick={() => setIsOpen(!isOpen)} className="bg-gray-700 p-2 rounded-md hover:bg-gray-600 font-semibold text-sm w-36 text-left">
//                 {displayLabel}
//             </button>
//             {isOpen && (
//                 <div className="absolute top-full mt-1 w-48 bg-gray-700 rounded-md shadow-lg z-50">
//                     <input
//                         type="text"
//                         placeholder="Search..."
//                         value={searchTerm}
//                         onChange={e => setSearchTerm(e.target.value)}
//                         className="w-full bg-gray-800 p-2 text-sm rounded-t-md focus:outline-none"
//                     />
//                     <ul className="max-h-60 overflow-y-auto">
//                         {filtered.map(lang => (
//                             <li key={lang.value}
//                                 onClick={() => { onSelect(lang.value); setIsOpen(false); }}
//                                 className="p-2 hover:bg-blue-600 cursor-pointer text-sm">
//                                 {lang.label}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// const EditorPage = () => {
//     const { projectId } = useParams();
//     const { currentUser } = useAuth();
//     const {
//         loading,
//         fetchProjectData,
//         updateFileContent,
//         createFile,
//         createFileInProject,
//         createFolderInProject,
//         deleteNodeInProject
//     } = useFileSystem();

//     const [projectData, setProjectData] = useState(null);
//     const [activeFilePath, setActiveFilePath] = useState(null);
//     const [editorContent, setEditorContent] = useState('');
//     const [saveStatus, setSaveStatus] = useState('idle');

//     const [guestLanguage, setGuestLanguage] = useState('python');
//     const [scratchpadLanguage, setScratchpadLanguage] = useState('python');
//     const [guestCode, setGuestCode] = useState('print("Hello, V-CodeX Guest!")');

//     const [bottomPanelTab, setBottomPanelTab] = useState('terminal');
//     const [codeOutput] = useState('');
//     const [showSplash, setShowSplash] = useState(false);
//     const [isTeamChatOpen, setIsTeamChatOpen] = useState(false);
//     const [isPreviewOpen, setIsPreviewOpen] = useState(false);

//     const [ws, setWs] = useState(null);
//     const [isExecuting, setIsExecuting] = useState(false);

//     // --- Data Loading Effect ---
//     useEffect(() => {
//         if (projectId && currentUser) {
//             const loadProject = async () => {
//                 const data = await fetchProjectData(projectId);
//                 setProjectData(data);
//                 if (data?.files && Object.keys(data.files).length > 0) {
//                     const firstFile = Object.keys(data.files)[0];
//                     setActiveFilePath(firstFile);
//                     setEditorContent(data.files[firstFile].content || '');
//                 } else {
//                     setActiveFilePath(null); // Ensure scratchpad mode is active
//                     setEditorContent('// This project is empty. Create a file or start coding.');
//                 }
//             };
//             loadProject();
//         }
//     }, [projectId, currentUser, fetchProjectData]);

//     useEffect(() => {
//         if (!currentUser && !projectId) {
//             const timer = setTimeout(() => setShowSplash(true), 500); // Show after 0.5s
//             return () => clearTimeout(timer);
//         }
//     }, [currentUser, projectId]);

//     // --- Derived State ---
//     const activeFile = currentUser && projectData ? projectData.files[activeFilePath] : null;

//     // ✅ FIX: This logic now correctly determines the language for all three user scenarios.
//     const languageForEditor = (() => {
//         if (!currentUser) {
//             return guestLanguage; // SCENARIO 1: Guest mode
//         }
//         if (activeFile) {
//             return activeFile.language || 'python'; // SCENARIO 2: Logged-in, file is active
//         }
//         return scratchpadLanguage; // SCENARIO 3: Logged-in, no file is active (scratchpad)
//     })();

//     // --- NEW FILE SYSTEM HANDLERS ---

//     const refreshProjectData = useCallback(async () => {
//         const data = await fetchProjectData(projectId);
//         setProjectData(data);
//     }, [projectId, fetchProjectData]);

//     const handleCreateFile = async (path) => {
//         const fileName = prompt("Enter new file name:", "newFile.js");
//         if (!fileName) return;
//         const newPath = path ? `${path}/${fileName}` : fileName;
//         await createFileInProject(projectId, newPath);
//         await refreshProjectData();
//     };

//     const handleCreateFolder = async (path) => {
//         const folderName = prompt("Enter new folder name:", "newFolder");
//         if (!folderName) return;
//         const newPath = path ? `${path}/${folderName}` : folderName;
//         await createFolderInProject(projectId, newPath);
//         await refreshProjectData();
//     };

//     const handleDeleteNode = async (path, isFolder) => {
//         const nodeType = isFolder ? 'folder' : 'file';
//         if (window.confirm(`Are you sure you want to delete this ${nodeType}: "${path}"?`)) {
//             await deleteNodeInProject(projectId, path, isFolder);
//             await refreshProjectData();
//             // If the deleted file was the active one, clear the editor
//             if (activeFilePath === path) {
//                 setActiveFilePath(null);
//                 setEditorContent('// Select a file to begin editing.');
//             }
//         }
//     };

//     // --- Event Handlers ---
//     const handleFileSelect = (filePath) => {
//         if (filePath === activeFilePath) return;
//         setActiveFilePath(filePath);
//         setSaveStatus('idle');
//         if (projectData?.files[filePath]) {
//             setEditorContent(projectData.files[filePath].content || '');
//         }
//     };

//     const handleCodeChange = (newCode) => {
//         if (currentUser) {
//             setEditorContent(newCode);
//             if (activeFilePath) {
//                 setSaveStatus('typing');
//             }
//         } else {
//             setGuestCode(newCode);
//         }
//     };

//     const handleSaveCode = useCallback(async () => {
//         if (!currentUser || !projectId) return;
//         setSaveStatus('saving');

//         if (activeFilePath) { // Project Mode
//             try {
//                 await updateFileContent(projectId, activeFilePath, editorContent, languageForEditor);
//                 setSaveStatus('saved');
//             } catch (error) {
//                 console.error("Save failed:", error);
//                 setSaveStatus('typing');
//             }
//         } else { // Scratchpad Mode
//             const newFileName = window.prompt("Enter a filename:", `script.${languageForEditor}`);
//             if (!newFileName || !newFileName.trim()) return setSaveStatus('idle');
//             try {
//                 await createFile(projectId, newFileName, editorContent, languageForEditor);
//                 const data = await fetchProjectData(projectId);
//                 setProjectData(data);
//                 setActiveFilePath(newFileName);
//                 setSaveStatus('saved');
//             } catch (error) {
//                 console.error("Create failed:", error);
//                 alert("Error creating file.");
//                 setSaveStatus('idle');
//             }
//         }
//     }, [currentUser, projectId, activeFilePath, editorContent, languageForEditor, updateFileContent, createFile, fetchProjectData]);

//     // Auto-save effect
//     useEffect(() => {
//         if (!currentUser || !activeFilePath || saveStatus !== 'typing') return;
//         const timer = setTimeout(() => handleSaveCode(), 2000);
//         return () => clearTimeout(timer);
//     }, [editorContent, currentUser, activeFilePath, saveStatus, handleSaveCode]);

//     // ✅ FIX: This handler now correctly manages state for all three user scenarios.
//     const handleLanguageChange = async (newLang) => {
//         // SCENARIO 1: Guest User
//         if (!currentUser) {
//             setGuestLanguage(newLang);
//             return;
//         }

//         // SCENARIO 2: Logged-in User in "Project Mode" (a file is active)
//         if (activeFilePath) {
//             setProjectData(prev => ({
// //                 ...prev,
// //                 files: {
// //                     ...prev.files,
// //                     [activeFilePath]: { ...prev.files[activeFilePath], language: newLang },
// //                 },
// //             }));
// //             try {
// //                 await updateFileContent(projectId, activeFilePath, editorContent, newLang);
// //             } catch (e) {
// //                 console.error("Language update failed:", e);
// //             }
// //         }
// //         // SCENARIO 3: Logged-in User in "Scratchpad Mode" (no file is active)
// //         else {
// //             setScratchpadLanguage(newLang);
// //         }
// //     };

// //     const handleRunCode = () => {
// //         if (isExecuting) return;
// //         const codeToRun = currentUser ? editorContent : guestCode;

// //         setIsExecuting(true);
// //         setBottomPanelTab('terminal');

// //         const socket = new WebSocket('ws://localhost:5000');
// //         setWs(socket);

// //         socket.onopen = () => {
// //             socket.send(JSON.stringify({
// //                 type: 'execute',
// //                 language: languageForEditor,
// //                 code: codeToRun
// //             }));
// //         };

// //         socket.onclose = () => {
// //             setWs(null);
// //             setIsExecuting(false);
// //         };

// //         socket.onerror = (error) => {
// //             console.error('WebSocket error:', error);
// //             setIsExecuting(false);
// //         };
// //     };

// //     const renderBottomPanel = () => {
// //         switch (bottomPanelTab) {
// //             case 'problems': return <ProblemsPanel />;
// //             case 'output': return <OutputPanel output={codeOutput} />;
// //             case 'debug': return <DebugConsolePanel />;
// //             case 'terminal': return <TerminalPanel ws={ws} />;
// //             case 'ports': return <PortsPanel />;
// //             case 'git': return <SourceControlPanel />;
// //             default: return null;
// //         }
// //     };

// //     const SaveDisplay = () => {
// //         if (!activeFilePath) {
// //             return saveStatus === 'saving'
// //                 ? <button disabled className="bg-gray-600 p-2 rounded-md font-semibold text-sm w-24 text-center">Saving...</button>
// //                 : <button onClick={handleSaveCode} className="bg-blue-600 hover:bg-blue-500 p-2 rounded-md font-semibold text-sm w-24 text-center">Save</button>;
// //         }
// //         switch (saveStatus) {
// //             case 'typing': return <span className="text-sm text-gray-400 w-32 text-center">Unsaved changes</span>;
// //             case 'saving': return <span className="text-sm text-yellow-400 w-32 text-center">Saving...</span>;
// //             case 'saved': return <span className="text-sm text-green-400 w-32 text-center flex items-center justify-center">✔ All changes saved</span>;
// //             default: return <span className="w-32" />;
// //         }
// //     };

// //     if (loading && currentUser) return <div className="text-center p-8">Loading project...</div>;

// //     return (
// //         <div className="flex h-screen w-screen bg-gray-900 text-white font-sans relative">
// //             <SplashScreen show={showSplash} onClose={() => setShowSplash(false)} />
// //             {currentUser && <AiBubble />}
// //             {currentUser && (
// //                 <div className="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0 flex flex-col">
// //                     <div className="p-4 border-b border-gray-700">
// //                         <h1 className="text-xl font-bold truncate">{projectData?.name || 'Loading...'}</h1>
// //                     </div>
// //                     <div className="flex-1 overflow-y-auto">
// //                         <FileTree files={projectData?.files} onFileSelect={handleFileSelect} activeFile={activeFilePath} />
// //                     </div>
// //                     <div className="p-2 border-t border-gray-700">
// //                         <Link to="/profile" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700">
// //                             <img src={currentUser.photoURL} alt="avatar" className="w-8 h-8 rounded-full" />
// //                             <span className="font-semibold text-sm">{currentUser.displayName}</span>
// //                         </Link>
// //                     </div>
// //                 </div>
// //             )}

// //             <div className="flex flex-1 flex-col overflow-hidden">
// //                 {/* Top header controls */}
// //                 <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
// //                     <div className="flex-1">{!currentUser && <h1 className="text-xl font-bold">V-CodeX Guest Mode</h1>}</div>
// //                     <div className="flex items-center space-x-3">
// //                         <LanguageDropdown selectedLanguage={languageForEditor} onSelect={handleLanguageChange} />
// //                         {currentUser && <SaveDisplay />}
// //                         <button
// //                             onClick={handleRunCode}
// //                             disabled={isExecuting}
// //                             className="bg-green-600 hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed px-4 py-1.5 rounded-md font-semibold text-sm flex items-center"
// //                         >
// //                             {isExecuting ? 'Running…' : '▶ Run'}
// //                         </button>
// //                         {currentUser ? (
// //                             <>
// //                                 <button onClick={() => setIsPreviewOpen(!isPreviewOpen)} className="bg-gray-700 p-2 rounded-md hover:bg-gray-600 font-semibold text-sm">Preview</button>
// //                                 <button onClick={() => setIsTeamChatOpen(!isTeamChatOpen)} className="bg-gray-700 p-2 rounded-md hover:bg-gray-600 font-semibold text-sm">Chat</button>
// //                             </>
// //                         ) : (
// //                             <Link to="/login" className="bg-blue-600 hover:bg-blue-500 p-2 rounded-md font-semibold text-sm">Login to Save</Link>
// //                         )}
// //                     </div>
// //                 </div>

// //                 <div className="flex-1 relative">
// //                     <CodeEditor
// //                         key={currentUser ? `${activeFilePath}-${languageForEditor}` : guestLanguage}
// //                         language={languageForEditor}
// //                         fileContent={currentUser ? editorContent : guestCode}
// //                         onCodeChange={handleCodeChange}
// //                     />
// //                 </div>

// //                 <div className="h-64 flex flex-col border-t border-gray-700">
// //                     <div className="flex bg-gray-800 px-2 flex-shrink-0">
// //                         {['problems', 'output', 'debug', 'terminal'].map(tab => (
// //                             <button key={tab} onClick={() => setBottomPanelTab(tab)}
// //                                 className={`px-4 py-1 text-sm border-b-2 transition-colors duration-200 ${bottomPanelTab === tab ? 'border-blue-400 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>
// //                                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
// //                             </button>
// //                         ))}
// //                         {currentUser && (
// //                             <>
// //                                 <button onClick={() => setBottomPanelTab('ports')} className={`px-4 py-1 text-sm border-b-2 transition-colors duration-200 ${bottomPanelTab === 'ports' ? 'border-blue-400 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>Ports</button>
// //                                 <button onClick={() => setBottomPanelTab('git')} className={`px-4 py-1 text-sm border-b-2 transition-colors duration-200 ${bottomPanelTab === 'git' ? 'border-blue-400 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>Source Control</button>
// //                             </>
// //                         )}
// //                     </div>
// //                     <div className="flex-1 bg-gray-900 overflow-y-auto">{renderBottomPanel()}</div>
// //                 </div>
// //             </div>

// //             {currentUser && isTeamChatOpen && (
// //                 <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col animate-slide-in">
// //                     <TeamChatPanel />
// //                 </div>
// //             )}
// //             {currentUser && isPreviewOpen && (
// //                 <div className="w-1/2 bg-white border-l border-gray-700 flex flex-col animate-slide-in">
// //                     <PreviewPanel />
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default EditorPage;

// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { useAuth } from '../context/useAuth';
// import { useFileSystem } from '../hooks/useFileSystem';

// import CodeEditor from '../components/editor/CodeEditor';
// import FileTree from '../components/file-explorer/FileTree';
// import AiBubble from '../components/ui/AiBubble';
// import SplashScreen from '../components/ui/SplashScreen';
// import TerminalPanel from '../components/panels/TerminalPanel';
// import TeamChatPanel from '../components/panels/TeamChatPanel';
// import PreviewPanel from '../components/panels/PreviewPanel';
// import SourceControlPanel from '../components/panels/SourceControlPanel';

// // Placeholder bottom panels
// const ProblemsPanel = () => <div className="p-4 text-gray-500">No problems have been detected.</div>;
// const OutputPanel = ({ output }) => <pre className="p-4 text-white whitespace-pre-wrap">{output || 'Program output will appear here.'}</pre>;
// const DebugConsolePanel = () => <div className="p-4 text-gray-500">Debug console is ready.</div>;
// const PortsPanel = () => <div className="p-4 text-gray-500">No forwarded ports.</div>;

// // Language dropdown
// const languages = [
//     { value: 'javascript', label: 'JavaScript' }, { value: 'python', label: 'Python' },
//     { value: 'c', label: 'C' }, { value: 'cpp', label: 'C++' }, { value: 'java', label: 'Java' },
//     { value: 'html', label: 'HTML' }, { value: 'css', label: 'CSS' },
//     { value: 'plaintext', label: 'Plain Text' }
// ];

// const LanguageDropdown = ({ selectedLanguage, onSelect }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const filtered = languages.filter(lang => lang.label.toLowerCase().includes(searchTerm.toLowerCase()));
//     const displayLabel = languages.find(l => l.value === selectedLanguage)?.label || 'Select Language';

//     return (
//         <div className="relative">
//             <button onClick={() => setIsOpen(!isOpen)} className="bg-gray-700 p-2 rounded-md hover:bg-gray-600 font-semibold text-sm w-36 text-left">
//                 {displayLabel}
//             </button>
//             {isOpen && (
//                 <div className="absolute top-full mt-1 w-48 bg-gray-700 rounded-md shadow-lg z-50">
//                     <input
//                         type="text"
//                         placeholder="Search..."
//                         value={searchTerm}
//                         onChange={e => setSearchTerm(e.target.value)}
//                         className="w-full bg-gray-800 p-2 text-sm rounded-t-md focus:outline-none"
//                     />
//                     <ul className="max-h-60 overflow-y-auto">
//                         {filtered.map(lang => (
//                             <li key={lang.value}
//                                 onClick={() => { onSelect(lang.value); setIsOpen(false); }}
//                                 className="p-2 hover:bg-blue-600 cursor-pointer text-sm">
//                                 {lang.label}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// const EditorPage = () => {
//     const { projectId } = useParams();
//     const { currentUser } = useAuth();
//     const {
//         loading,
//         fetchProjectData,
//         updateFileContent,
//         createFile,
//         createFileInProject,
//         createFolderInProject,
//         deleteNodeInProject,
//         renameNodeInProject
//     } = useFileSystem();

//     const [projectData, setProjectData] = useState(null);
//     const [activeFilePath, setActiveFilePath] = useState(null);
//     const [editorContent, setEditorContent] = useState('');
//     const [saveStatus, setSaveStatus] = useState('idle');

//     const [guestLanguage, setGuestLanguage] = useState('python');
//     const [scratchpadLanguage, setScratchpadLanguage] = useState('python');
//     const [guestCode, setGuestCode] = useState('print("Hello, V-CodeX Guest!")');

//     const [bottomPanelTab, setBottomPanelTab] = useState('terminal');
//     const [codeOutput] = useState('');
//     const [showSplash, setShowSplash] = useState(false);
//     const [isTeamChatOpen, setIsTeamChatOpen] = useState(false);
//     const [isPreviewOpen, setIsPreviewOpen] = useState(false);

//     const [ws, setWs] = useState(null);
//     const [isExecuting, setIsExecuting] = useState(false);

//     // --- Data Loading Effect ---
//     useEffect(() => {
//         if (projectId && currentUser) {
//             const loadProject = async () => {
//                 const data = await fetchProjectData(projectId);
//                 setProjectData(data);
//                 if (data?.files && Object.keys(data.files).length > 0) {
//                     const firstFile = Object.keys(data.files)[0];
//                     setActiveFilePath(firstFile);
//                     setEditorContent(data.files[firstFile].content || '');
//                 } else {
//                     setActiveFilePath(null); // Ensure scratchpad mode is active
//                     setEditorContent('// This project is empty. Create a file or start coding.');
//                 }
//             };
//             loadProject();
//         }
//     }, [projectId, currentUser, fetchProjectData]);

//     useEffect(() => {
//         if (!currentUser && !projectId) {
//             const timer = setTimeout(() => setShowSplash(true), 500); // Show after 0.5s
//             return () => clearTimeout(timer);
//         }
//     }, [currentUser, projectId]);

//     // --- Derived State ---
//     const activeFile = currentUser && projectData ? projectData.files[activeFilePath] : null;

//     const languageForEditor = (() => {
//         if (!currentUser) {
//             return guestLanguage; // SCENARIO 1: Guest mode
//         }
//         if (activeFile) {
//             return activeFile.language || 'python'; // SCENARIO 2: Logged-in, file is active
//         }
//         return scratchpadLanguage; // SCENARIO 3: Logged-in, no file is active (scratchpad)
//     })();

//     // --- FILE SYSTEM HANDLERS ---

//     const refreshProjectData = useCallback(async () => {
//         const data = await fetchProjectData(projectId);
//         setProjectData(data);
//     }, [projectId, fetchProjectData]);

//     const handleCreateFile = async (path) => {
//         const fileName = prompt("Enter new file name:", "newFile.js");
//         if (!fileName) return;
//         const newPath = path ? `${path}/${fileName}` : fileName;
//         await createFileInProject(projectId, newPath);
//         await refreshProjectData();
//     };

//     const handleCreateFolder = async (path) => {
//         const folderName = prompt("Enter new folder name:", "newFolder");
//         if (!folderName) return;
//         const newPath = path ? `${path}/${folderName}` : folderName;
//         await createFolderInProject(projectId, newPath);
//         await refreshProjectData();
//     };

//     const handleDeleteNode = async (path, isFolder) => {
//         const nodeType = isFolder ? 'folder' : 'file';
//         if (window.confirm(`Are you sure you want to delete this ${nodeType}: "${path}"?`)) {
//             await deleteNodeInProject(projectId, path, isFolder);
//             await refreshProjectData();
//             // If the deleted file was the active one, clear the editor
//             if (activeFilePath === path) {
//                 setActiveFilePath(null);
//                 setEditorContent('// Select a file to begin editing.');
//             }
//         }
//     };

//     const handleRenameNode = async (oldPath, newName, isFolder) => {
//         const pathParts = oldPath.split('/');
//         pathParts[pathParts.length - 1] = newName;
//         const newPath = pathParts.join('/');

//         await renameNodeInProject(projectId, oldPath, newPath, isFolder);
//         await refreshProjectData();

//         if (activeFilePath === oldPath) {
//             setActiveFilePath(newPath);
//         }
//     };

//     // --- OTHER EVENT HANDLERS ---
//     const handleFileSelect = (filePath) => {
//         if (filePath === activeFilePath) return;
//         setActiveFilePath(filePath);
//         setSaveStatus('idle');
//         if (projectData?.files[filePath]) {
//             setEditorContent(projectData.files[filePath].content || '');
//         }
//     };

//     const handleCodeChange = (newCode) => {
//         if (currentUser) {
//             setEditorContent(newCode);
//             if (activeFilePath) {
//                 setSaveStatus('typing');
//             }
//         } else {
//             setGuestCode(newCode);
//         }
//     };

//     const handleSaveCode = useCallback(async () => {
//         if (!currentUser || !projectId) return;
//         setSaveStatus('saving');

//         if (activeFilePath) { // Project Mode
//             try {
//                 await updateFileContent(projectId, activeFilePath, editorContent, languageForEditor);
//                 setSaveStatus('saved');
//             } catch (error) {
//                 console.error("Save failed:", error);
//                 setSaveStatus('typing');
//             }
//         } else { // Scratchpad Mode
//             const newFileName = window.prompt("Enter a filename:", `script.${languageForEditor}`);
//             if (!newFileName || !newFileName.trim()) return setSaveStatus('idle');
//             try {
//                 await createFile(projectId, newFileName, editorContent, languageForEditor);
//                 const data = await fetchProjectData(projectId);
//                 setProjectData(data);
//                 setActiveFilePath(newFileName);
//                 setSaveStatus('saved');
//             } catch (error) {
//                 console.error("Create failed:", error);
//                 alert("Error creating file.");
//                 setSaveStatus('idle');
//             }
//         }
//     }, [currentUser, projectId, activeFilePath, editorContent, languageForEditor, updateFileContent, createFile, fetchProjectData]);

//     // Auto-save effect
//     useEffect(() => {
//         if (!currentUser || !activeFilePath || saveStatus !== 'typing') return;
//         const timer = setTimeout(() => handleSaveCode(), 2000);
//         return () => clearTimeout(timer);
//     }, [editorContent, currentUser, activeFilePath, saveStatus, handleSaveCode]);

//     const handleLanguageChange = async (newLang) => {
//         // SCENARIO 1: Guest User
//         if (!currentUser) {
//             setGuestLanguage(newLang);
//             return;
//         }

//         // SCENARIO 2: Logged-in User in "Project Mode" (a file is active)
//         if (activeFilePath) {
//             setProjectData(prev => ({
//                 ...prev,
//                 files: {
//                     ...prev.files,
//                     [activeFilePath]: { ...prev.files[activeFilePath], language: newLang },
//                 },
//             }));
//             try {
//                 await updateFileContent(projectId, activeFilePath, editorContent, newLang);
//             } catch (e) {
//                 console.error("Language update failed:", e);
//             }
//         }
//         // SCENARIO 3: Logged-in User in "Scratchpad Mode" (no file is active)
//         else {
//             setScratchpadLanguage(newLang);
//         }
//     };

//     const handleRunCode = () => {
//         if (isExecuting) return;
//         const codeToRun = currentUser ? editorContent : guestCode;

//         setIsExecuting(true);
//         setBottomPanelTab('terminal');

//         const socket = new WebSocket('ws://localhost:5000');
//         setWs(socket);

//         socket.onopen = () => {
//             socket.send(JSON.stringify({
//                 type: 'execute',
//                 language: languageForEditor,
//                 code: codeToRun
//             }));
//         };

//         socket.onclose = () => {
//             setWs(null);
//             setIsExecuting(false);
//         };

//         socket.onerror = (error) => {
//             console.error('WebSocket error:', error);
//             setIsExecuting(false);
//         };
//     };

//     const renderBottomPanel = () => {
//         switch (bottomPanelTab) {
//             case 'problems': return <ProblemsPanel />;
//             case 'output': return <OutputPanel output={codeOutput} />;
//             case 'debug': return <DebugConsolePanel />;
//             case 'terminal': return <TerminalPanel ws={ws} />;
//             case 'ports': return <PortsPanel />;
//             case 'git': return <SourceControlPanel />;
//             default: return null;
//         }
//     };

//     const SaveDisplay = () => {
//         if (!activeFilePath) {
//             return saveStatus === 'saving'
//                 ? <button disabled className="bg-gray-600 p-2 rounded-md font-semibold text-sm w-24 text-center">Saving...</button>
//                 : <button onClick={handleSaveCode} className="bg-blue-600 hover:bg-blue-500 p-2 rounded-md font-semibold text-sm w-24 text-center">Save</button>;
//         }
//         switch (saveStatus) {
//             case 'typing': return <span className="text-sm text-gray-400 w-32 text-center">Unsaved changes</span>;
//             case 'saving': return <span className="text-sm text-yellow-400 w-32 text-center">Saving...</span>;
//             case 'saved': return <span className="text-sm text-green-400 w-32 text-center flex items-center justify-center">✔ All changes saved</span>;
//             default: return <span className="w-32" />;
//         }
//     };

//     if (loading && currentUser) return <div className="text-center p-8">Loading project...</div>;

//     return (
//         <div className="flex h-screen w-screen bg-gray-900 text-white font-sans relative">
//             <SplashScreen show={showSplash} onClose={() => setShowSplash(false)} />
//             {currentUser && <AiBubble />}
//             {currentUser && (
//                 <div className="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0 flex flex-col">
//                     <div className="p-4 border-b border-gray-700">
//                         <h1 className="text-xl font-bold truncate">{projectData?.name || 'Loading...'}</h1>
//                     </div>
//                     <div className="flex-1 overflow-y-auto">
//                         <FileTree files={projectData?.files} onFileSelect={handleFileSelect} activeFile={activeFilePath} />
//                     </div>
//                     <div className="p-2 border-t border-gray-700">
//                         <Link to="/profile" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700">
//                             <img src={currentUser.photoURL} alt="avatar" className="w-8 h-8 rounded-full" />
//                             <span className="font-semibold text-sm">{currentUser.displayName}</span>
//                         </Link>
//                     </div>
//                 </div>
//             )}

//             <div className="flex flex-1 flex-col overflow-hidden">
//                 {/* Top header controls */}
//                 <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
//                     <div className="flex-1">{!currentUser && <h1 className="text-xl font-bold">V-CodeX Guest Mode</h1>}</div>
//                     <div className="flex items-center space-x-3">
//                         <LanguageDropdown selectedLanguage={languageForEditor} onSelect={handleLanguageChange} />
//                         {currentUser && <SaveDisplay />}
//                         <button
//                             onClick={handleRunCode}
//                             disabled={isExecuting}
//                             className="bg-green-600 hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed px-4 py-1.5 rounded-md font-semibold text-sm flex items-center"
//                         >
//                             {isExecuting ? 'Running…' : '▶ Run'}
//                         </button>
//                         {currentUser ? (
// //                             <>
// //                                 <button onClick={() => setIsPreviewOpen(!isPreviewOpen)} className="bg-gray-700 p-2 rounded-md hover:bg-gray-600 font-semibold text-sm">Preview</button>
// //                                 <button onClick={() => setIsTeamChatOpen(!isTeamChatOpen)} className="bg-gray-700 p-2 rounded-md hover:bg-gray-600 font-semibold text-sm">Chat</button>
// //                             </>
// //                         ) : (
// //                             <Link to="/login" className="bg-blue-600 hover:bg-blue-500 p-2 rounded-md font-semibold text-sm">Login to Save</Link>
// //                         )}
// //                     </div>
// //                 </div>

// //                 <div className="flex-1 relative">
// //                     <CodeEditor
// //                         key={currentUser ? `${activeFilePath}-${languageForEditor}` : guestLanguage}
// //                         language={languageForEditor}
// //                         fileContent={currentUser ? editorContent : guestCode}
// //                         onCodeChange={handleCodeChange}
// //                     />
// //                 </div>

// //                 <div className="h-64 flex flex-col border-t border-gray-700">
// //                     <div className="flex bg-gray-800 px-2 flex-shrink-0">
// //                         {['problems', 'output', 'debug', 'terminal'].map(tab => (
// //                             <button key={tab} onClick={() => setBottomPanelTab(tab)}
// //                                 className={`px-4 py-1 text-sm border-b-2 transition-colors duration-200 ${bottomPanelTab === tab ? 'border-blue-400 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>
// //                                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
// //                             </button>
// //                         ))}
// //                         {currentUser && (
// //                             <>
// //                                 <button onClick={() => setBottomPanelTab('ports')} className={`px-4 py-1 text-sm border-b-2 transition-colors duration-200 ${bottomPanelTab === 'ports' ? 'border-blue-400 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>Ports</button>
// //                                 <button onClick={() => setBottomPanelTab('git')} className={`px-4 py-1 text-sm border-b-2 transition-colors duration-200 ${bottomPanelTab === 'git' ? 'border-blue-400 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>Source Control</button>
// //                             </>
// //                         )}
// //                     </div>
// //                     <div className="flex-1 bg-gray-900 overflow-y-auto">{renderBottomPanel()}</div>
// //                 </div>
// //             </div>

// //             {currentUser && isTeamChatOpen && (
// //                 <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col animate-slide-in">
// //                     <TeamChatPanel />
// //                 </div>
// //             )}
// //             {currentUser && isPreviewOpen && (
// //                 <div className="w-1/2 bg-white border-l border-gray-700 flex flex-col animate-slide-in">
// //                     <PreviewPanel />
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default EditorPage;

import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useFileSystem } from "../hooks/useFileSystem";
import { WS_ENDPOINTS } from "../config/api";

import CodeEditor from "../components/editor/CodeEditor";
import FileTree from "../components/file-explorer/FileTree";
import AiBubble from "../components/ui/AiBubble";
import SplashScreen from "../components/ui/SplashScreen";
import TerminalPanel from "../components/panels/TerminalPanel";
import TeamChatPanel from "../components/panels/TeamChatPanel";
import PreviewPanel from "../components/panels/PreviewPanel";
import SourceControlPanel from "../components/panels/SourceControlPanel";

// Placeholder bottom panels
const ProblemsPanel = () => (
  <div className="p-4 text-gray-500">No problems have been detected.</div>
);
const OutputPanel = ({ output }) => (
  <pre className="p-4 text-white whitespace-pre-wrap">
    {output || "Program output will appear here."}
  </pre>
);
const DebugConsolePanel = () => (
  <div className="p-4 text-gray-500">Debug console is ready.</div>
);
const PortsPanel = () => (
  <div className="p-4 text-gray-500">No forwarded ports.</div>
);

// Language dropdown
const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "plaintext", label: "Plain Text" },
];

const LanguageDropdown = ({ selectedLanguage, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const filtered = languages.filter((lang) =>
    lang.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayLabel =
    languages.find((l) => l.value === selectedLanguage)?.label ||
    "Select Language";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-700 p-2 rounded-md hover:bg-gray-600 font-semibold text-sm w-36 text-left"
      >
        {displayLabel}
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 w-48 bg-gray-700 rounded-md shadow-lg z-50">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 p-2 text-sm rounded-t-md focus:outline-none"
          />
          <ul className="max-h-60 overflow-y-auto">
            {filtered.map((lang) => (
              <li
                key={lang.value}
                onClick={() => {
                  onSelect(lang.value);
                  setIsOpen(false);
                }}
                className="p-2 hover:bg-blue-600 cursor-pointer text-sm"
              >
                {lang.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const EditorPage = () => {
  const { projectId } = useParams();
  const { currentUser } = useAuth();
  const {
    loading,
    fetchProjectData,
    updateFileContent,
    createFile,
    createFileInProject,
    createFolderInProject,
    deleteNodeInProject,
    renameNodeInProject,
  } = useFileSystem();

  const [projectData, setProjectData] = useState(null);
  const [activeFilePath, setActiveFilePath] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");

  const [guestLanguage, setGuestLanguage] = useState("python");
  const [scratchpadLanguage, setScratchpadLanguage] = useState("python");
  const [guestCode, setGuestCode] = useState('print("Hello, V-CodeX Guest!")');

  const [bottomPanelTab, setBottomPanelTab] = useState("terminal");
  const [codeOutput] = useState("");
  const [showSplash, setShowSplash] = useState(false);
  const [isTeamChatOpen, setIsTeamChatOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [ws, setWs] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // --- Data Loading Effect ---
  useEffect(() => {
    if (projectId && currentUser) {
      const loadProject = async () => {
        const data = await fetchProjectData(projectId);
        setProjectData(data);
        if (data?.files && Object.keys(data.files).length > 0) {
          const firstFile = Object.keys(data.files)[0];
          setActiveFilePath(firstFile);
          setEditorContent(data.files[firstFile].content || "");
        } else {
          setActiveFilePath(null);
          setEditorContent(
            "// This project is empty. Create a file or start coding."
          );
        }
      };
      loadProject();
    }
  }, [projectId, currentUser, fetchProjectData]);

  useEffect(() => {
    if (!currentUser && !projectId) {
      const timer = setTimeout(() => setShowSplash(true), 500);
      return () => clearTimeout(timer);
    }
  }, [currentUser, projectId]);

  // --- Derived State ---
  const activeFile =
    currentUser && projectData ? projectData.files[activeFilePath] : null;

  const languageForEditor = (() => {
    if (!currentUser) {
      return guestLanguage;
    }
    if (activeFile) {
      return activeFile.language || "python";
    }
    return scratchpadLanguage;
  })();

  // --- FILE SYSTEM HANDLERS ---

  const refreshProjectData = useCallback(async () => {
    const data = await fetchProjectData(projectId);
    setProjectData(data);
  }, [projectId, fetchProjectData]);

  const handleCreateFile = async (path) => {
    const fileName = prompt("Enter new file name:", "newFile.js");
    if (!fileName) return;
    const newPath = path ? `${path}/${fileName}` : fileName;
    await createFileInProject(projectId, newPath);
    await refreshProjectData();
  };

  const handleCreateFolder = async (path) => {
    const folderName = prompt("Enter new folder name:", "newFolder");
    if (!folderName) return;
    const newPath = path ? `${path}/${folderName}` : folderName;
    await createFolderInProject(projectId, newPath);
    await refreshProjectData();
  };

  const handleDeleteNode = async (path, isFolder) => {
    const nodeType = isFolder ? "folder" : "file";
    if (
      window.confirm(
        `Are you sure you want to delete this ${nodeType}: "${path}"?`
      )
    ) {
      await deleteNodeInProject(projectId, path, isFolder);
      await refreshProjectData();
      if (activeFilePath === path) {
        setActiveFilePath(null);
        setEditorContent("// Select a file to begin editing.");
      }
    }
  };

  const handleRenameNode = async (oldPath, newName, isFolder) => {
    const pathParts = oldPath.split("/");
    pathParts[pathParts.length - 1] = newName;
    const newPath = pathParts.join("/");

    await renameNodeInProject(projectId, oldPath, newPath, isFolder);
    await refreshProjectData();

    if (activeFilePath === oldPath) {
      setActiveFilePath(newPath);
    }
  };

  // --- OTHER EVENT HANDLERS ---
  const handleFileSelect = (filePath) => {
    if (filePath === activeFilePath) return;
    setActiveFilePath(filePath);
    setSaveStatus("idle");
    if (projectData?.files[filePath]) {
      setEditorContent(projectData.files[filePath].content || "");
    }
  };

  const handleCodeChange = (newCode) => {
    if (currentUser) {
      setEditorContent(newCode);
      if (activeFilePath) {
        setSaveStatus("typing");
      }
    } else {
      setGuestCode(newCode);
    }
  };

  const handleSaveCode = useCallback(async () => {
    if (!currentUser || !projectId) return;
    setSaveStatus("saving");

    if (activeFilePath) {
      // Project Mode
      try {
        await updateFileContent(
          projectId,
          activeFilePath,
          editorContent,
          languageForEditor
        );
        setSaveStatus("saved");
      } catch (error) {
        console.error("Save failed:", error);
        setSaveStatus("typing");
      }
    } else {
      // Scratchpad Mode
      const newFileName = window.prompt(
        "Enter a filename:",
        `script.${languageForEditor}`
      );
      if (!newFileName || !newFileName.trim()) return setSaveStatus("idle");
      try {
        await createFile(
          projectId,
          newFileName,
          editorContent,
          languageForEditor
        );
        const data = await fetchProjectData(projectId);
        setProjectData(data);
        setActiveFilePath(newFileName);
        setSaveStatus("saved");
      } catch (error) {
        console.error("Create failed:", error);
        alert("Error creating file.");
        setSaveStatus("idle");
      }
    }
  }, [
    currentUser,
    projectId,
    activeFilePath,
    editorContent,
    languageForEditor,
    updateFileContent,
    createFile,
    fetchProjectData,
  ]);

  // Auto-save effect
  useEffect(() => {
    if (!currentUser || !activeFilePath || saveStatus !== "typing") return;
    const timer = setTimeout(() => handleSaveCode(), 2000);
    return () => clearTimeout(timer);
  }, [editorContent, currentUser, activeFilePath, saveStatus, handleSaveCode]);

  const handleLanguageChange = async (newLang) => {
    if (!currentUser) {
      setGuestLanguage(newLang);
      return;
    }

    if (activeFilePath) {
      setProjectData((prev) => ({
        ...prev,
        files: {
          ...prev.files,
          [activeFilePath]: {
            ...prev.files[activeFilePath],
            language: newLang,
          },
        },
      }));
      try {
        await updateFileContent(
          projectId,
          activeFilePath,
          editorContent,
          newLang
        );
      } catch (e) {
        console.error("Language update failed:", e);
      }
    } else {
      setScratchpadLanguage(newLang);
    }
  };

  const handleRunCode = () => {
    if (isExecuting) return;

    const isProjectMode = currentUser && activeFilePath;
    const codeToRun = isProjectMode ? editorContent : guestCode;

    const socketURL = isProjectMode
      ? WS_ENDPOINTS.shell
      : WS_ENDPOINTS.codeRunner;

    setIsExecuting(true);
    setBottomPanelTab("terminal");

    const socket = new WebSocket(socketURL);
    setWs(socket);

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "execute",
          language: languageForEditor,
          code: codeToRun,
        })
      );
    };

    socket.onclose = () => {
      setWs(null);
      setIsExecuting(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsExecuting(false);
    };
  };

  const renderBottomPanel = () => {
    switch (bottomPanelTab) {
      case "problems":
        return <ProblemsPanel />;
      case "output":
        return <OutputPanel output={codeOutput} />;
      case "debug":
        return <DebugConsolePanel />;
      case "terminal":
        return <TerminalPanel ws={ws} />;
      case "ports":
        return <PortsPanel />;
      case "git":
        return <SourceControlPanel />;
      default:
        return null;
    }
  };

  const SaveDisplay = () => {
    if (!activeFilePath) {
      return saveStatus === "saving" ? (
        <button
          disabled
          className="bg-gray-600 p-2 rounded-md font-semibold text-sm w-24 text-center"
        >
          Saving...
        </button>
      ) : (
        <button
          onClick={handleSaveCode}
          className="bg-blue-600 hover:bg-blue-500 p-2 rounded-md font-semibold text-sm w-24 text-center"
        >
          Save
        </button>
      );
    }
    switch (saveStatus) {
      case "typing":
        return (
          <span className="text-sm text-gray-400 w-32 text-center">
            Unsaved changes
          </span>
        );
      case "saving":
        return (
          <span className="text-sm text-yellow-400 w-32 text-center">
            Saving...
          </span>
        );
      case "saved":
        return (
          <span className="text-sm text-green-400 w-32 text-center flex items-center justify-center">
            ✔ All changes saved
          </span>
        );
      default:
        return <span className="w-32" />;
    }
  };

  if (loading && currentUser && !projectData)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">Loading Project...</p>
      </div>
    );

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white font-sans relative">
      <SplashScreen show={showSplash} onClose={() => setShowSplash(false)} />
      {currentUser && <AiBubble />}
      {currentUser && (
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-xl font-bold truncate">
              {projectData?.name || "Loading..."}
            </h1>
          </div>
          <div className="flex-1 overflow-y-auto">
            <FileTree
              files={projectData?.files}
              onFileSelect={handleFileSelect}
              activeFile={activeFilePath}
              onCreateFile={handleCreateFile}
              onCreateFolder={handleCreateFolder}
              onDelete={handleDeleteNode}
              onRename={handleRenameNode}
            />
          </div>
          <div className="p-2 border-t border-gray-700">
            <Link
              to="/profile"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700"
            >
              <img
                src={currentUser.photoURL}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="font-semibold text-sm">
                {currentUser.displayName}
              </span>
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
          <div className="flex-1">
            {!currentUser && (
              <h1 className="text-xl font-bold">V-CodeX Guest Mode</h1>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <LanguageDropdown
              selectedLanguage={languageForEditor}
              onSelect={handleLanguageChange}
            />
            {currentUser && <SaveDisplay />}
            <button
              onClick={handleRunCode}
              disabled={isExecuting}
              className="bg-green-600 hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed px-4 py-1.5 rounded-md font-semibold text-sm flex items-center"
            >
              {isExecuting ? "Running…" : "▶ Run"}
            </button>
            {currentUser ? (
              <>
                <button
                  onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                  className="bg-gray-700 p-2 rounded-md hover:bg-gray-600 font-semibold text-sm"
                >
                  Preview
                </button>
                <button
                  onClick={() => setIsTeamChatOpen(!isTeamChatOpen)}
                  className="bg-gray-700 p-2 rounded-md hover:bg-gray-600 font-semibold text-sm"
                >
                  Chat
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-500 p-2 rounded-md font-semibold text-sm"
              >
                Login to Save
              </Link>
            )}
          </div>
        </div>

        <div className="flex-1 relative">
          <CodeEditor
            key={
              currentUser
                ? `${activeFilePath}-${languageForEditor}`
                : guestLanguage
            }
            language={languageForEditor}
            fileContent={currentUser ? editorContent : guestCode}
            onCodeChange={handleCodeChange}
          />
        </div>

        <div className="h-64 flex flex-col border-t border-gray-700">
          <div className="flex bg-gray-800 px-2 flex-shrink-0">
            {["problems", "output", "debug", "terminal"].map((tab) => (
              <button
                key={tab}
                onClick={() => setBottomPanelTab(tab)}
                className={`px-4 py-1 text-sm border-b-2 transition-colors duration-200 ${
                  bottomPanelTab === tab
                    ? "border-blue-400 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
            {currentUser && (
              <>
                <button
                  onClick={() => setBottomPanelTab("ports")}
                  className={`px-4 py-1 text-sm border-b-2 transition-colors duration-200 ${
                    bottomPanelTab === "ports"
                      ? "border-blue-400 text-white"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  Ports
                </button>
                <button
                  onClick={() => setBottomPanelTab("git")}
                  className={`px-4 py-1 text-sm border-b-2 transition-colors duration-200 ${
                    bottomPanelTab === "git"
                      ? "border-blue-400 text-white"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  Source Control
                </button>
              </>
            )}
          </div>
          <div className="flex-1 bg-gray-900 overflow-y-auto">
            {renderBottomPanel()}
          </div>
        </div>
      </div>

      {currentUser && isTeamChatOpen && (
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col animate-slide-in">
          <TeamChatPanel />
        </div>
      )}
      {currentUser && isPreviewOpen && (
        <div className="w-1/2 bg-white border-l border-gray-700 flex flex-col animate-slide-in">
          <PreviewPanel />
        </div>
      )}
    </div>
  );
};

export default EditorPage;
