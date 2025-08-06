import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ isCollapsed = false, onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const primaryNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Forms', path: '/form-builder', icon: 'FileText' },
    { label: 'Submissions', path: '/submissions-management', icon: 'Database' },
    { label: 'Reports', path: '/report-generation', icon: 'BarChart3' },
  ];

  const secondaryNavItems = [
    { label: 'User Management', path: '/user-management', icon: 'Users' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setShowMoreMenu(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section - Logo and Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Icon name="Menu" size={20} />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg
                width="20"
                height="20"
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
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">ProductForm Pro</h1>
            </div>
          </div>
        </div>

        {/* Center Section - Primary Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryNavItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActivePath(item?.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={16}
              className="px-3 py-2"
            >
              {item?.label}
            </Button>
          ))}
        </nav>

        {/* Right Section - More Menu and User Actions */}
        <div className="flex items-center space-x-2">
          {/* More Menu (Desktop) */}
          <div className="hidden lg:block relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              iconName="MoreHorizontal"
              iconPosition="left"
              iconSize={16}
            >
              More
            </Button>
            
            {showMoreMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMoreMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-20">
                  <div className="py-1">
                    {secondaryNavItems?.map((item) => (
                      <button
                        key={item?.path}
                        onClick={() => handleNavigation(item?.path)}
                        className={`w-full flex items-center px-4 py-2 text-sm text-left hover:bg-muted transition-colors ${
                          isActivePath(item?.path) ? 'bg-muted text-primary' : 'text-foreground'
                        }`}
                      >
                        <Icon name={item?.icon} size={16} className="mr-3" />
                        {item?.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile */}
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full bg-muted"
          >
            <Icon name="User" size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;