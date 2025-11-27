// // src/pages/ExamPage.jsx

// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useHistory } from 'react-router-dom';
// // No need to import useAuth if currentUser is not used directly here.
// // import { useAuth } from '../context/useAuth';

// // Import all necessary components and hooks
// import { getExamDetails } from '../api/examService';
// import { useExamSession } from '../hooks/useExamSession';
// import { useProctoring, requestFullScreen } from '../hooks/useProctoring';

// // UI Components
// import Timer from '../components/ui/Timer';
// import ResizablePanels from '../components/ui/ResizablePanels';
// import CodeEditor from '../components/editor/CodeEditor';
// import QuestionViewer from '../components/exam/student/QuestionViewer';

// // Language dropdown - Assuming it's exported from your EditorPage or moved to a shared file
// const languages = [
//     { value: 'javascript', label: 'JavaScript' }, { value: 'python', label: 'Python' },
//     { value: 'c', label: 'C' }, { value: 'cpp', label: 'C++' }, { value: 'java', label: 'Java' },
// ];
// const LanguageDropdown = ({ selectedLanguage, onSelect }) => {
//     // FIX 1: Removed the unused 'displayLabel' variable.
//     return (
//         <select value={selectedLanguage} onChange={e => onSelect(e.target.value)} className="bg-gray-700 p-2 rounded-md hover:bg-gray-600 font-semibold text-sm focus:outline-none">
//             {languages.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
//         </select>
//     );
// };

// const ExamPage = () => {
//     const { examId, submissionId } = useParams();
//     const history = useHistory();
//     // FIX 2: Removed 'currentUser' as it was not being used in this component.
//     // const { currentUser } = useAuth();

//     const [examData, setExamData] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // State for the code editor and bottom panel
//     const [language, setLanguage] = useState('cpp');
//     const [editorCode, setEditorCode] = useState('');
//     const [bottomPanelTab, setBottomPanelTab] = useState('testcase');
//     const [testcaseInput, setTestcaseInput] = useState('');
//     const [runResult, setRunResult] = useState('');
//     const [isExecuting, setIsExecuting] = useState(false);

//     // --- Initialize Hooks ---
//     const examSession = useExamSession(examData, submissionId);

//     const handleViolation = useCallback(async () => {
//         alert("Violation detected! Your exam will be submitted automatically.");
//         await examSession.submitExam();
//         history.push('/dashboard');
//     }, [examSession, history]);

//     useProctoring(handleViolation);

//     // --- Data Loading & Fullscreen ---
//     useEffect(() => {
//         const fetchAndPrepareExam = async () => {
//             try {
//                 if (window.confirm("The exam will start in fullscreen mode. Click OK to continue.")) {
//                     requestFullScreen();
//                 } else {
//                     history.push('/dashboard');
//                     return;
//                 }
//                 const data = await getExamDetails(examId);
//                 setExamData(data);
//             } catch (error) {
//                 setError("An error occurred while loading the exam.",error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchAndPrepareExam();
//     }, [examId, history]);

//     // --- Sync Editor with Current Question ---
//     const { currentQuestion, answers, saveAnswer } = examSession;
//     useEffect(() => {
//         if (currentQuestion) {
//             const currentAnswer = answers[currentQuestion.id] || '';
//             setEditorCode(currentAnswer);
//         }
//     }, [currentQuestion, answers]);

//     // --- Handlers ---
//     const handleCodeChange = (newCode) => {
//         setEditorCode(newCode);
//         saveAnswer(currentQuestion.id, newCode); // Auto-saves progress
//     };

//     const handleRunCode = () => {
//         if (isExecuting) return;
//         setIsExecuting(true);
//         setBottomPanelTab('result');
//         setRunResult('Executing...');

//         const socket = new WebSocket('ws://localhost:5000'); // Your execution server URL
//         let output = '';

//         socket.onopen = () => {
//             socket.send(JSON.stringify({
//                 type: 'execute',
//                 language: language,
//                 code: editorCode,
//                 input: testcaseInput // Sending custom test case input
//             }));
//         };

//         socket.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             if (data.type === 'stdout' || data.type === 'stderr') {
//                 output += data.data;
//                 setRunResult(output);
//             }
//         };

