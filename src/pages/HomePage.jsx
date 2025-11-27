// import React from 'react';
// import { Link } from 'react-router-dom';

// const HomePage = () => {
//   return (
//     <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center p-4 overflow-hidden">
//       {/* Background Glow Effect */}
//       <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-blue-600/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
//       <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-purple-600/30 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>

//       <div className="text-center z-10">
//         <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
//           V-CodeX
//         </h1>
//         <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto">
//           The intelligent, collaborative cloud IDE.
//           Reimagined with AI, voice, and gesture control.
//         </p>
//         <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
//           <Link
//             to="/editor"
//             className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
//           >
//             Go to Editor
//           </Link>
//           <Link
//             to="/login"
//             className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
//           >
//             Login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;




// src/pages/HomePage.jsx

// import React from 'react';
// import { Link } from 'react-router-dom';

// const HomePage = () => {
//   return (
//     <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center p-4 overflow-hidden">
//       {/* Background Glow Effect */}
//       <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-blue-600/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
//       <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-purple-600/30 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>

//       <div className="text-center z-10">
//         <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
//           V-CodeX
//         </h1>
//         <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto">
//           The intelligent, collaborative cloud IDE.
//           Reimagined with AI, voice, and gesture control.
//         </p>
//         <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
//           <Link
//             to="/editor"
//             className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
//           >
//             Go to Editor
//           </Link>
//           <Link
//             to="/login"
//             className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
//           >
//             Student Login
//           </Link>
//         </div>
        
//         {/* ✨ NEW: Link for the faculty portal */}
//         <div className="mt-10">
//             <Link to="/faculty-login" className="text-sm text-gray-500 hover:text-blue-400 hover:underline">
//                 Are you a faculty member? Login here.
//             </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;



// src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* ✨ RESTORED: Background Glow Effects */}
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-blue-600/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-purple-600/30 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>

      <div className="text-center z-10">
        {/* ✨ RESTORED: Gradient Title */}
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
          V-CodeX
        </h1>
        {/* ✨ RESTORED: Subtitle */}
        <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto">
          The intelligent, collaborative cloud IDE.
          Reimagined with AI, voice, and gesture control.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/editor"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
          >
            Go to Editor
          </Link>
          <Link
            to="/login"
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
          >
            {/* ✨ UPDATED: Text changed for clarity */}
            Student Login
          </Link>
        </div>
        
        {/* ✨ NEW: Link for the faculty portal, styled consistently */}
        <div className="mt-10">
            <Link to="/faculty-login" className="text-sm text-gray-500 hover:text-blue-400 hover:underline">
                Are you a faculty member? Login here.
            </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;