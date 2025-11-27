import React, { useState } from 'react';
import AiPanel from '../panels/AiPanel';

const AiBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  // We'll add dragging logic later if needed. For now, it's a fixed bubble.

  return (
    <>
      {/* The Bubble */}
      <div
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg transform hover:scale-110 transition-transform"
        onClick={() => setIsOpen(true)}
      >
        <span className="text-2xl animate-pulse">✨</span>
      </div>

      {/* The Modal-like Chat Window */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)} // Close when clicking the backdrop
        >
          <div
            className="absolute bottom-28 right-8 w-96 h-[500px] bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700 flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <AiPanel />
          </div>
        </div>
      )}
    </>
  );
};

export default AiBubble;