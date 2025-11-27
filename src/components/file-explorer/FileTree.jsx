// import React, { useState } from 'react';

// // Icons
// const FolderIcon = () => <span>📁</span>;
// const FileIcon = () => <span>📄</span>;
// const DeleteIcon = () => <span className="text-gray-500 hover:text-red-500 text-lg font-bold">&times;</span>;
// const AddFileIcon = () => <span className="text-gray-400 hover:text-white text-sm">+📄</span>;
// const AddFolderIcon = () => <span className="text-gray-400 hover:text-white text-sm">+📁</span>;

// const TreeNode = ({
//   name,
//   node,
//   onFileSelect,
//   onDeleteNode,
//   onCreateFile,
//   onCreateFolder,
//   path
// }) => {
//   const [isOpen, setIsOpen] = useState(true);
//   // Folder is an object without a 'language' key (to detect files with language metadata)
//   const isFolder = typeof node === 'object' && node !== null && !node.language;

//   const handleNodeClick = (e) => {
//     e.stopPropagation();
//     if (isFolder) {
//       setIsOpen(!isOpen);
//     } else {
//       onFileSelect?.(path, node);
//     }
//   };

//   const handleDeleteClick = (e) => {
//     e.stopPropagation();
//     onDeleteNode?.(path);
//   };

//   const handleCreateFileClick = (e) => {
//     e.stopPropagation();
//     onCreateFile?.(path);
//   };

//   const handleCreateFolderClick = (e) => {
//     e.stopPropagation();
//     onCreateFolder?.(path);
//   };

//   return (
//     <div className="ml-4">
//       <div
//         className="flex items-center justify-between group cursor-pointer hover:bg-gray-700 p-1 rounded"
//         onClick={handleNodeClick}
//       >
//         <div className="flex items-center space-x-2">
//           {isFolder ? <FolderIcon /> : <FileIcon />}
//           <span>{name}</span>
//         </div>
//         <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
//           {isFolder && (
//             <>
//               <button onClick={handleCreateFileClick} title="New File">
//                 <AddFileIcon />
//               </button>
//               <button onClick={handleCreateFolderClick} title="New Folder">
//                 <AddFolderIcon />
//               </button>
//             </>
//           )}
//           <button onClick={handleDeleteClick} title="Delete">
//             <DeleteIcon />
//           </button>
//         </div>
//       </div>
//       {isFolder && isOpen && (
//         <div className="border-l border-gray-600 pl-2">
//           {Object.entries(node).map(([childName, childNode]) => (
//             <TreeNode
//               key={childName}
//               name={childName}
//               node={childNode}
//               onFileSelect={onFileSelect}
//               onDeleteNode={onDeleteNode}
//               onCreateFile={onCreateFile}
//               onCreateFolder={onCreateFolder}
//               path={`${path}/${childName}`}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const FileTree = ({ files, ...handlers }) => {
//   return (
//     <div className="h-full w-full bg-gray-800 text-white p-4 flex flex-col">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold">Project Files</h2>
//         <div className="flex items-center space-x-2">
//           <button onClick={() => handlers.onCreateFile('')} title="New File in Root">
//             📄
//           </button>
//           <button onClick={() => handlers.onCreateFolder('')} title="New Folder in Root">
//             📁
//           </button>
//         </div>
//       </div>
//       <div className="flex-1 overflow-y-auto">
//         {files && Object.keys(files).length > 0 ? (
//           Object.entries(files).map(([name, node]) => (
//             <TreeNode
//               key={name}
//               name={name}
//               node={node}
//               {...handlers}
//               path={name}
//             />
//           ))
//         ) : (
//           <p className="text-gray-500">No files in this project.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FileTree;





// import React, { useState, useMemo } from 'react';
// import buildFileTree from './fileTreeUtils'; 
// import FileIcon from './FileIcon';
// // Icons
// const DeleteIcon = () => <span className="text-gray-500 hover:text-red-500 text-lg font-bold">&times;</span>;
// const AddFileIcon = () => <span className="text-gray-400 hover:text-white text-sm">+📄</span>;
// const AddFolderIcon = () => <span className="text-gray-400 hover:text-white text-sm">+📁</span>;

