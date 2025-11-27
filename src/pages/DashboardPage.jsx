
// import React, { useState, useEffect } from 'react';
// import { Link, useHistory } from 'react-router-dom';
// import { useAuth } from '../context/useAuth';
// // Make sure to import deleteProject from your hook
// import { useFileSystem } from '../hooks/useFileSystem';
// import Modal from '../components/ui/Modal';
// import ProjectImporter from '../components/project-management/ProjectImporter';
// import ProjectExporter from '../components/project-management/ProjectExporter'; // Import the new component
// import { auth } from '../firebase/config';
// import { signOut } from 'firebase/auth';

// // --- Helper Icons ---
// const GoToEditorIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M13,3.5L18.5,9H13V3.5M10,14L12,12L10,10V14Z" /></svg>;
// const DeleteIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>;

// const DashboardPage = () => {
//     const { currentUser } = useAuth();
//     // ✅ Import the new deleteProject function
//     const { loading, fetchProjects, createNewProject, deleteProject } = useFileSystem();
//     const [projects, setProjects] = useState([]);
//     const [isImportModalOpen, setIsImportModalOpen] = useState(false);
//     const [isExportModalOpen, setIsExportModalOpen] = useState(false); // New state for export modal
//     const history = useHistory();

//     useEffect(() => {
//         if (currentUser) {
//             fetchProjects(currentUser.uid).then(setProjects);
//         }
//     }, [currentUser, fetchProjects]);

//     // ✅ FIX: This function now performs an "Optimistic UI Update"
//     const handleCreateProject = async () => {
//         const projectName = prompt("Enter new project name:");
//         if (projectName && currentUser) {
//             const newProjectId = await createNewProject(currentUser.uid, projectName);
//             if (newProjectId) {
//                 // This is the optimistic update. We create a new project object
//                 // locally and add it to our state right away.
//                 const newProject = {
//                     id: newProjectId,
//                     name: projectName,
//                     ownerId: currentUser.uid,
//                     lastModified: { seconds: Date.now() / 1000 }, // Mimic Firestore timestamp
//                     collaborators: [currentUser.uid],
//                 };
                
//                 // Add the new project to the list without needing to re-fetch.
//                 setProjects(prevProjects => [...prevProjects, newProject]);

//                 // Now, redirect the user. When they come back, the project will be here.
//                 history.push(`/editor/${newProjectId}`);
//             }
//         }
//     };

//     const handleDeleteProject = async (projectId, projectName) => {
//         if (window.confirm(`Are you sure you want to delete the project "${projectName}"? This cannot be undone.`)) {
//             try {
//                 await deleteProject(projectId);
//                 // Refresh the project list after deletion
//                 setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
//             } catch (error) {
//                 alert("Failed to delete project. Please try again.",error);
//             }
//         }
//     };

//     const handleSignOut = async () => {
//         try {
//             await signOut(auth);
//             history.push('/');
//         } catch (error) {
//             console.error("Error signing out: ", error);
//             alert("Failed to sign out.");
//         }
//     };

//     if (loading && projects.length === 0) {
//         return <div className="min-h-screen bg-gray-900 text-white p-8 text-center">Loading Projects...</div>;
//     }

//     return (
//         <div className="min-h-screen bg-gray-900 text-white p-8">
//             <header className="flex items-center justify-between mb-8">
//                 <h1 className="text-3xl font-bold">Your Dashboard</h1>
//                 <div className="flex items-center gap-4">
//                     <button onClick={() => setIsImportModalOpen(true)} className="bg-gray-700 hover:bg-gray-600 font-semibold py-2 px-4 rounded-lg">Import Project</button>
//                     {/* ✅ New Export Button */}
//                     <button onClick={() => setIsExportModalOpen(true)} className="bg-green-600 hover:bg-green-500 font-semibold py-2 px-4 rounded-lg">Export Project</button>
//                     <button onClick={handleCreateProject} className="bg-blue-600 hover:bg-blue-500 font-bold py-2 px-4 rounded-lg">New Project</button>
//                     <button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 font-semibold py-2 px-4 rounded-lg">Logout</button>
//                 </div>
//             </header>

//             {/* ✅ New section for sorting and requests */}
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold text-gray-400">Recent Projects</h2>
//                 <div className="flex items-center gap-4">
//                     <button className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md">Sent Requests</button>
//                     <button className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md">Received Requests</button>
//                     {/* Placeholder for sorting dropdown */}
//                     <select className="text-sm bg-gray-800 border border-gray-700 rounded-md px-3 py-1 focus:outline-none">
//                         <option>Sort by Date</option>
//                         <option>Sort by Name</option>
//                     </select>
//                 </div>
//             </div>

