import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import StatusNotification from '../../components/ui/StatusNotification';
import Button from '../../components/ui/Button';


// Import components
import UserTable from './components/UserTable';
import UserFilters from './components/UserFilters';
import InviteUserModal from './components/InviteUserModal';
import PermissionsPanel from './components/PermissionsPanel';
import BulkActionsToolbar from './components/BulkActionsToolbar';
import UserStatsCards from './components/UserStatsCards';

const UserManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPermissionsPanel, setShowPermissionsPanel] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    role: '',
    status: ''
  });

  // Mock data
  const mockUsers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "Admin",
      department: "IT",
      status: "active",
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      permissions: ["create_forms", "view_submissions", "manage_users", "system_settings"]
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      role: "Manager",
      department: "Marketing",
      status: "active",
      lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000),
      permissions: ["create_forms", "view_submissions", "create_reports"]
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      role: "Editor",
      department: "Sales",
      status: "inactive",
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
      permissions: ["view_submissions", "edit_submissions"]
    },
    {
      id: 4,
      name: "David Thompson",
      email: "david.thompson@company.com",
      role: "Viewer",
      department: "HR",
      status: "pending",
      lastLogin: null,
      permissions: ["view_submissions"]
    },
    {
      id: 5,
      name: "Lisa Wang",
      email: "lisa.wang@company.com",
      role: "Manager",
      department: "Finance",
      status: "active",
      lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000),
      permissions: ["create_forms", "view_submissions", "create_reports", "export_submissions"]
    },
    {
      id: 6,
      name: "James Wilson",
      email: "james.wilson@company.com",
      role: "Editor",
      department: "Operations",
      status: "active",
      lastLogin: new Date(Date.now() - 3 * 60 * 60 * 1000),
      permissions: ["create_forms", "edit_forms", "view_submissions"]
    }
  ];

  const mockStats = {
    total: 6,
    active: 4,
    pending: 1,
    inactive: 1,
    totalChange: 12,
    activeChange: 8,
    pendingChange: -25,
    inactiveChange: 0
  };

  const departments = ["IT", "Marketing", "Sales", "HR", "Finance", "Operations"];
  const roles = ["Admin", "Manager", "Editor", "Viewer"];

  const [users, setUsers] = useState(mockUsers);
  const [stats, setStats] = useState(mockStats);

  // Filter users based on current filters
  const filteredUsers = users?.filter(user => {
    const matchesSearch = !filters?.search || 
      user?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      user?.email?.toLowerCase()?.includes(filters?.search?.toLowerCase());
    
    const matchesDepartment = !filters?.department || user?.department === filters?.department;
    const matchesRole = !filters?.role || user?.role === filters?.role;
    const matchesStatus = !filters?.status || user?.status === filters?.status;

    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'Home' },
    { label: 'User Management', href: '/user-management' }
  ];

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleUserSelect = (userId, selected) => {
    setSelectedUsers(prev => 
      selected 
        ? [...prev, userId]
        : prev?.filter(id => id !== userId)
    );
  };

  const handleSelectAll = (selected) => {
    setSelectedUsers(selected ? filteredUsers?.map(user => user?.id) : []);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      department: '',
      role: '',
      status: ''
    });
  };

  const handleInviteUser = async (userData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: users?.length + 1,
      name: userData?.name,
      email: userData?.email,
      role: userData?.role,
      department: userData?.department,
      status: 'pending',
      lastLogin: null,
      permissions: userData?.permissions
    };

    setUsers(prev => [...prev, newUser]);
    setStats(prev => ({ ...prev, total: prev?.total + 1, pending: prev?.pending + 1 }));
    
    addNotification({
      type: 'success',
      title: 'Invitation Sent',
      message: `Invitation sent to ${userData?.email} successfully.`
    });
  };

  const handleEditUser = (user) => {
    addNotification({
      type: 'info',
      title: 'Edit User',
      message: `Edit functionality for ${user?.name} would open here.`
    });
  };

  const handleResetPassword = (user) => {
    addNotification({
      type: 'success',
      title: 'Password Reset',
      message: `Password reset email sent to ${user?.email}.`
    });
  };

  const handleToggleStatus = (user) => {
    const newStatus = user?.status === 'active' ? 'inactive' : 'active';
    
    setUsers(prev => prev?.map(u => 
      u?.id === user?.id ? { ...u, status: newStatus } : u
    ));

    addNotification({
      type: 'success',
      title: 'Status Updated',
      message: `${user?.name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`
    });
  };

  const handleViewPermissions = (user) => {
    setSelectedUser(user);
    setShowPermissionsPanel(true);
  };

  const handleSavePermissions = async (userId, permissions) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUsers(prev => prev?.map(user => 
      user?.id === userId ? { ...user, permissions } : user
    ));

    addNotification({
      type: 'success',
      title: 'Permissions Updated',
      message: 'User permissions have been updated successfully.'
    });
  };

  const handleBulkAction = (actionId, userIds, data = {}) => {
    switch (actionId) {
      case 'activate':
        setUsers(prev => prev?.map(user => 
          userIds?.includes(user?.id) ? { ...user, status: 'active' } : user
        ));
        addNotification({
          type: 'success',
          title: 'Users Activated',
          message: `${userIds?.length} user(s) have been activated.`
        });
        break;
      
      case 'deactivate':
        setUsers(prev => prev?.map(user => 
          userIds?.includes(user?.id) ? { ...user, status: 'inactive' } : user
        ));
        addNotification({
          type: 'success',
          title: 'Users Deactivated',
          message: `${userIds?.length} user(s) have been deactivated.`
        });
        break;
      
      case 'change_role':
        setUsers(prev => prev?.map(user => 
          userIds?.includes(user?.id) ? { ...user, role: data?.role } : user
        ));
        addNotification({
          type: 'success',
          title: 'Roles Updated',
          message: `${userIds?.length} user(s) have been assigned the ${data?.role} role.`
        });
        break;
      
      case 'reset_password':
        addNotification({
          type: 'success',
          title: 'Password Reset',
          message: `Password reset emails sent to ${userIds?.length} user(s).`
        });
        break;
      
      case 'delete':
        setUsers(prev => prev?.filter(user => !userIds?.includes(user?.id)));
        addNotification({
          type: 'success',
          title: 'Users Deleted',
          message: `${userIds?.length} user(s) have been removed from the system.`
        });
        break;
    }
    
    setSelectedUsers([]);
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const handleDismissNotification = (id) => {
    setNotifications(prev => prev?.filter(n => n?.id !== id));
  };

  const handleDismissAllNotifications = () => {
    setNotifications([]);
  };

  // Check for mobile view
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        isCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      }`}>
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">User Management</h1>
              <p className="text-muted-foreground">
                Manage user accounts, roles, and permissions for your organization
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                iconSize={16}
              >
                Export Users
              </Button>
              <Button
                onClick={() => setShowInviteModal(true)}
                iconName="UserPlus"
                iconPosition="left"
                iconSize={16}
              >
                Invite User
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <UserStatsCards stats={stats} />

          {/* Filters */}
          <UserFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            departments={departments}
            roles={roles}
          />

          {/* Bulk Actions Toolbar */}
          <BulkActionsToolbar
            selectedUsers={selectedUsers}
            onBulkAction={handleBulkAction}
            onClearSelection={() => setSelectedUsers([])}
            roles={roles}
          />

          {/* Main Content Area */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* User Table */}
            <div className={`${showPermissionsPanel && !isMobile ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
              <UserTable
                users={filteredUsers}
                selectedUsers={selectedUsers}
                onUserSelect={handleUserSelect}
                onSelectAll={handleSelectAll}
                onEditUser={handleEditUser}
                onResetPassword={handleResetPassword}
                onToggleStatus={handleToggleStatus}
                onViewPermissions={handleViewPermissions}
              />
            </div>

            {/* Permissions Panel */}
            {showPermissionsPanel && !isMobile && (
              <div className="xl:col-span-1">
                <PermissionsPanel
                  user={selectedUser}
                  isOpen={showPermissionsPanel}
                  onClose={() => setShowPermissionsPanel(false)}
                  onSavePermissions={handleSavePermissions}
                  isMobile={false}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <InviteUserModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInviteUser}
        departments={departments}
        roles={roles}
      />

      {/* Mobile Permissions Panel */}
      {isMobile && (
        <PermissionsPanel
          user={selectedUser}
          isOpen={showPermissionsPanel}
          onClose={() => setShowPermissionsPanel(false)}
          onSavePermissions={handleSavePermissions}
          isMobile={true}
        />
      )}

      {/* Notifications */}
      <StatusNotification
        notifications={notifications}
        onDismiss={handleDismissNotification}
        onDismissAll={handleDismissAllNotifications}
        position="top-right"
        maxVisible={3}
        autoHideDuration={5000}
      />
    </div>
  );
};

export default UserManagement;