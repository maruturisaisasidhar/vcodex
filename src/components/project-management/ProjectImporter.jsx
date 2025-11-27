import React, { useRef } from 'react';

// Placeholder for an Upload icon
const UploadIcon = () => (
  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
);


const ProjectImporter = () => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      console.log('Files selected for import:', files);
      // TODO: Connect this to useFileSystem.js hook to process and upload files
      alert(`${files.length} files selected. Import logic will be added soon.`);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="p-4 text-white">
      <h3 className="text-lg font-bold mb-4">Import Project</h3>
      <div 
        className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center bg-gray-900/50 hover:border-blue-500 hover:bg-gray-800/50 transition-colors duration-300"
      >
        {/* Hidden file input */}
        <input 
          type="file" 
          ref={fileInputRef}
          webkitdirectory="true" // Allows folder selection
          directory="true"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center">
            <UploadIcon />
            <p className="mt-2 text-gray-400">Drag & drop your project folder here, or</p>
            <button 
              onClick={handleButtonClick}
              className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Select Folder
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectImporter;