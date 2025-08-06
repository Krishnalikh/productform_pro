import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityFooter = () => {
  const currentYear = new Date()?.getFullYear();

  const securityFeatures = [
    {
      icon: 'Shield',
      title: '256-bit SSL Encryption',
      description: 'Your data is protected with bank-level security'
    },
    {
      icon: 'Lock',
      title: 'Multi-Factor Authentication',
      description: 'Additional security layers for enterprise accounts'
    },
    {
      icon: 'Eye',
      title: 'Privacy Compliant',
      description: 'GDPR, CCPA, and SOX compliance standards'
    }
  ];

  return (
    <footer className="mt-12 pt-8 border-t border-border">
      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                <Icon name={feature?.icon} size={18} className="text-success" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-foreground mb-2">
              {feature?.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {feature?.description}
            </p>
          </div>
        ))}
      </div>
      {/* Security Badges */}
      <div className="flex items-center justify-center space-x-8 mb-6">
        <div className="flex items-center space-x-2 bg-muted/50 rounded-lg px-4 py-2">
          <Icon name="Shield" size={16} className="text-primary" />
          <span className="text-xs font-medium text-foreground">ISO 27001</span>
        </div>
        <div className="flex items-center space-x-2 bg-muted/50 rounded-lg px-4 py-2">
          <Icon name="CheckCircle" size={16} className="text-primary" />
          <span className="text-xs font-medium text-foreground">SOC 2 Type II</span>
        </div>
        <div className="flex items-center space-x-2 bg-muted/50 rounded-lg px-4 py-2">
          <Icon name="Lock" size={16} className="text-primary" />
          <span className="text-xs font-medium text-foreground">HIPAA Ready</span>
        </div>
      </div>
      {/* Copyright and Links */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
          <button className="hover:text-foreground transition-colors">
            Privacy Policy
          </button>
          <button className="hover:text-foreground transition-colors">
            Terms of Service
          </button>
          <button className="hover:text-foreground transition-colors">
            Security
          </button>
          <button className="hover:text-foreground transition-colors">
            Support
          </button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>© {currentYear} ProductForm Pro. All rights reserved.</p>
          <p className="mt-1">
            Trusted by 500+ enterprises worldwide for secure form management
          </p>
        </div>
      </div>
      {/* Contact Information */}
      <div className="mt-6 pt-6 border-t border-border text-center">
        <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Mail" size={14} />
            <span>support@productform.pro</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Phone" size={14} />
            <span>1-800-FORMS-PRO</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} />
            <span>24/7 Enterprise Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SecurityFooter;