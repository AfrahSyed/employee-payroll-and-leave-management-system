import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { useAuthStore } from './store/authStore';

// Lazy load components
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const EmployeeDashboard = React.lazy(() => import('./pages/EmployeeDashboard'));
const ManagerDashboard = React.lazy(() => import('./pages/ManagerDashboard'));
const LeaveApplication = React.lazy(() => import('./pages/LeaveApplication'));
const LeaveBalance = React.lazy(() => import('./pages/LeaveBalance'));

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRole?: 'employee' | 'manager';
}> = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={user?.role === 'manager' ? '/manager' : '/employee'} />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            }
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/employee"
                element={
                  <ProtectedRoute allowedRole="employee">
                    <EmployeeDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager"
                element={
                  <ProtectedRoute allowedRole="manager">
                    <ManagerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leave-application"
                element={
                  <ProtectedRoute allowedRole="employee">
                    <LeaveApplication />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leave-balance"
                element={
                  <ProtectedRoute allowedRole="employee">
                    <LeaveBalance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  <Navigate
                    to="/login"
                    replace
                  />
                }
              />
            </Routes>
          </React.Suspense>
        </Layout>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;