// const TreeNode = ({ node, onFileSelect, onDeleteNode, onCreateFile, onCreateFolder, activeFile, level = 0 }) => {
//   const [isOpen, setIsOpen] = useState(true);

//   const isFolder = node.type === 'folder';
//   const isActive = !isFolder && activeFile === node.path;

//   const handleToggle = (e) => {
//     e.stopPropagation();
//     if (isFolder) {
//       setIsOpen(!isOpen);
//     } else {
//       onFileSelect?.(node.path);
//     }
//   };

//   const handleDeleteClick = (e) => {
//     e.stopPropagation();
//     onDeleteNode?.(node.path);
//   };

//   const handleCreateFileClick = (e) => {
//     e.stopPropagation();
//     onCreateFile?.(node.path);
//   };

//   const handleCreateFolderClick = (e) => {
//     e.stopPropagation();
//     onCreateFolder?.(node.path);
//   };

//   return (
//     <div>
//       <div
//         onClick={handleToggle}
//         style={{ paddingLeft: `${level * 16}px` }}
//         className={`flex items-center justify-between p-1 rounded-md cursor-pointer hover:bg-gray-700 ${isActive ? 'bg-blue-800' : ''}`}
//       >
//         <div className="flex items-center space-x-2">
//           {isFolder ? (
//             <>
//               <svg
//                 viewBox="0 0 24 24"
//                 width="16"
//                 height="16"
//                 className={`transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`}
//                 fill="#c5c5c5"
//               >
//                 <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
//               </svg>
//               <svg viewBox="0 0 24 24" width="16" height="16" className="flex-shrink-0" fill={isOpen ? '#e8a87c' : '#c5c5c5'}>
//                 <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" />
//               </svg>
//             </>
//           ) : (
//             <div style={{ marginLeft: '20px' }} className="flex items-center">
//               <FileIcon filename={node.name} />
//             </div>
//           )}
//           <span className="truncate text-sm">{node.name}</span>
//         </div>

//         <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
//           {isFolder && (
//             <>
//               <button onClick={handleCreateFileClick} title="New File"><AddFileIcon /></button>
//               <button onClick={handleCreateFolderClick} title="New Folder"><AddFolderIcon /></button>
//             </>
//           )}
//           <button onClick={handleDeleteClick} title="Delete"><DeleteIcon /></button>
//         </div>
//       </div>

//       {isFolder && isOpen && (
//         <div>
//           {node.children.map(childNode => (
//             <TreeNode
//               key={childNode.path}
//               node={childNode}
//               onFileSelect={onFileSelect}
//               onDeleteNode={onDeleteNode}
//               onCreateFile={onCreateFile}
//               onCreateFolder={onCreateFolder}
//               activeFile={activeFile}
//               level={level + 1}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const FileTree = ({ files, onFileSelect, onDeleteNode, onCreateFile, onCreateFolder, activeFile }) => {
//   const fileTree = useMemo(() => buildFileTree(files), [files]);

//   return (
//     <div className="h-full w-full bg-gray-800 text-white p-4 flex flex-col">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold">Project Files</h2>
//         <div className="flex items-center space-x-2">
//           <button onClick={() => onCreateFile('')} title="New File in Root">📄</button>
//           <button onClick={() => onCreateFolder('')} title="New Folder in Root">📁</button>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         {fileTree.length > 0 ? (
//           fileTree.map(node => (
//             <TreeNode
//               key={node.path}
//               node={node}
//               onFileSelect={onFileSelect}
//               onDeleteNode={onDeleteNode}
//               onCreateFile={onCreateFile}
//               onCreateFolder={onCreateFolder}
//               activeFile={activeFile}
//             />
//           ))
//         ) : (
//           <p className="text-gray-500">No files in this project.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FileTree;




// import React, { useState, useMemo } from 'react';
// import buildFileTree from './fileTreeUtils'; 
// import FileIcon from './FileIcon';

