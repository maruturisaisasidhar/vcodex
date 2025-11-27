

// // src/pages/FacultySetupPage.jsx

// import React, { useState, useContext } from 'react';
// import { useHistory, useLocation, Redirect } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { linkFacultyAccount } from '../api/userService';
// import { doc, setDoc } from 'firebase/firestore';
// import { db } from '../firebase/config';

// const FacultySetupPage = () => {
//     // ✨ NEW: State to manage the email input
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     const { setupFacultyPassword } = useContext(AuthContext);
//     const history = useHistory();
//     const location = useLocation();
    
//     const facultyData = location.state?.facultyData;

//     if (!facultyData) {
//         return <Redirect to="/faculty-login" />;
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (password !== confirmPassword) {
//             return setError("Passwords do not match.");
//         }
//         setIsLoading(true);
//         setError('');

//         try {
//             // Step 1: Create the user in Firebase Authentication using the NEW email
//             const userCredential = await setupFacultyPassword(email, password);
//             const newUser = userCredential.user;

//             // Step 2: Create their document in the 'users' collection with the NEW email
//             const userRef = doc(db, 'users', newUser.uid);
//             await setDoc(userRef, {
//                 uid: newUser.uid,
//                 email: email, // Use the email from the form
//                 name: facultyData.name,
//                 role: 'student', // Start with student, will be promoted next
//                 createdAt: new Date(),
//             });

//             // Step 3: Link the accounts and promote the role to 'faculty'
//             await linkFacultyAccount(facultyData.id, newUser.uid);

//             history.push('/faculty-dashboard');

//         } catch (err) {
//              if (err.code === 'auth/email-already-in-use') {
//                 setError('This email is already in use by another account.');
//             } else {
//                 setError('Failed to create account. Please try again.');
//             }
//             console.error(err);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//             <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
//                 <div className="text-center">
//                     <h2 className="text-3xl font-extrabold text-white">Faculty Account Setup</h2>
//                     <p className="mt-2 text-gray-400">Welcome, <span className="font-bold text-white">{facultyData.name}</span>. Set up your account to continue.</p>
//                 </div>
                
//                 <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//                     {/* ✨ NEW: Email input field */}
//                     <div>
//                         <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
//                         <input
//                             id="email"
//                             type="email"
//                             required
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-blue-500"
//                             placeholder="Enter your official email"
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="password"className="block text-sm font-medium text-gray-300">New Password</label>
//                         <input
//                             id="password"
//                             type="password"
//                             required
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-blue-500"
//                         />
//                     </div>
//                      <div>
//                         <label htmlFor="confirm-password"className="block text-sm font-medium text-gray-300">Confirm Password</label>
//                         <input
//                             id="confirm-password"
//                             type="password"
//                             required
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-blue-500"
//                         />
//                     </div>
//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500"
//                     >
//                         {isLoading ? 'Setting Up...' : 'Create Account & Login'}
//                     </button>
//                 </form>

//                 {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
//             </div>
//         </div>
//     );
// };

// export default FacultySetupPage;




// // src/pages/FacultySetupPage.jsx

// import React, { useState, useContext } from 'react';
// import { useHistory, useLocation, Redirect } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { linkFacultyAccount } from '../api/userService';
// import { doc, setDoc } from 'firebase/firestore';
// import { db, app } from '../firebase/config'; // Import 'app' for functions
// import { getFunctions, httpsCallable } from 'firebase/functions';

// // Initialize Firebase Functions
// const functions = getFunctions(app);
// const sendOtp = httpsCallable(functions, 'sendVerificationOtp');
// const verifyOtpFunc = httpsCallable(functions, 'verifyOtp');

// const FacultySetupPage = () => {
//     // State to manage the multi-step form process
//     const [step, setStep] = useState('enterEmail'); // 'enterEmail', 'enterOtp', 'setPassword'
    
//     const [email, setEmail] = useState('');
//     const [otp, setOtp] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
    
//     const [error, setError] = useState('');
//     const [message, setMessage] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     const { setupFacultyPassword } = useContext(AuthContext);
//     const history = useHistory();
//     const location = useLocation();
    
//     const facultyData = location.state?.facultyData;

//     if (!facultyData) {
//         return <Redirect to="/faculty-login" />;
//     }

//     const handleSendOtp = async () => {
//         if (!email) return setError("Please enter an email address.");
//         setIsLoading(true);
//         setError('');
//         setMessage('');
//         try {
//             const result = await sendOtp({ email });
//             setMessage(result.data.message);
//             setStep('enterOtp');
//         } catch (err) {
//             setError(err.message || "Failed to send OTP. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleVerifyOtp = async () => {
//         if (!otp) return setError("Please enter the OTP.");
//         setIsLoading(true);
//         setError('');
//         setMessage('');
//         try {
//             const result = await verifyOtpFunc({ email, otp });
//             setMessage(result.data.message);
//             setStep('setPassword');
//         } catch (err) {
//             setError(err.message || "OTP verification failed.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleFinalSubmit = async (e) => {
//         e.preventDefault();
//         if (password !== confirmPassword) return setError("Passwords do not match.");
//         setIsLoading(true);
//         setError('');

//         try {
//             const userCredential = await setupFacultyPassword(email, password);
//             const newUser = userCredential.user;

//             // ✅ FIX: Create the user with the correct role from the start
//             const userRef = doc(db, 'users', newUser.uid);
//             await setDoc(userRef, {
//                 uid: newUser.uid,
//                 email: email,
//                 name: facultyData.name,
//                 role: 'faculty', // Assign the correct role immediately
//                 createdAt: new Date(),
//             });

//             // ✅ FIX: Call the simplified link function
//             await linkFacultyAccount(facultyData.id, newUser.uid);

//             history.push('/faculty-dashboard');

//         } catch (err) {
//             setError('Failed to create account. This email may already be in use.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//             <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
//                 <div className="text-center">
//                     <h2 className="text-3xl font-extrabold text-white">Faculty Account Setup</h2>
//                     <p className="mt-2 text-gray-400">Welcome, <span className="font-bold text-white">{facultyData.name}</span>.</p>
//                 </div>
                
//                 {/* Step 1: Enter Email */}
//                 {step === 'enterEmail' && (
//                      <div>
//                         <p className="text-center text-sm text-gray-300 mb-4">Please enter your official email address to receive a verification code.</p>
//                         <div className="flex gap-2">
//                             <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-grow bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white" placeholder="your.email@college.edu" />
//                             <button onClick={handleSendOtp} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md disabled:bg-gray-500">{isLoading ? '...' : 'Send OTP'}</button>
//                         </div>
//                     </div>
//                 )}

//                 {/* Step 2: Enter OTP */}
//                 {step === 'enterOtp' && (
//                      <div>
//                         <p className="text-center text-sm text-gray-300 mb-4">Enter the 6-digit code sent to <span className="font-bold text-white">{email}</span>.</p>
//                         <div className="flex gap-2">
//                             <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" required className="flex-grow bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white text-center tracking-widest" placeholder="_ _ _ _ _ _" />
//                             <button onClick={handleVerifyOtp} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md disabled:bg-gray-500">{isLoading ? '...' : 'Verify'}</button>
//                         </div>
//                     </div>
//                 )}

//                 {/* Step 3: Set Password */}
//                 {step === 'setPassword' && (
//                     <form className="space-y-4" onSubmit={handleFinalSubmit}>
//                          <p className="text-center text-sm text-green-400 font-bold">Email Verified! Now, create your password.</p>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-300">New Password</label>
//                             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white" />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
//                             <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white" />
//                         </div>
//                         <button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500">{isLoading ? 'Creating...' : 'Create Account & Login'}</button>
//                     </form>
//                 )}

//                 {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
//                 {message && !error && <p className="mt-4 text-center text-sm text-green-400">{message}</p>}
//             </div>
//         </div>
//     );
// };

// export default FacultySetupPage;











// src/pages/FacultySetupPage.jsx

import React, { useState, useContext } from 'react';
import { useHistory, useLocation, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { linkFacultyAccount } from '../api/userService';
import { doc, setDoc } from 'firebase/firestore';
import { db, app } from '../firebase/config'; // Import 'app' to initialize Functions
import { getFunctions, httpsCallable } from 'firebase/functions';

// Initialize the Firebase Functions service to communicate with our backend
const functions = getFunctions(app);
// Create secure callable references to our cloud functions
const sendOtp = httpsCallable(functions, 'sendVerificationOtp');
const verifyOtpFunc = httpsCallable(functions, 'verifyOtp');

const FacultySetupPage = () => {
    // This state variable controls which part of the form is visible
    const [step, setStep] = useState('enterEmail'); // 'enterEmail', 'enterOtp', 'setPassword'
    
    // State for all the form inputs
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // State for UI feedback
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { setupFacultyPassword } = useContext(AuthContext);
    const history = useHistory();
    const location = useLocation();
    
    // Get the verified faculty data that was passed from the FacultyLoginPage
    const facultyData = location.state?.facultyData;

    // Security check: If a user lands here without verified data, send them back to login.
    if (!facultyData) {
        return <Redirect to="/faculty-login" />;
    }

    // --- Step 1: Handle sending the OTP to the user's email ---
    const handleSendOtp = async () => {
        if (!email) return setError("Please enter an email address.");
        setIsLoading(true);
        setError('');
        setMessage('');
        try {
            // Call our secure backend function
            const result = await sendOtp({ email });
            setMessage(result.data.message);
            // Move to the next step in the form
            setStep('enterOtp');
        } catch (err) {
            setError(err.message || "Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Step 2: Handle verification of the OTP ---
    const handleVerifyOtp = async () => {
        if (!otp) return setError("Please enter the OTP.");
        setIsLoading(true);
        setError('');
        setMessage('');
        try {
            // Call our secure backend function to check the OTP
            const result = await verifyOtpFunc({ email, otp });
            setMessage(result.data.message);
            // On success, move to the final step
            setStep('setPassword');
        } catch (err) {
            setError(err.message || "OTP verification failed.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Step 3: Handle the final account creation ---
    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return setError("Passwords do not match.");
        setIsLoading(true);
        setError('');

        try {
            // Create the user in Firebase Authentication
            const userCredential = await setupFacultyPassword(email, password);
            const newUser = userCredential.user;

            // Create their document in the 'users' collection with the 'faculty' role
            const userRef = doc(db, 'users', newUser.uid);
            await setDoc(userRef, {
                uid: newUser.uid,
                email: email,
                name: facultyData.name,
                role: 'faculty', // Assign the correct role immediately
                createdAt: new Date(),
            });

            // Link this new account to their pre-approved faculty profile
            await linkFacultyAccount(facultyData.id, newUser.uid);

            // Redirect them to their dashboard
            history.push('/faculty-dashboard');

        } catch (err) {
            setError('Failed to create account. This email may already be in use.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-white">Faculty Account Setup</h2>
                    <p className="mt-2 text-gray-400">Welcome, <span className="font-bold text-white">{facultyData.name}</span>.</p>
                </div>
                
                {/* Conditionally render the correct part of the form based on the 'step' state */}
                
                {step === 'enterEmail' && (
                     <div>
                        <p className="text-center text-sm text-gray-300 mb-4">Please enter your official email address to receive a verification code.</p>
                        <div className="flex gap-2">
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-grow bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white" placeholder="your.email@college.edu" />
                            <button onClick={handleSendOtp} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md disabled:bg-gray-500">{isLoading ? '...' : 'Send OTP'}</button>
                        </div>
                    </div>
                )}

                {step === 'enterOtp' && (
                     <div>
                        <p className="text-center text-sm text-gray-300 mb-4">Enter the 6-digit code sent to <span className="font-bold text-white">{email}</span>.</p>
                        <div className="flex gap-2">
                            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" required className="flex-grow bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white text-center tracking-widest" placeholder="_ _ _ _ _ _" />
                            <button onClick={handleVerifyOtp} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md disabled:bg-gray-500">{isLoading ? '...' : 'Verify'}</button>
                        </div>
                    </div>
                )}

                {step === 'setPassword' && (
                    <form className="space-y-4" onSubmit={handleFinalSubmit}>
                         <p className="text-center text-sm text-green-400 font-bold">Email Verified! Now, create your password.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">New Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white" />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500">{isLoading ? 'Creating...' : 'Create Account & Login'}</button>
                    </form>
                )}

                {/* Display feedback messages to the user */}
                {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
                {message && !error && <p className="mt-4 text-center text-sm text-green-400">{message}</p>}
            </div>
        </div>
    );
};

export default FacultySetupPage;