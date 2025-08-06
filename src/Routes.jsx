import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
 import ErrorBoundary from'./components/ErrorBoundary';
 import ScrollToTop from'./components/ScrollToTop';
 import NotFound from'./pages/NotFound';
 import Dashboard from'./pages/dashboard/index';
 import FormBuilder from'./pages/form-builder/index';
 import Login from'./pages/login/index';
 import UserManagement from'./pages/user-management/index';
 import ReportGeneration from'./pages/report-generation/index';
 import SubmissionsManagement from'./pages/submissions-management/index';
 import Signup from'./pages/auth/Signup';

function Routes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            {/* Authentication routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Main application routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/form-builder" element={<FormBuilder />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/report-generation" element={<ReportGeneration />} />
            <Route path="/submissions-management" element={<SubmissionsManagement />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default Routes