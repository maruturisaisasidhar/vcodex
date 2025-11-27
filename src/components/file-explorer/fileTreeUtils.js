/*
* 1. NEW FILE: src/components/file-explorer/fileTreeUtils.js
*
* ✅ FIX: Changed from a named export to a default export to ensure
* compatibility with your project's build setup.
*/
const buildFileTree = (files) => {
  if (!files || Object.keys(files).length === 0) return [];

  const root = [];
  const nodeMap = {}; // Helper to quickly find nodes by their path

  // Sort paths alphabetically to ensure consistent order
  const sortedPaths = Object.keys(files).sort();

  sortedPaths.forEach(path => {
    const parts = path.split('/');
    let currentLevel = root;
    let currentPath = '';

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      let node = nodeMap[currentPath];

      if (!node) {
        const isFolder = index < parts.length - 1;
        node = {
          name: part,
          path: currentPath,
          type: isFolder ? 'folder' : 'file',
          // Add a children array for folders immediately
          ...(isFolder && { children: [] }),
        };

        nodeMap[currentPath] = node;
        currentLevel.push(node);
      }
      
      if (node.type === 'folder') {
        currentLevel = node.children;
      }
    });
  });

  return root;
};

export default buildFileTree;