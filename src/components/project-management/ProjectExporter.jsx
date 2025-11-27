// import React from 'react';

// // Placeholder for a Download icon
// const DownloadIcon = () => (
//     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
// );

// const ProjectExporter = ({ projectName = "My-V-CodeX-Project" }) => {

//   const handleExport = () => {
//     // Now we are using the projectName prop
//     console.log(`Initiating project export for: ${projectName}`);
//     // TODO: Connect this to useFileSystem.js hook to fetch files, zip them with jszip, and trigger download.
//     alert(`Export logic for "${projectName}.zip" will be added soon!`);
//   };

//   return (
//     <div className="p-4">
//       <button 
//         onClick={handleExport}
//         className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
//       >
//         <DownloadIcon />
//         <span>Export Project as .zip</span>
//       </button>
//     </div>
//   );
// };

// export default ProjectExporter;




/*
* 1. NEW FILE: src/components/project-management/ProjectExporter.jsx
*
* This component handles the logic for exporting a project as a .zip file.
* It uses the 'jszip' library, which you already have in your package.json.
*/
import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver'; // You'll need to install this: npm install file-saver

const ProjectExporter = ({ projects, onDone }) => {
    
    const handleExport = async (project) => {
        if (!project || !project.files) {
            alert("This project has no files to export.");
            return;
        }

        const zip = new JSZip();

        // Add each file from the project to the zip archive
        Object.entries(project.files).forEach(([path, fileData]) => {
            zip.file(path, fileData.content || '');
        });

        // Generate the zip file asynchronously
        try {
            const content = await zip.generateAsync({ type: 'blob' });
            // Use file-saver to trigger the download
            saveAs(content, `${project.name || 'project'}.zip`);
            onDone(); // Close the modal after download
        } catch (error) {
            console.error("Error creating zip file:", error);
            alert("Failed to export project.");
        }
    };

    return (
        <div className="text-white">
            <p className="mb-4 text-gray-400">Select a project to download as a .zip file.</p>
            <div className="max-h-64 overflow-y-auto space-y-2">
                {projects.map(p => (
                    <button
                        key={p.id}
                        onClick={() => handleExport(p)}
                        className="w-full text-left bg-gray-700 p-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <span className="font-semibold">{p.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProjectExporter;