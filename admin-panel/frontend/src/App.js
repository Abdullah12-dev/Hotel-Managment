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
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import StaffManagement from './Pages/StaffManagement';
import RootLayout from './Pages/RootLayout'; // New component for layout
import AssignRole from './Pages/AssignRole';
import RoomManagement from './Pages/RoomManagement';
import ServiceManagement from './Pages/ServiceManagement';
import BookingHistory from './Pages/BookingHistory';
import SystemLogs from './Pages/SystemLogs';

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

  const router = useMemo(() => 
    createBrowserRouter([
      {
        path: '/',
        element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />,
      },
      {
        path: '/login',
        element: <Login setAuth={setIsAuthenticated} />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/dashboard',
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <Dashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: 'staff-management',
            element: (
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <StaffManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: 'assign-role',
            element: (
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <AssignRole />
              </ProtectedRoute>
            ),
          },

          {
            path: 'room-managment',
            element: (
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <RoomManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: 'service-managment',
            element: (
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <ServiceManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: 'booking-history',
            element: (
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <BookingHistory />
              </ProtectedRoute>
            ),
          },
          {
            path: 'systemLogs',
            element: (
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <SystemLogs />
              </ProtectedRoute>
            ),
          },

          // You can add more nested routes here
        ],
      },
    ]), [isAuthenticated, loading]);

  return <RouterProvider router={router} />;
};

export default App;