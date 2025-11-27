// // src/pages/FacultyLoginPage.jsx

// import React, { useState, useContext } from 'react';
// import { useHistory, Link } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { verifyFacultyId } from '../api/userService';

// const FacultyLoginPage = () => {
//     const [facultyId, setFacultyId] = useState('');
//     const [password, setPassword] = useState('');
//     const [facultyData, setFacultyData] = useState(null); // Will hold verified faculty data
//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     const { facultyLogin } = useContext(AuthContext);
//     const history = useHistory();

//     const handleVerifyId = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError('');
//         try {
//             const data = await verifyFacultyId(facultyId);
//             if (data) {
//                 setFacultyData(data); // ID is valid, store the data
//             } else {
//                 setError('Invalid Faculty ID. Please try again.');
//             }
//         } catch (err) {
//             setError('An error occurred during verification.',err);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError('');

//         // Check if this is a first-time setup
//         if (!facultyData.vcodex_uid) {
//             // Redirect to the setup page, passing the verified data along
//             history.push({
//                 pathname: '/faculty-setup',
//                 state: { facultyData: facultyData }
//             });
//             return;
//         }

//         // This is a regular login attempt
//         try {
//             await facultyLogin(facultyData.email, password);
//             history.push('/faculty-dashboard'); // Redirect to faculty dashboard on success
//         } catch (err) {
//             setError('Login failed. Please check your password.',err);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//             <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
//                 <div>
//                     <h2 className="text-center text-3xl font-extrabold text-white">
//                         Faculty Portal Login
//                     </h2>
//                 </div>
                
//                 {/* Conditionally render the correct form step */}
//                 {!facultyData ? (
//                     // STEP 1: Verify Faculty ID
//                     <form className="mt-8 space-y-6" onSubmit={handleVerifyId}>
//                         <div>
//                             <label htmlFor="faculty-id" className="block text-sm font-medium text-gray-300">
//                                 Faculty ID
//                             </label>
//                             <input
//                                 id="faculty-id"
//                                 name="facultyId"
//                                 type="text"
//                                 required
//                                 value={facultyId}
//                                 onChange={(e) => setFacultyId(e.target.value)}
//                                 className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-blue-500"
//                                 placeholder="e.g., VIGNAN-CSE-001"
//                             />
//                         </div>
//                         <button
//                             type="submit"
//                             disabled={isLoading}
//                             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500"
//                         >
//                             {isLoading ? 'Verifying...' : 'Verify ID'}
//                         </button>
//                     </form>
//                 ) : (
//                     // STEP 2: Enter Password
//                     <div>
//                         <div className="text-center p-4 mb-4 bg-gray-700 rounded-md">
//                             <p className="text-sm text-gray-400">Welcome</p>
//                             <p className="font-bold text-lg text-white">{facultyData.name}</p>
//                             <p className="text-xs text-gray-500">{facultyData.email}</p>
//                         </div>
//                         <form className="mt-8 space-y-6" onSubmit={handleLogin}>
//                              <div>
//                                 <label htmlFor="password" className="block text-sm font-medium text-gray-300">
//                                     Password
//                                 </label>
//                                 <input
//                                     id="password"
//                                     name="password"
//                                     type="password"
//                                     required
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-blue-500"
//                                 />
//                             </div>
//                             <div className="text-sm text-right">
//                                 <Link to="/faculty-forgot-password" className="font-medium text-blue-400 hover:text-blue-300">
//                                     Forgot your password?
//                                 </Link>
//                             </div>
//                             <button
//                                 type="submit"
//                                 disabled={isLoading}
//                                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500"
//                             >
//                                 {isLoading ? 'Logging In...' : 'Login'}
//                             </button>
//                         </form>
//                     </div>
//                 )}

//                 {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
//                  <p className="mt-2 text-center text-sm text-gray-500">
//                     Not a faculty member?{' '}
//                     <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
//                         Go to Student Login
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// };




// export default FacultyLoginPage;






// src/pages/FacultyLoginPage.jsx

import React, { useState, useContext, useEffect, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { verifyFacultyId } from '../api/userService';

const FacultyLoginPage = () => {
    const [facultyId, setFacultyId] = useState('');
    const [password, setPassword] = useState('');
    const [facultyData, setFacultyData] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { facultyLogin } = useContext(AuthContext);
    const history = useHistory();

    // ✅ FIX: Add a ref to track if the component is mounted to prevent memory leaks.
    const isMounted = useRef(true);
    useEffect(() => {
        // This function runs when the component unmounts.
        return () => {
            isMounted.current = false;
        };
    }, []); // The empty array ensures this effect only runs on mount and unmount.

    const handleVerifyId = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const data = await verifyFacultyId(facultyId);
            // Check if the component is still mounted before updating state.
            if (isMounted.current) {
                if (data) {
                    setFacultyData(data);
                } else {
                    setError('Invalid Faculty ID. Please try again.');
                }
            }
        } catch (err) {
            if (isMounted.current) {
                setError('An error occurred during verification.');
            }
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!facultyData.vcodex_uid) {
            history.push({
                pathname: '/faculty-setup',
                state: { facultyData: facultyData }
            });
            return;
        }

        try {
            await facultyLogin(facultyData.email, password);
            // ✅ FIX: Always redirect to the main /dashboard.
            // This allows the AuthProvider to load the user's role before routing.
            history.push('/dashboard');
        } catch (err) {
            if (isMounted.current) {
                setError('Login failed. Please check your password.');
            }
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-white">
                        Faculty Portal Login
                    </h2>
                </div>
                
                {!facultyData ? (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifyId}>
                        <div>
                            <label htmlFor="faculty-id" className="block text-sm font-medium text-gray-300">
                                Faculty ID
                            </label>
                            <input
                                id="faculty-id"
                                name="facultyId"
                                type="text"
                                required
                                value={facultyId}
                                onChange={(e) => setFacultyId(e.target.value)}
                                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-blue-500"
                                placeholder="e.g., VIGNAN-CSE-001"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500"
                        >
                            {isLoading ? 'Verifying...' : 'Verify ID'}
                        </button>
                    </form>
                ) : (
                    <div>
                        <div className="text-center p-4 mb-4 bg-gray-700 rounded-md">
                            <p className="text-sm text-gray-400">Welcome</p>
                            <p className="font-bold text-lg text-white">{facultyData.name}</p>
                            <p className="text-xs text-gray-500">{facultyData.email}</p>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                             <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-blue-500"
                                />
                            </div>
                            <div className="text-sm text-right">
                                <Link to="/faculty-forgot-password" className="font-medium text-blue-400 hover:text-blue-300">
                                    Forgot your password?
                                </Link>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500"
                            >
                                {isLoading ? 'Logging In...' : 'Login'}
                            </button>
                        </form>
                    </div>
                )}

                {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
                 <p className="mt-2 text-center text-sm text-gray-500">
                    Not a faculty member?{' '}
                    <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
                        Go to Student Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default FacultyLoginPage;