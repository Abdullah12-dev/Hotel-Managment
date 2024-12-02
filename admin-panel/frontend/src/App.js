import React, { useState, useEffect, useMemo } from 'react';
import { 
  createBrowserRouter, 
  RouterProvider, 
  Route, 
  createRoutesFromElements, 
  Navigate,
  Outlet 
} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import StaffManagement from './components/StaffManagement';
import RootLayout from './components/RootLayout'; // New component for layout

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated, loading }) => {
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated 
    ? children 
    : <Navigate to="/login" replace />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const checkToken = () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000);

          if (decodedToken.exp && decodedToken.exp < currentTime) {
            setIsAuthenticated(false);
            localStorage.removeItem('token');
          } else {
            setIsAuthenticated(true);
            setUserInfo({
              userId: decodedToken.userId,
              name: decodedToken.name,
            });
          }
        } catch (error) {
          console.error('Invalid Token:', error);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkToken();

    window.addEventListener('storage', checkToken);

    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, []);

  // Memoize router to prevent unnecessary re-renders
  const router = useMemo(() => 
    createBrowserRouter(
      createRoutesFromElements(
        <Route path="/" element={<RootLayout />}>
          {/* Root redirect */}
          <Route 
            index 
            element={
              loading ? <div>Loading...</div> : 
              (isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />)
            } 
          />
          
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={<Login setAuth={setIsAuthenticated} />} 
          />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Dashboard Routes */}
          <Route 
              path="/dashboard/staff-management" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                  <StaffManagement />
                </ProtectedRoute>
              } 
            >
            {/* Nested dashboard routes */}
            <Route 
              path="/dashboard/staff-management" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                  <StaffManagement />
                </ProtectedRoute>
              } 
            />
            {/* You can add more nested routes here */}
          </Route>
        </Route>
      )
    ), [isAuthenticated, loading, userInfo]
  );

  return <RouterProvider router={router} />;
};

export default App;