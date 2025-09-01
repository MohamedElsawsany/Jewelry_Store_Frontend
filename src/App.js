import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/common/Layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import UserList from './components/users/UserList';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route 
                        path="/users" 
                        element={
                          <ProtectedRoute requiredRoles={['Admin', 'Manager']}>
                            <UserList />
                          </ProtectedRoute>
                        } 
                      />
                      {/* Add more routes as needed */}
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;