// // --- Action Icons for the hover menu ---
// const NewFileIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.41,9H15V15H13V11.41L9.41,15L8,13.59L11.59,10H9V9H13.41M20,8V20H4V4H12L14,2H4C2.9,2 2,2.9 2,4V20C2,21.1 2.9,22 4,22H20C21.1,22 22,21.1 22,20V8H20Z" /></svg>;
// const NewFolderIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8A2,2 0 0,0 20,6M16,15H13V18H11V15H8V13H11V10H13V13H16V15Z" /></svg>;
// const DeleteIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>;


// const TreeNode = ({ node, onFileSelect, onDelete, onCreateFile, onCreateFolder, activeFile, level = 0 }) => {
//   const [isOpen, setIsOpen] = useState(true);

//   const isFolder = node.type === 'folder';
//   const isActive = !isFolder && activeFile === node.path;

//   const handleNodeClick = (e) => {
//     e.stopPropagation();
//     if (isFolder) {
//       setIsOpen(!isOpen);
//     } else {
//       onFileSelect(node.path);
//     }
//   };

//   return (
//     <div>
//       <div
//         className={`group flex items-center justify-between p-1 rounded-md cursor-pointer hover:bg-gray-700 ${isActive ? 'bg-blue-800' : ''}`}
//         style={{ paddingLeft: `${level * 16}px` }}
//         onClick={handleNodeClick}
//       >
//         {/* Name and Icon */}
//         <div className="flex items-center truncate">
//           {isFolder ? (
//             <>
//               <svg viewBox="0 0 24 24" width="16" height="16" className={`mr-1 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`} fill="#c5c5c5"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>
//               <svg viewBox="0 0 24 24" width="16" height="16" className="mr-2 flex-shrink-0" fill={isOpen ? '#e8a87c' : '#c5c5c5'}><path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" /></svg>
//             </>
//           ) : (
//             <div style={{ marginLeft: '20px' }} className="flex items-center"><FileIcon filename={node.name} /></div>
//           )}
//           <span className="truncate text-sm">{node.name}</span>
//         </div>
        
//         {/* Hover Actions */}
//         <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
//           {isFolder && (
//             <>
//               <button onClick={(e) => { e.stopPropagation(); onCreateFile(node.path); }} title="New File" className="hover:text-white"><NewFileIcon /></button>
//               <button onClick={(e) => { e.stopPropagation(); onCreateFolder(node.path); }} title="New Folder" className="hover:text-white"><NewFolderIcon /></button>
//             </>
//           )}
//           <button onClick={(e) => { e.stopPropagation(); onDelete(node.path, isFolder); }} title="Delete" className="hover:text-red-500"><DeleteIcon /></button>
//         </div>
//       </div>

//       {isFolder && isOpen && (
//         <div>
//           {node.children.map(childNode => (
//             <TreeNode
//               key={childNode.path}
//               node={childNode}
//               onFileSelect={onFileSelect}
//               onDelete={onDelete}
//               onCreateFile={onCreateFile}
//               onCreateFolder={onCreateFolder}
//               activeFile={activeFile}
//               level={level + 1}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };


// const FileTree = ({ files, onFileSelect, activeFile, onCreateFile, onCreateFolder, onDelete }) => {
//   const fileTree = useMemo(() => buildFileTree(files), [files]);

//   return (
//     <div className="h-full w-full text-gray-300 flex flex-col">
//       <div className="flex items-center justify-between p-2">
//         <h2 className="text-xs font-bold uppercase tracking-wider">Explorer</h2>
//         <div className="flex items-center space-x-2">
//             <button onClick={() => onCreateFile('')} title="New File in Root" className="hover:text-white"><NewFileIcon /></button>
//             <button onClick={() => onCreateFolder('')} title="New Folder in Root" className="hover:text-white"><NewFolderIcon /></button>
//         </div>
//       </div>
//       <div className="flex-1 overflow-y-auto p-2">
//         {fileTree.length > 0 ? (
//           fileTree.map(node => (
//             <TreeNode
//               key={node.path}
//               node={node}
//               onFileSelect={onFileSelect}
//               onDelete={onDelete}
//               onCreateFile={onCreateFile}
//               onCreateFolder={onCreateFolder}
//               activeFile={activeFile}
//             />
//           ))
//         ) : (
//           <p className="px-4 text-gray-500 text-sm">No files yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FileTree;