//         socket.onclose = () => {
//             setIsExecuting(false);
//             if(output === '') setRunResult('Execution finished with no output.');
//         };

//         socket.onerror = () => {
//             setRunResult('Error connecting to execution server.');
//             setIsExecuting(false);
//         };
//     };

//     const handleFinalSubmit = async () => {
//         if (window.confirm("Are you sure you want to submit your exam?")) {
//             await examSession.submitExam();
//             alert("Exam submitted successfully!");
//             history.push('/dashboard');
//         }
//     };

//     // --- Render Logic ---
//     if (isLoading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><p>Loading Exam...</p></div>;
//     if (error) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><p>{error}</p></div>;

//     const renderCodingView = () => (
//         <ResizablePanels
//             leftPanel={<QuestionViewer question={currentQuestion} />}
//             rightPanel={
//                 <div className="h-full flex flex-col bg-gray-900">
//                     <div className="p-2 border-b border-gray-700 flex-shrink-0">
//                         <LanguageDropdown selectedLanguage={language} onSelect={setLanguage} />
//                     </div>
//                     <div className="flex-grow h-full">
//                         <CodeEditor
//                             language={language}
//                             value={editorCode}
//                             onChange={handleCodeChange}
//                         />
//                     </div>
//                 </div>
//             }
//             bottomPanel={
//                 <div className="h-full flex flex-col">
//                     <div className="flex bg-gray-800 flex-shrink-0">
//                         <button onClick={() => setBottomPanelTab('testcase')} className={`px-4 py-1 text-sm border-b-2 ${bottomPanelTab === 'testcase' ? 'border-blue-400 text-white' : 'border-transparent text-gray-400'}`}>Testcase</button>
//                         <button onClick={() => setBottomPanelTab('result')} className={`px-4 py-1 text-sm border-b-2 ${bottomPanelTab === 'result' ? 'border-blue-400 text-white' : 'border-transparent text-gray-400'}`}>Result</button>
//                     </div>
//                     <div className="flex-grow bg-gray-900 overflow-y-auto">
//                         {bottomPanelTab === 'testcase' && (
//                             <textarea
//                                 value={testcaseInput}
//                                 onChange={(e) => setTestcaseInput(e.target.value)}
//                                 placeholder="Enter custom input for your test case here..."
//                                 className="w-full h-full bg-gray-900 text-white p-4 font-mono focus:outline-none resize-none"
//                             />
//                         )}
//                         {bottomPanelTab === 'result' && (
//                             <pre className="p-4 text-white whitespace-pre-wrap font-mono">{runResult}</pre>
//                         )}
//                     </div>
//                 </div>
//             }
//         />
//     );

//     const renderMCQView = () => (
//         <div className="flex-grow flex items-center justify-center p-4">
//              <div className="w-full max-w-4xl">
//                 <QuestionViewer
//                     question={currentQuestion}
//                     currentAnswer={answers[currentQuestion?.id]}
//                     onAnswerChange={saveAnswer}
//                 />
//             </div>
//         </div>
//     );

//     return (
//         <div className="flex flex-col h-screen w-screen bg-gray-900 text-white font-sans overflow-hidden">
//             <header className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700 flex-shrink-0">
//                 <h1 className="text-xl font-bold">{examData.title}</h1>
//                 <Timer duration={examData.durationInMinutes * 60} onComplete={handleFinalSubmit} />
//             </header>

//             {currentQuestion?.type === 'CODING' ? renderCodingView() : renderMCQView()}

//             <footer className="flex items-center justify-between p-2 bg-gray-800 border-t-2 border-gray-700 flex-shrink-0">
//                 <div>{/* Can add question navigation here later */}</div>
//                 <div className="flex items-center gap-4">
//                     {currentQuestion?.type === 'CODING' && (
//                          <button onClick={handleRunCode} disabled={isExecuting} className="bg-gray-600 hover:bg-gray-500 font-semibold py-2 px-4 rounded-lg text-sm disabled:bg-gray-500">
//                             {isExecuting ? 'Running...' : 'Run Code'}
//                         </button>
//                     )}
//                     {examSession.isLastQuestion ? (
//                         <button onClick={handleFinalSubmit} className="bg-blue-600 hover:bg-blue-500 font-bold py-2 px-4 rounded-lg">
//                             Submit Exam
//                         </button>
//                     ) : (
//                         <button onClick={examSession.goToNextQuestion} className="bg-green-600 hover:bg-green-500 font-semibold py-2 px-4 rounded-lg">
//                             Save & Next
//                         </button>
//                     )}
//                 </div>
//             </footer>
//         </div>
//     );
// };