//             <main>
//                 {projects.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {projects.map(project => (
//                             // ✅ Interactive Project Card
//                             <div key={project.id} className="group relative bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-700/50 transition-all duration-300">
//                                 <Link to={`/editor/${project.id}`} className="block">
//                                     <h3 className="text-xl font-bold truncate">{project.name}</h3>
//                                     <p className="text-sm text-gray-400 mt-2">ID: {project.id}</p>
//                                     {project.lastModified && (
//                                         <p className="text-sm text-gray-500">Last modified: {new Date(project.lastModified.seconds * 1000).toLocaleDateString()}</p>
//                                     )}
//                                 </Link>
                                
//                                 {/* ✅ Hover Actions */}
//                                 <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                                     <Link to={`/editor/${project.id}`} title="Go to Editor" className="p-2 rounded-full bg-gray-900/50 hover:bg-blue-600">
//                                         <GoToEditorIcon />
//                                     </Link>
//                                     <button onClick={() => handleDeleteProject(project.id, project.name)} title="Delete Project" className="p-2 rounded-full bg-gray-900/50 hover:bg-red-600">
//                                         <DeleteIcon />
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-center py-16 bg-gray-800 rounded-lg">
//                         <p className="text-gray-400">You don't have any projects yet.</p>
//                         <button onClick={handleCreateProject} className="mt-4 text-blue-400 font-semibold">Create your first project</button>
//                     </div>
//                 )}
//             </main>

//             {/* --- Modals --- */}
//             <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Import Project">
//                 <ProjectImporter />
//             </Modal>
//             <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} title="Export Project">
//                 <ProjectExporter projects={projects} onDone={() => setIsExportModalOpen(false)} />
//             </Modal>
//         </div>
//     );
// };

// export default DashboardPage;





// import React, { useState, useEffect } from 'react';
// import { Link, useHistory } from 'react-router-dom';
// import { useAuth } from '../context/useAuth';
// // Make sure to import deleteProject from your hook
// import { useFileSystem } from '../hooks/useFileSystem';
// import Modal from '../components/ui/Modal';
// import ProjectImporter from '../components/project-management/ProjectImporter';
// import ProjectExporter from '../components/project-management/ProjectExporter'; // Import the new component
// import { auth } from '../firebase/config';
// import { signOut } from 'firebase/auth';

// // --- Helper Icons ---
// const GoToEditorIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M13,3.5L18.5,9H13V3.5M10,14L12,12L10,10V14Z" /></svg>;
// const DeleteIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>;

// const DashboardPage = () => {
//     const { currentUser } = useAuth();
//     // ✅ Import the new deleteProject function
//     const { loading, fetchProjects, createNewProject, deleteProject } = useFileSystem();
//     const [projects, setProjects] = useState([]);
//     const [isImportModalOpen, setIsImportModalOpen] = useState(false);
//     const [isExportModalOpen, setIsExportModalOpen] = useState(false); // New state for export modal
//     const history = useHistory();

//     useEffect(() => {
//         if (currentUser) {
//             fetchProjects(currentUser.uid).then(setProjects);
//         }
//     }, [currentUser, fetchProjects]);

//     // ✅ FIX: This function now performs an "Optimistic UI Update"
//     const handleCreateProject = async () => {
//         const projectName = prompt("Enter new project name:");
//         if (projectName && currentUser) {
//             const newProjectId = await createNewProject(currentUser.uid, projectName);
//             if (newProjectId) {
//                 const newProject = {
//                     id: newProjectId,
//                     name: projectName,
//                     ownerId: currentUser.uid,
//                     lastModified: { seconds: Date.now() / 1000 },
//                     collaborators: [currentUser.uid],
//                 };
//                 setProjects(prevProjects => [...prevProjects, newProject]);
//                 history.push(`/editor/${newProjectId}`);
//             }
//         }
//     };

//     const handleDeleteProject = async (projectId, projectName) => {
//         if (window.confirm(`Are you sure you want to delete the project "${projectName}"? This cannot be undone.`)) {
//             try {
//                 await deleteProject(projectId);
//                 setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
//             } catch (error) {
//                 alert("Failed to delete project. Please try again.",error);
//             }
//         }
//     };