// /*
//  * MERGED FINAL VERSION: src/components/file-explorer/FileTree.jsx
//  * ✅ Includes context menu, inline rename, root toolbar
//  * ✅ Clean + professional (like VS Code)
//  */
// import React, { useState, useMemo, useEffect, useRef } from 'react';
// import buildFileTree from './fileTreeUtils';
// import FileIcon from './FileIcon';

// // --- Context Menu Component ---
// const ContextMenu = ({ x, y, onAction, isFolder, onClose }) => {
//   const menuRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         onClose();
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [onClose]);

//   return (
//     <div
//       ref={menuRef}
//       className="absolute z-50 bg-gray-700 text-white rounded-md shadow-lg py-1 w-40"
//       style={{ top: y, left: x }}
//     >
//       {isFolder && (
//         <>
//           <div onClick={() => onAction('newFile')} className="px-4 py-1.5 text-sm hover:bg-blue-600 cursor-pointer">New File</div>
//           <div onClick={() => onAction('newFolder')} className="px-4 py-1.5 text-sm hover:bg-blue-600 cursor-pointer">New Folder</div>
//         </>
//       )}
//       <div onClick={() => onAction('rename')} className="px-4 py-1.5 text-sm hover:bg-blue-600 cursor-pointer">Rename</div>
//       <div className="border-t border-gray-600 my-1"></div>
//       <div onClick={() => onAction('delete')} className="px-4 py-1.5 text-sm hover:bg-red-600 cursor-pointer">Delete</div>
//     </div>
//   );
// };

// const TreeNode = ({ node, level = 0, ...handlers }) => {
//   const [isOpen, setIsOpen] = useState(true);
//   const [isRenaming, setIsRenaming] = useState(false);
//   const [renameValue, setRenameValue] = useState(node.name);
//   const [contextMenu, setContextMenu] = useState(null);
//   const inputRef = useRef(null);

//   const isFolder = node.type === 'folder';
//   const isActive = !isFolder && handlers.activeFile === node.path;

//   useEffect(() => {
//     if (isRenaming && inputRef.current) {
//       inputRef.current.focus();
//       inputRef.current.select();
//     }
//   }, [isRenaming]);

//   const handleRenameSubmit = () => {
//     if (renameValue && renameValue !== node.name) {
//       handlers.onRename(node.path, renameValue, isFolder);
//     }
//     setIsRenaming(false);
//   };

//   const handleContextMenu = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setContextMenu({ x: e.clientX, y: e.clientY });
//   };

//   const handleMenuAction = (action) => {
//     setContextMenu(null);
//     switch (action) {
//       case 'newFile': handlers.onCreateFile(node.path); break;
//       case 'newFolder': handlers.onCreateFolder(node.path); break;
//       case 'rename': setIsRenaming(true); break;
//       case 'delete': handlers.onDelete(node.path, isFolder); break;
//       default: break;
//     }
//   };

//   return (
//     <div>
//       <div
//         className={`flex items-center p-1 rounded-md cursor-pointer hover:bg-gray-700 ${isActive ? 'bg-blue-800' : ''}`}
//         style={{ paddingLeft: `${level * 16}px` }}
//         onClick={() => isFolder ? setIsOpen(!isOpen) : handlers.onFileSelect(node.path)}
//         onContextMenu={handleContextMenu}
//       >
//         {/* Arrow */}
//         {isFolder && (
//           <svg viewBox="0 0 24 24" width="16" height="16" className={`mr-1 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`} fill="#c5c5c5">
//             <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
//           </svg>
//         )}
//         {!isFolder && <div style={{ marginLeft: '20px' }} />}

