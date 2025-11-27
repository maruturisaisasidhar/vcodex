// import React from 'react';
// import { Route, Switch, Redirect } from 'react-router-dom';
// import { useAuth } from './context/useAuth';

// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import DashboardPage from './pages/DashboardPage';
// import EditorPage from './pages/EditorPage';
// import ProfilePage from './pages/ProfilePage';

// const ProtectedRoute = ({ children, ...rest }) => {
//   const { currentUser } = useAuth();
//   return (
//     <Route
//       {...rest}
//       render={() => {
//         return currentUser ? children : <Redirect to="/login" />;
//       }}
//     />
//   );
// };

// function App() {
//   const { currentUser } = useAuth();

//   return (
//     <Switch>
//       <Route exact path="/" component={HomePage} />
//       <Route exact path="/login">
//         {currentUser ? <Redirect to="/dashboard" /> : <LoginPage />}
//       </Route>
      
//       {/* ADDED: This is the new public route for the guest editor */}
//       <Route exact path="/editor" component={EditorPage} />
      
//       <ProtectedRoute exact path="/dashboard">
//         <DashboardPage />
//       </ProtectedRoute>
//       <ProtectedRoute path="/editor/:projectId">
//         <EditorPage />
//       </ProtectedRoute>
//       <ProtectedRoute exact path="/profile">
//         <ProfilePage />
//       </ProtectedRoute>      
//       <Redirect to="/" />
//     </Switch>
//   );
// }

// export default App;




// src/App.jsx

import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useAuth } from './context/useAuth';

// --- Page Imports ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import ProfilePage from './pages/ProfilePage';
import ExamDashboardPage from './pages/ExamDashboardPage';
import FacultyDashboardPage from './pages/FacultyDashboardPage';
import ExamPage from './pages/ExamPage';

// ✨ NEW: Import the faculty authentication pages
import FacultyLoginPage from './pages/FacultyLoginPage';
import FacultySetupPage from './pages/FacultySetupPage';
import FacultyForgotPasswordPage from './pages/FacultyForgotPasswordPage';


// ✨ UPDATED: ProtectedRoute now checks for roles
const ProtectedRoute = ({ children, role, ...rest }) => {
  const { currentUser, userRole, authLoading } = useAuth();

  return (
    <Route
      {...rest}
      render={() => {
        if (authLoading) {
          // Show a loading screen while auth state is being determined
          return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
        }

        if (!currentUser) {
          // If not logged in, redirect to login
          return <Redirect to="/login" />;
        }
        
        if (role && userRole !== role) {
          // If a role is required and the user's role doesn't match, redirect
          return <Redirect to="/dashboard" />;
        }

        // If all checks pass, render the component
        return children;
      }}
    />
  );
};

function App() {
  const { currentUser } = useAuth();

  return (
    <Switch>
      {/* --- Public Routes --- */}
      <Route exact path="/" component={HomePage} />
      <Route exact path="/login">
        {currentUser ? <Redirect to="/dashboard" /> : <LoginPage />}
      </Route>
      <Route exact path="/editor" component={EditorPage} />
    
      {/* ✨ NEW: Public routes for the faculty login flow */}
      <Route exact path="/faculty-login" component={FacultyLoginPage} />
      <Route exact path="/faculty-setup" component={FacultySetupPage} />
      <Route exact path="/faculty-forgot-password" component={FacultyForgotPasswordPage} />
      
      
      {/* --- Protected Routes --- */}
      <ProtectedRoute exact path="/dashboard">
        <DashboardPage />
      </ProtectedRoute>
      <ProtectedRoute path="/editor/:projectId">
        <EditorPage />
      </ProtectedRoute>
      <ProtectedRoute exact path="/profile">
        <ProfilePage />
      </ProtectedRoute>
      
      <ProtectedRoute exact path="/exam-dashboard">
        <ExamDashboardPage />
      </ProtectedRoute>
      
      {/* ✨ UPDATED: This route is now secured and only accessible to faculty */}
      <ProtectedRoute exact path="/faculty-dashboard" role="faculty">
        <FacultyDashboardPage />
      </ProtectedRoute>

      <ProtectedRoute path="/exam/:examId/:submissionId">
        <ExamPage />
      </ProtectedRoute>
      
      <Redirect to="/" />
    </Switch>
  );
}

export default App;