//     const handleSignOut = async () => {
//         try {
//             await signOut(auth);
//             history.push('/');
//         } catch (error) {
//             console.error("Error signing out: ", error);
//             alert("Failed to sign out.");
//         }
//     };

//     // ✨ NEW: Handler to navigate to the exam dashboard
//     const handleNavigateToExams = () => {
//         history.push('/exam-dashboard');
//     };

//     if (loading && projects.length === 0) {
//         return <div className="min-h-screen bg-gray-900 text-white p-8 text-center">Loading Projects...</div>;
//     }

//     return (
//         <div className="min-h-screen bg-gray-900 text-white p-8">
//             <header className="flex items-center justify-between mb-8">
//                 <h1 className="text-3xl font-bold">Your Dashboard</h1>
//                 <div className="flex items-center gap-4">
//                     {/* ✨ NEW: Exam Button */}
//                     <button onClick={handleNavigateToExams} className="bg-purple-600 hover:bg-purple-500 font-bold py-2 px-4 rounded-lg">
//                         Go to Exams
//                     </button>
//                     <button onClick={() => setIsImportModalOpen(true)} className="bg-gray-700 hover:bg-gray-600 font-semibold py-2 px-4 rounded-lg">Import Project</button>
//                     <button onClick={() => setIsExportModalOpen(true)} className="bg-green-600 hover:bg-green-500 font-semibold py-2 px-4 rounded-lg">Export Project</button>
//                     <button onClick={handleCreateProject} className="bg-blue-600 hover:bg-blue-500 font-bold py-2 px-4 rounded-lg">New Project</button>
//                     <button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 font-semibold py-2 px-4 rounded-lg">Logout</button>
//                 </div>
//             </header>

//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold text-gray-400">Recent Projects</h2>
//                 <div className="flex items-center gap-4">
//                     <button className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md">Sent Requests</button>
//                     <button className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md">Received Requests</button>
//                     <select className="text-sm bg-gray-800 border border-gray-700 rounded-md px-3 py-1 focus:outline-none">
//                         <option>Sort by Date</option>
//                         <option>Sort by Name</option>
//                     </select>
//                 </div>
//             </div>

//             <main>
//                 {projects.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {projects.map(project => (
//                             <div key={project.id} className="group relative bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-700/50 transition-all duration-300">
//                                 <Link to={`/editor/${project.id}`} className="block">
//                                     <h3 className="text-xl font-bold truncate">{project.name}</h3>
//                                     <p className="text-sm text-gray-400 mt-2">ID: {project.id}</p>
//                                     {project.lastModified && (
//                                         <p className="text-sm text-gray-500">Last modified: {new Date(project.lastModified.seconds * 1000).toLocaleDateString()}</p>
//                                     )}
//                                 </Link>
                                
//                                 <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                                     <Link to={`/editor/${project.id}`} title="Go to Editor" className="p-2 rounded-full bg-gray-900/50 hover:bg-blue-600">
//                                         <GoToEditorIcon />
//                                     </Link>
//                                     <button onClick={() => handleDeleteProject(project.id, project.name)} title="Delete Project" className="p-2 rounded-full bg-gray-900/50 hover:bg-red-600">
//                                         <DeleteIcon />
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-center py-16 bg-gray-800 rounded-lg">
//                         <p className="text-gray-400">You don't have any projects yet.</p>
//                         <button onClick={handleCreateProject} className="mt-4 text-blue-400 font-semibold">Create your first project</button>
//                     </div>
//                 )}
//             </main>

//             <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Import Project">
//                 <ProjectImporter />
//             </Modal>
//             <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} title="Export Project">
//                 <ProjectExporter projects={projects} onDone={() => setIsExportModalOpen(false)} />
//             </Modal>
//         </div>
//     );
// };

// export default DashboardPage;





import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useFileSystem } from '../hooks/useFileSystem';
import Modal from '../components/ui/Modal';
import ProjectImporter from '../components/project-management/ProjectImporter';
import ProjectExporter from '../components/project-management/ProjectExporter';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

// --- Helper Icons ---
const GoToEditorIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M13,3.5L18.5,9H13V3.5M10,14L12,12L10,10V14Z" /></svg>;
const DeleteIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>;

