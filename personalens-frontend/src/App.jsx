/**
 * Root Application Component
 * Sets up routing and authentication context
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import DashboardNew from './pages/DashboardNew';
import History from './pages/History';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/history" element={<History />} />
          
          {/* Protected Routes */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/:analysisId"
            element={
              <ProtectedRoute>
                <DashboardNew />
              </ProtectedRoute>
            }
          />
          
          {/* Default redirect to history page */}
          <Route path="/" element={<Navigate to="/history" replace />} />
          <Route path="*" element={<Navigate to="/history" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
