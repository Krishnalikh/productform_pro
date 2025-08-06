import React from 'react';
import Icon from '../../../components/AppIcon';

const CompanyBranding = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
          <svg
            width="32"
            height="32"
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
      </div>

      {/* Company Name */}
      <h1 className="text-3xl font-bold text-foreground mb-2">
        ProductForm Pro
      </h1>
      
      {/* Tagline */}
      <p className="text-lg text-muted-foreground mb-6">
        Enterprise Form Management Platform
      </p>

      {/* Welcome Message */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Welcome Back
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Sign in to access your enterprise form management dashboard. 
          Streamline product data collection with intelligent forms and automated reporting.
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-success" />
          <span>SSL Secured</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Lock" size={16} className="text-success" />
          <span>Enterprise Grade</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span>SOC 2 Compliant</span>
        </div>
      </div>
    </div>
  );
};

export default CompanyBranding;