//         {/* Folder / File Icon */}
//         {isFolder ? (
//           <svg viewBox="0 0 24 24" width="16" height="16" className="mr-2 flex-shrink-0" fill={isOpen ? '#e8a87c' : '#c5c5c5'}>
//             <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" />
//           </svg>
//         ) : (
//           <FileIcon filename={node.name} />
//         )}

//         {/* Name / Rename */}
//         {isRenaming ? (
//           <input
//             ref={inputRef}
//             type="text"
//             value={renameValue}
//             onChange={(e) => setRenameValue(e.target.value)}
//             onBlur={handleRenameSubmit}
//             onKeyDown={(e) => { if (e.key === 'Enter') handleRenameSubmit(); if (e.key === 'Escape') setIsRenaming(false); }}
//             className="bg-gray-900 text-white text-sm border border-blue-500 rounded px-1"
//             onClick={e => e.stopPropagation()}
//           />
//         ) : (
//           <span className="truncate text-sm">{node.name}</span>
//         )}
//       </div>

//       {isFolder && isOpen && node.children.map(child => (
//         <TreeNode key={child.path} node={child} level={level + 1} {...handlers} />
//       ))}

//       {contextMenu && (
//         <ContextMenu
//           x={contextMenu.x}
//           y={contextMenu.y}
//           onAction={handleMenuAction}
//           isFolder={isFolder}
//           onClose={() => setContextMenu(null)}
//         />
//       )}
//     </div>
//   );
// };

// const FileTree = (props) => {
//   const fileTree = useMemo(() => buildFileTree(props.files), [props.files]);

//   return (
//     <div className="h-full w-full text-gray-300 flex flex-col">
//       {/* Header + Root Actions */}
//       <div className="flex items-center justify-between p-2">
//         <h2 className="text-xs font-bold uppercase tracking-wider">Explorer</h2>
//         <div className="flex items-center space-x-2">
//           <button onClick={() => props.onCreateFile('')} title="New File in Root" className="hover:text-white">
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.41,9H15V15H13V11.41L9.41,15L8,13.59L11.59,10H9V9H13.41M20,8V20H4V4H12L14,2H4C2.9,2 2,2.9 2,4V20C2,21.1 2.9,22 4,22H20C21.1,22 22,21.1 22,20V8H20Z" /></svg>
//           </button>
//           <button onClick={() => props.onCreateFolder('')} title="New Folder in Root" className="hover:text-white">
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8A2,2 0 0,0 20,6M16,15H13V18H11V15H8V13H11V10H13V13H16V15Z" /></svg>
//           </button>
//         </div>
//       </div>

//       {/* File Tree */}
//       <div className="flex-1 overflow-y-auto p-2">
//         {fileTree.length > 0 ? (
//           fileTree.map(node => <TreeNode key={node.path} node={node} {...props} />)
//         ) : (
//           <p className="px-4 text-gray-500 text-sm">No files yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FileTree;