const DashboardPage = () => {
    // ✅ FIX: Get the user's role from the authentication context
    const { currentUser, userRole } = useAuth();
    const { loading, fetchProjects, createNewProject, deleteProject } = useFileSystem();
    const [projects, setProjects] = useState([]);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (currentUser) {
            fetchProjects(currentUser.uid).then(setProjects);
        }
    }, [currentUser, fetchProjects]);

    const handleCreateProject = async () => {
        const projectName = prompt("Enter new project name:");
        if (projectName && currentUser) {
            const newProjectId = await createNewProject(currentUser.uid, projectName);
            if (newProjectId) {
                const newProject = {
                    id: newProjectId,
                    name: projectName,
                    ownerId: currentUser.uid,
                    lastModified: { seconds: Date.now() / 1000 },
                    collaborators: [currentUser.uid],
                };
                setProjects(prevProjects => [...prevProjects, newProject]);
                history.push(`/editor/${newProjectId}`);
            }
        }
    };

    const handleDeleteProject = async (projectId, projectName) => {
        if (window.confirm(`Are you sure you want to delete the project "${projectName}"? This cannot be undone.`)) {
            try {
                await deleteProject(projectId);
                setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
            } catch (error) {
                alert("Failed to delete project. Please try again.",error);
            }
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            history.push('/');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const handleNavigateToExams = () => {
        history.push('/exam-dashboard');
    };

    if (loading && projects.length === 0) {
        return <div className="min-h-screen bg-gray-900 text-white p-8 text-center">Loading Projects...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Your Dashboard</h1>
                <div className="flex items-center gap-4">
                    {/* ✅ FIX: Conditionally render the Faculty Dashboard button if the user's role is 'faculty' */}
                    {userRole === 'faculty' && (
                        <button 
                            onClick={() => history.push('/faculty-dashboard')}
                            className="bg-indigo-600 hover:bg-indigo-500 font-bold py-2 px-4 rounded-lg"
                        >
                            Faculty Dashboard
                        </button>
                    )}
                    <button onClick={handleNavigateToExams} className="bg-purple-600 hover:bg-purple-500 font-bold py-2 px-4 rounded-lg">
                        Go to Exams
                    </button>
                    <button onClick={() => setIsImportModalOpen(true)} className="bg-gray-700 hover:bg-gray-600 font-semibold py-2 px-4 rounded-lg">Import Project</button>
                    <button onClick={() => setIsExportModalOpen(true)} className="bg-green-600 hover:bg-green-500 font-semibold py-2 px-4 rounded-lg">Export Project</button>
                    <button onClick={handleCreateProject} className="bg-blue-600 hover:bg-blue-500 font-bold py-2 px-4 rounded-lg">New Project</button>
                    <button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 font-semibold py-2 px-4 rounded-lg">Logout</button>
                </div>
            </header>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-400">Recent Projects</h2>
                <div className="flex items-center gap-4">
                    <button className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md">Sent Requests</button>
                    <button className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md">Received Requests</button>
                    <select className="text-sm bg-gray-800 border border-gray-700 rounded-md px-3 py-1 focus:outline-none">
                        <option>Sort by Date</option>
                        <option>Sort by Name</option>
                    </select>
                </div>
            </div>

            <main>
                {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map(project => (
                            <div key={project.id} className="group relative bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-700/50 transition-all duration-300">
                                <Link to={`/editor/${project.id}`} className="block">
                                    <h3 className="text-xl font-bold truncate">{project.name}</h3>
                                    <p className="text-sm text-gray-400 mt-2">ID: {project.id}</p>
                                    {project.lastModified && (
                                        <p className="text-sm text-gray-500">Last modified: {new Date(project.lastModified.seconds * 1000).toLocaleDateString()}</p>
                                    )}
                                </Link>
                                
                                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Link to={`/editor/${project.id}`} title="Go to Editor" className="p-2 rounded-full bg-gray-900/50 hover:bg-blue-600">
                                        <GoToEditorIcon />
                                    </Link>
                                    <button onClick={() => handleDeleteProject(project.id, project.name)} title="Delete Project" className="p-2 rounded-full bg-gray-900/50 hover:bg-red-600">
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-gray-800 rounded-lg">
                        <p className="text-gray-400">You don't have any projects yet.</p>
                        <button onClick={handleCreateProject} className="mt-4 text-blue-400 font-semibold">Create your first project</button>
                    </div>
                )}
            </main>

            <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Import Project">
                <ProjectImporter />
            </Modal>
            <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} title="Export Project">
                <ProjectExporter projects={projects} onDone={() => setIsExportModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default DashboardPage;