// export default ExamPage;

// src/pages/ExamPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
// No need to import useAuth if currentUser is not used directly here.
// import { useAuth } from '../context/useAuth';

// Import all necessary components and hooks
import { getExamDetails } from "../api/examService";
import { useExamSession } from "../hooks/useExamSession";
import { useProctoring, requestFullScreen } from "../hooks/useProctoring";

// UI Components
import Timer from "../components/ui/Timer";
import ResizablePanels from "../components/ui/ResizablePanels";
import CodeEditor from "../components/editor/CodeEditor";
import QuestionViewer from "../components/exam/student/QuestionViewer";

// Language dropdown - Assuming it's exported from your EditorPage or moved to a shared file
const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
];
const LanguageDropdown = ({ selectedLanguage, onSelect }) => {
  // FIX 1: Removed the unused 'displayLabel' variable.
  return (
    <select
      value={selectedLanguage}
      onChange={(e) => onSelect(e.target.value)}
      className="bg-gray-700 p-2 rounded-md hover:bg-gray-600 font-semibold text-sm focus:outline-none"
    >
      {languages.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};

const ExamPage = () => {
  const { examId, submissionId } = useParams();
  const history = useHistory();
  // FIX 2: Removed 'currentUser' as it was not being used in this component.
  // const { currentUser } = useAuth();

  const [examData, setExamData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the code editor and bottom panel
  const [language, setLanguage] = useState("cpp");
  const [editorCode, setEditorCode] = useState("");
  const [bottomPanelTab, setBottomPanelTab] = useState("testcase");
  const [testcaseInput, setTestcaseInput] = useState("");
  const [runResult, setRunResult] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);

  // --- Initialize Hooks ---
  const examSession = useExamSession(examData, submissionId);

  const handleViolation = useCallback(async () => {
    alert("Violation detected! Your exam will be submitted automatically.");
    await examSession.submitExam();
    history.push("/dashboard");
  }, [examSession, history]);

  useProctoring(handleViolation);

  // --- Data Loading & Fullscreen ---
  useEffect(() => {
    const fetchAndPrepareExam = async () => {
      try {
        if (
          window.confirm(
            "The exam will start in fullscreen mode. Click OK to continue."
          )
        ) {
          requestFullScreen();
        } else {
          history.push("/dashboard");
          return;
        }
        const data = await getExamDetails(examId);
        setExamData(data);
      } catch (error) {
        setError("An error occurred while loading the exam.", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndPrepareExam();
  }, [examId, history]);

  // --- Sync Editor with Current Question ---
  const { currentQuestion, answers, saveAnswer } = examSession;
  useEffect(() => {
    if (currentQuestion) {
      const currentAnswer = answers[currentQuestion.id] || "";
      setEditorCode(currentAnswer);
    }
  }, [currentQuestion, answers]);

  // --- Handlers ---
  const handleCodeChange = (newCode) => {
    setEditorCode(newCode);
    saveAnswer(currentQuestion.id, newCode); // Auto-saves progress
  };

  const handleRunCode = () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setBottomPanelTab("result");
    setRunResult("Executing...");

    // ✅ FIX: Replace 'localhost' with your server's public IP address
    const SERVER_IP = "3.85.195.186"; // e.g., '3.87.121.223'
    const socket = new WebSocket(`ws://${SERVER_IP}:5000/runner`); // The "Run Code" button always uses the runner

    let output = "";

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "execute",
          language: language,
          code: editorCode,
          input: testcaseInput, // Sending custom test case input
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "stdout" || data.type === "stderr") {
        output += data.data;
        setRunResult(output);
      }
    };

    socket.onclose = () => {
      setIsExecuting(false);
      if (output === "") setRunResult("Execution finished with no output.");
    };

    socket.onerror = () => {
      setRunResult("Error connecting to execution server.");
      setIsExecuting(false);
    };
  };

  const handleFinalSubmit = async () => {
    if (window.confirm("Are you sure you want to submit your exam?")) {
      // This function will connect to the '/judge' lane.
      // It's important that your server.js is ready to handle this.
      // For now, we will add a placeholder for the judging logic.

      // When you are ready to implement judging:
      // const SERVER_IP = 'YOUR_AWS_PUBLIC_IP';
      // const judgeSocket = new WebSocket(`ws://${SERVER_IP}:5000/judge`);
      // ... send data to judgeSocket ...

      await examSession.submitExam(); // This part saves the data to Firestore
      alert("Exam submitted successfully!");
      history.push("/dashboard");
    }
  };

  // --- Render Logic ---
  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading Exam...</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>{error}</p>
      </div>
    );

  const renderCodingView = () => (
    <ResizablePanels
      leftPanel={<QuestionViewer question={currentQuestion} />}
      rightPanel={
        <div className="h-full flex flex-col bg-gray-900">
          <div className="p-2 border-b border-gray-700 flex-shrink-0">
            <LanguageDropdown
              selectedLanguage={language}
              onSelect={setLanguage}
            />
          </div>
          <div className="flex-grow h-full">
            <CodeEditor
              language={language}
              value={editorCode}
              onChange={handleCodeChange}
            />
          </div>
        </div>
      }
      bottomPanel={
        <div className="h-full flex flex-col">
          <div className="flex bg-gray-800 flex-shrink-0">
            <button
              onClick={() => setBottomPanelTab("testcase")}
              className={`px-4 py-1 text-sm border-b-2 ${
                bottomPanelTab === "testcase"
                  ? "border-blue-400 text-white"
                  : "border-transparent text-gray-400"
              }`}
            >
              Testcase
            </button>
            <button
              onClick={() => setBottomPanelTab("result")}
              className={`px-4 py-1 text-sm border-b-2 ${
                bottomPanelTab === "result"
                  ? "border-blue-400 text-white"
                  : "border-transparent text-gray-400"
              }`}
            >
              Result
            </button>
          </div>
          <div className="flex-grow bg-gray-900 overflow-y-auto">
            {bottomPanelTab === "testcase" && (
              <textarea
                value={testcaseInput}
                onChange={(e) => setTestcaseInput(e.target.value)}
                placeholder="Enter custom input for your test case here..."
                className="w-full h-full bg-gray-900 text-white p-4 font-mono focus:outline-none resize-none"
              />
            )}
            {bottomPanelTab === "result" && (
              <pre className="p-4 text-white whitespace-pre-wrap font-mono">
                {runResult}
              </pre>
            )}
          </div>
        </div>
      }
    />
  );

  const renderMCQView = () => (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <QuestionViewer
          question={currentQuestion}
          currentAnswer={answers[currentQuestion?.id]}
          onAnswerChange={saveAnswer}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-white font-sans overflow-hidden">
      <header className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700 flex-shrink-0">
        <h1 className="text-xl font-bold">{examData.title}</h1>
        <Timer
          duration={examData.durationInMinutes * 60}
          onComplete={handleFinalSubmit}
        />
      </header>

      {currentQuestion?.type === "CODING"
        ? renderCodingView()
        : renderMCQView()}

      <footer className="flex items-center justify-between p-2 bg-gray-800 border-t-2 border-gray-700 flex-shrink-0">
        <div>{/* Can add question navigation here later */}</div>
        <div className="flex items-center gap-4">
          {currentQuestion?.type === "CODING" && (
            <button
              onClick={handleRunCode}
              disabled={isExecuting}
              className="bg-gray-600 hover:bg-gray-500 font-semibold py-2 px-4 rounded-lg text-sm disabled:bg-gray-500"
            >
              {isExecuting ? "Running..." : "Run Code"}
            </button>
          )}
          {examSession.isLastQuestion ? (
            <button
              onClick={handleFinalSubmit}
              className="bg-blue-600 hover:bg-blue-500 font-bold py-2 px-4 rounded-lg"
            >
              Submit Exam
            </button>
          ) : (
            <button
              onClick={examSession.goToNextQuestion}
              className="bg-green-600 hover:bg-green-500 font-semibold py-2 px-4 rounded-lg"
            >
              Save & Next
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default ExamPage;
