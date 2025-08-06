import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const PermissionsPanel = ({ 
  user, 
  isOpen, 
  onClose, 
  onSavePermissions,
  isMobile = false 
}) => {
  const [permissions, setPermissions] = useState(user?.permissions || []);
  const [isSaving, setIsSaving] = useState(false);

  const permissionCategories = [
    {
      id: 'forms',
      title: 'Form Management',
      description: 'Permissions related to form creation and management',
      permissions: [
        { id: 'create_forms', label: 'Create Forms', description: 'Create new forms and templates' },
        { id: 'edit_forms', label: 'Edit Forms', description: 'Modify existing forms and templates' },
        { id: 'delete_forms', label: 'Delete Forms', description: 'Remove forms from the system' },
        { id: 'publish_forms', label: 'Publish Forms', description: 'Make forms available to users' }
      ]
    },
    {
      id: 'submissions',
      title: 'Submission Management',
      description: 'Permissions for viewing and managing form submissions',
      permissions: [
        { id: 'view_submissions', label: 'View Submissions', description: 'Access form submission data' },
        { id: 'edit_submissions', label: 'Edit Submissions', description: 'Modify submission data' },
        { id: 'delete_submissions', label: 'Delete Submissions', description: 'Remove submissions from system' },
        { id: 'export_submissions', label: 'Export Submissions', description: 'Download submission data' }
      ]
    },
    {
      id: 'reports',
      title: 'Report Generation',
      description: 'Permissions for creating and accessing reports',
      permissions: [
        { id: 'view_reports', label: 'View Reports', description: 'Access existing reports' },
        { id: 'create_reports', label: 'Create Reports', description: 'Generate new reports' },
        { id: 'schedule_reports', label: 'Schedule Reports', description: 'Set up automated report generation' },
        { id: 'share_reports', label: 'Share Reports', description: 'Share reports with other users' }
      ]
    },
    {
      id: 'administration',
      title: 'System Administration',
      description: 'Administrative permissions for system management',
      permissions: [
        { id: 'manage_users', label: 'Manage Users', description: 'Invite, edit, and remove users' },
        { id: 'manage_permissions', label: 'Manage Permissions', description: 'Assign and modify user permissions' },
        { id: 'system_settings', label: 'System Settings', description: 'Configure system-wide settings' },
        { id: 'audit_logs', label: 'Audit Logs', description: 'Access system audit and activity logs' }
      ]
    }
  ];

  const handlePermissionChange = (permissionId, checked) => {
    setPermissions(prev => 
      checked 
        ? [...prev, permissionId]
        : prev?.filter(p => p !== permissionId)
    );
  };

  const handleCategoryToggle = (category, checked) => {
    const categoryPermissions = category?.permissions?.map(p => p?.id);
    
    if (checked) {
      setPermissions(prev => [
        ...prev?.filter(p => !categoryPermissions?.includes(p)),
        ...categoryPermissions
      ]);
    } else {
      setPermissions(prev => prev?.filter(p => !categoryPermissions?.includes(p)));
    }
  };

  const isCategoryChecked = (category) => {
    const categoryPermissions = category?.permissions?.map(p => p?.id);
    return categoryPermissions?.every(p => permissions?.includes(p));
  };

  const isCategoryIndeterminate = (category) => {
    const categoryPermissions = category?.permissions?.map(p => p?.id);
    const checkedCount = categoryPermissions?.filter(p => permissions?.includes(p))?.length;
    return checkedCount > 0 && checkedCount < categoryPermissions?.length;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSavePermissions(user?.id, permissions);
      onClose();
    } catch (error) {
      console.error('Failed to save permissions:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setPermissions(user?.permissions || []);
    onClose();
  };

  if (!isOpen || !user) return null;

  const PanelContent = () => (
    <div className="space-y-6">
      {/* User Info */}
      <div className="flex items-center space-x-3 pb-4 border-b border-border">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-lg font-medium text-primary">
            {user?.name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{user?.name}</h3>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <p className="text-xs text-muted-foreground">{user?.role} • {user?.department}</p>
        </div>
      </div>

      {/* Permission Categories */}
      <div className="space-y-6">
        {permissionCategories?.map((category) => (
          <div key={category?.id} className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={isCategoryChecked(category)}
                indeterminate={isCategoryIndeterminate(category)}
                onChange={(e) => handleCategoryToggle(category, e?.target?.checked)}
              />
              <div className="flex-1">
                <h4 className="text-base font-medium text-foreground">{category?.title}</h4>
                <p className="text-sm text-muted-foreground">{category?.description}</p>
              </div>
            </div>
            
            <div className="ml-6 space-y-2">
              {category?.permissions?.map((permission) => (
                <div key={permission?.id} className="flex items-start space-x-3">
                  <Checkbox
                    checked={permissions?.includes(permission?.id)}
                    onChange={(e) => handlePermissionChange(permission?.id, e?.target?.checked)}
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-foreground">
                      {permission?.label}
                    </label>
                    <p className="text-xs text-muted-foreground">{permission?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
        <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-hidden mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">User Permissions</h2>
            <Button variant="ghost" size="icon" onClick={handleClose} className="w-8 h-8">
              <Icon name="X" size={20} />
            </Button>
          </div>
          
          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
            <PanelContent />
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-4 border-t border-border">
            <Button variant="outline" onClick={handleClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={isSaving}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">User Permissions</h2>
        <Button variant="ghost" size="icon" onClick={handleClose} className="w-8 h-8">
          <Icon name="X" size={20} />
        </Button>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <PanelContent />
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
        <Button variant="outline" onClick={handleClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} loading={isSaving}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default PermissionsPanel;