/*
 * FINAL VERSION: src/components/file-explorer/FileTree.jsx
 * ✅ Full VS Code–like File Explorer
 * ✅ Context menu (new file/folder, rename, delete)
 * ✅ Inline rename
 * ✅ Root toolbar (create file/folder at root)
 * ✅ Expand/collapse folders
 * ✅ Highlights active file
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import buildFileTree from './fileTreeUtils';
import FileIcon from './FileIcon';

// --- Context Menu ---
const ContextMenu = ({ x, y, onAction, isFolder, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-gray-800 text-white rounded-md shadow-lg py-1 w-40"
      style={{ top: y, left: x }}
    >
      {isFolder && (
        <>
          <div onClick={() => onAction('newFile')} className="px-4 py-1.5 text-sm hover:bg-blue-600 cursor-pointer">New File</div>
          <div onClick={() => onAction('newFolder')} className="px-4 py-1.5 text-sm hover:bg-blue-600 cursor-pointer">New Folder</div>
        </>
      )}
      <div onClick={() => onAction('rename')} className="px-4 py-1.5 text-sm hover:bg-blue-600 cursor-pointer">Rename</div>
      <div className="border-t border-gray-600 my-1"></div>
      <div onClick={() => onAction('delete')} className="px-4 py-1.5 text-sm hover:bg-red-600 cursor-pointer">Delete</div>
    </div>
  );
};

// --- Recursive Tree Node ---
const TreeNode = ({ node, level = 0, ...handlers }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(node.name);
  const [contextMenu, setContextMenu] = useState(null);
  const inputRef = useRef(null);

  const isFolder = node.type === 'folder';
  const isActive = !isFolder && handlers.activeFile === node.path;

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleRenameSubmit = () => {
    if (renameValue && renameValue !== node.name) {
      handlers.onRename(node.path, renameValue, isFolder);
    }
    setIsRenaming(false);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleMenuAction = (action) => {
    setContextMenu(null);
    switch (action) {
      case 'newFile': handlers.onCreateFile(node.path); break;
      case 'newFolder': handlers.onCreateFolder(node.path); break;
      case 'rename': setIsRenaming(true); break;
      case 'delete': handlers.onDelete(node.path, isFolder); break;
      default: break;
    }
  };

  return (
    <div>
      {/* Node Row */}
      <div
        className={`flex items-center p-1 rounded-md cursor-pointer hover:bg-gray-700 ${isActive ? 'bg-blue-800' : ''}`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={() => isFolder ? setIsOpen(!isOpen) : handlers.onFileSelect(node.path)}
        onContextMenu={handleContextMenu}
      >
        {/* Arrow */}
        {isFolder && (
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            className={`mr-1 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`}
            fill="#c5c5c5"
          >
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
          </svg>
        )}
        {!isFolder && <div style={{ marginLeft: '20px' }} />}

        {/* Folder / File Icon */}
        {isFolder ? (
          <svg viewBox="0 0 24 24" width="16" height="16" className="mr-2 flex-shrink-0" fill={isOpen ? '#e8a87c' : '#c5c5c5'}>
            <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" />
          </svg>
        ) : (
          <FileIcon filename={node.name} />
        )}

        {/* Name or Rename Input */}
        {isRenaming ? (
          <input
            ref={inputRef}
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameSubmit();
              if (e.key === 'Escape') setIsRenaming(false);
            }}
            className="bg-gray-900 text-white text-sm border border-blue-500 rounded px-1"
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className="truncate text-sm">{node.name}</span>
        )}
      </div>

      {/* Children */}
      {isFolder && isOpen && node.children.map(child => (
        <TreeNode key={child.path} node={child} level={level + 1} {...handlers} />
      ))}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAction={handleMenuAction}
          isFolder={isFolder}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

// --- FileTree Root ---
const FileTree = ({ files, ...handlers }) => {
  const fileTree = useMemo(() => buildFileTree(files), [files]);

  return (
    <div className="h-full w-full text-gray-300 flex flex-col select-none">
      {/* Header + Root Actions */}
      <div className="flex items-center justify-between p-2">
        <h2 className="text-xs font-bold uppercase tracking-wider">Explorer</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlers.onCreateFile('')}
            title="New File in Root"
            className="hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.41,9H15V15H13V11.41L9.41,15L8,13.59L11.59,10H9V9H13.41M20,8V20H4V4H12L14,2H4C2.9,2 2,2.9 2,4V20C2,21.1 2.9,22 4,22H20C21.1,22 22,21.1 22,20V8H20Z" />
            </svg>
          </button>
          <button
            onClick={() => handlers.onCreateFolder('')}
            title="New Folder in Root"
            className="hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8A2,2 0 0,0 20,6M16,15H13V18H11V15H8V13H11V10H13V13H16V15Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {fileTree.length > 0 ? (
          fileTree.map(node => <TreeNode key={node.path} node={node} {...handlers} />)
        ) : (
          <p className="px-4 text-gray-500 text-sm">No files yet.</p>
        )}
      </div>
    </div>
  );
};

export default FileTree;
 