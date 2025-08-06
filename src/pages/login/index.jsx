import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyBranding from './components/CompanyBranding';
import LoginForm from './components/LoginForm';
import SecurityFooter from './components/SecurityFooter';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Main Container */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Branding (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 to-accent/5 p-12 items-center justify-center">
          <div className="max-w-md">
            <div className="mb-8">
              <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-xl mb-6">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-foreground"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                ProductForm Pro
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Streamline product data collection with intelligent forms that adapt to your business needs.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center mt-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Multi-step Form Wizard</h3>
                  <p className="text-sm text-muted-foreground">Create complex forms with conditional logic and progress tracking</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center mt-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Automated PDF Reports</h3>
                  <p className="text-sm text-muted-foreground">Generate professional reports with customizable templates</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center mt-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Enterprise Security</h3>
                  <p className="text-sm text-muted-foreground">Bank-level encryption with role-based access control</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Branding */}
            <div className="lg:hidden mb-8">
              <CompanyBranding />
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Welcome Back
              </h2>
              <p className="text-muted-foreground">
                Sign in to your ProductForm Pro account
              </p>
            </div>

            {/* Login Form */}
            <div className="bg-card border border-border rounded-xl shadow-lg p-8">
              <LoginForm />
            </div>

            {/* Additional Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Need help accessing your account?{' '}
                <button className="text-primary hover:text-primary/80 transition-colors font-medium">
                  Contact Support
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Footer */}
      <div className="bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <SecurityFooter />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;