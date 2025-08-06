import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, isOpen = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Overview and quick actions'
    },
    {
      label: 'Forms',
      path: '/form-builder',
      icon: 'FileText',
      tooltip: 'Create and manage forms'
    },
    {
      label: 'Submissions',
      path: '/submissions-management',
      icon: 'Database',
      tooltip: 'View and manage form submissions'
    },
    {
      label: 'Reports',
      path: '/report-generation',
      icon: 'BarChart3',
      tooltip: 'Generate and view reports'
    },
    {
      label: 'Administration',
      path: '/user-management',
      icon: 'Users',
      tooltip: 'Manage users and permissions'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-card border-r border-border z-50
          transition-transform duration-300 ease-smooth
          ${isCollapsed ? 'w-16' : 'w-60'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center h-16 px-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
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
              {!isCollapsed && (
                <div>
                  <h1 className="text-lg font-semibold text-foreground">ProductForm Pro</h1>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {navigationItems?.map((item) => (
                <div key={item?.path} className="relative group">
                  <Button
                    variant={isActivePath(item?.path) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleNavigation(item?.path)}
                    className={`
                      w-full justify-start px-3 py-2 h-10
                      ${isCollapsed ? 'px-2 justify-center' : ''}
                    `}
                  >
                    <Icon 
                      name={item?.icon} 
                      size={18} 
                      className={isCollapsed ? '' : 'mr-3'}
                    />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item?.label}</span>
                    )}
                  </Button>
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-popover border border-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      <span className="text-xs text-popover-foreground">{item?.tooltip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Footer Section */}
          <div className="px-4 py-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={16} />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">Admin User</p>
                  <p className="text-xs text-muted-foreground truncate">admin@productform.pro</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;