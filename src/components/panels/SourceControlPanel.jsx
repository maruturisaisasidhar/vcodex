import React, { useState } from 'react';

// Placeholder for GitHub icon
const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);


const SourceControlPanel = () => {
  const [commitMessage, setCommitMessage] = useState('');
  const [isPushing, setIsPushing] = useState(false);

  const handleCommitAndPush = () => {
    if (!commitMessage.trim()) {
      alert('Please enter a commit message.');
      return;
    }
    setIsPushing(true);
    console.log(`Pushing with commit message: "${commitMessage}"`);
    // TODO: Connect this to useGitHub.js hook
    setTimeout(() => {
      setIsPushing(false);
      setCommitMessage('');
      alert('Changes pushed successfully!');
    }, 2000); // Simulate network request
  };

  return (
    <div className="h-full bg-gray-800 text-white p-3 flex flex-col">
      <h3 className="text-lg font-semibold mb-3">Source Control: GitHub</h3>
      
      <div className="mb-4">
        {/* We would list changed files here */}
        <p className="text-sm text-gray-400">Changes (3 files)</p>
        <ul className="text-sm mt-2 space-y-1 text-green-400">
            <li>M src/App.jsx</li>
            <li className="text-yellow-400">A src/components/panels/AiPanel.jsx</li>
            <li className="text-red-400">D public/vite.svg</li>
        </ul>
      </div>

      <div className="flex-1 flex flex-col">
        <label htmlFor="commitMessage" className="text-sm font-medium mb-1">Commit Message</label>
        <textarea
          id="commitMessage"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="e.g., feat: Implement AI Panel"
          className="w-full flex-1 bg-gray-900 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <button 
        onClick={handleCommitAndPush}
        disabled={isPushing}
        className="w-full mt-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center space-x-2"
      >
        <GitHubIcon />
        <span>{isPushing ? 'Pushing...' : 'Commit & Push'}</span>
      </button>
    </div>
  );
};

export default SourceControlPanel;