import React from 'react';
import { FileIcon as ReactFileIcon, defaultStyles } from 'react-file-icon';

const FileIcon = ({ filename }) => {
  const extension = filename.split('.').pop().toLowerCase();

  // The library provides default styles that we can spread.
  const iconStyles = defaultStyles[extension] || {};

  return (
    <div className="w-4 h-4 mr-2 flex-shrink-0">
      <ReactFileIcon
        extension={extension}
        {...iconStyles}
      />
    </div>
  );
};

export default FileIcon;