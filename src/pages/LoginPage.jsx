// import React, { useState, useEffect } from 'react';
// // 1. Import useHistory instead of useNavigate
// import { useHistory } from 'react-router-dom';
// import { auth } from '../firebase/config';
// import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
// import Avatar from '../components/ui/Avatar';

// const LoginPage = () => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   // 2. Get the history object from the useHistory hook
//   const history = useHistory();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setIsLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleGoogleSignIn = async () => {
//     const provider = new GoogleAuthProvider();
//     try {
//       await signInWithPopup(auth, provider);
//       // 3. Use history.push() to navigate
//       history.push('/dashboard'); 
//     } catch (error) {
//       console.error("Error during sign-in:", error);
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       // 4. Use history.push() here as well
//       history.push('/'); 
//     } catch (error) {
//       console.error("Error during sign-out:", error);
//     }
//   };

//   const renderContent = () => {
//     if (isLoading) {
//       return <p className="text-xl">Authenticating...</p>;
//     }

//     if (user) {
//       return (
//         <div className="text-center bg-gray-800/50 p-8 rounded-lg border border-gray-700 shadow-xl">
//           <h2 className="text-2xl mb-4">Welcome back, {user.displayName}!</h2>
//           <Avatar src={user.photoURL} alt={user.displayName} size="lg" />
//           <p className="text-gray-400 mt-2 mb-6">{user.email}</p>
//           <div className="flex gap-4">
//             {/* 5. And finally, update the button's onClick */}
//             <button onClick={() => history.push('/dashboard')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg">
//               Go to Dashboard
//             </button>
//             <button onClick={handleSignOut} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg">
//               Sign Out
//             </button>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <button
//         onClick={handleGoogleSignIn}
//         className="bg-white text-gray-800 font-semibold py-3 px-8 rounded-lg flex items-center space-x-3 hover:bg-gray-200 transition-all transform hover:scale-105"
//       >
//         <svg className="w-6 h-6" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
//         <span>Sign In with Google</span>
//       </button>
//     );
//   };

//   return (
//     <div className="min-h-screen w-full bg-gray-900 text-white flex items-center justify-center p-4">
//       {/* Background Glow Effect */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] bg-blue-900/40 rounded-full filter blur-3xl opacity-60"></div>
//       <div className="z-10">
//         {renderContent()}
//       </div>
//     </div>
//   );
// };

// export default LoginPage;






/*
* 2. UPDATED FILE: src/pages/LoginPage.jsx
*
* ✅ FIX: The logic to create the user's document in Firestore has been moved here.
* It now runs once, immediately after a successful Google sign-in.
*/
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebase/config';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import Avatar from '../components/ui/Avatar';
// Step 1: Import the hook that contains our database function.
import { useFileSystem } from '../hooks/useFileSystem';

const LoginPage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  // Step 2: Get the manageUserDocument function from our hook.
  const { manageUserDocument } = useFileSystem();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Step 3: After a successful sign-in, get the user object...
      const loggedInUser = result.user;
      
      // ...and call the function to ensure their document exists in Firestore.
      if (loggedInUser) {
        await manageUserDocument(loggedInUser);
      }
      
      // Step 4: Now, navigate to the dashboard.
      history.push('/dashboard'); 
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      history.push('/'); 
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-xl">Authenticating...</p>;
    }

    if (user) {
      return (
        <div className="text-center bg-gray-800/50 p-8 rounded-lg border border-gray-700 shadow-xl">
          <h2 className="text-2xl mb-4">Welcome back, {user.displayName}!</h2>
          <Avatar src={user.photoURL} alt={user.displayName} size="lg" />
          <p className="text-gray-400 mt-2 mb-6">{user.email}</p>
          <div className="flex gap-4">
            <button onClick={() => history.push('/dashboard')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg">
              Go to Dashboard
            </button>
            <button onClick={handleSignOut} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg">
              Sign Out
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={handleGoogleSignIn}
        className="bg-white text-gray-800 font-semibold py-3 px-8 rounded-lg flex items-center space-x-3 hover:bg-gray-200 transition-all transform hover:scale-105"
      >
        <svg className="w-6 h-6" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
        <span>Sign In with Google</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex items-center justify-center p-4">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] bg-blue-900/40 rounded-full filter blur-3xl opacity-60"></div>
      <div className="z-10">
        {renderContent()}
      </div>
    </div>
  );
};

export default LoginPage;







