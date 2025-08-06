import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const InviteUserModal = ({ isOpen, onClose, onInvite, departments = [], roles = [] }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: '',
    department: '',
    sendWelcomeEmail: true,
    permissions: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleOptions = roles?.map(role => ({ value: role, label: role }));
  const departmentOptions = departments?.map(dept => ({ value: dept, label: dept }));

  const permissionOptions = [
    { id: 'create_forms', label: 'Create Forms', description: 'Allow user to create and edit forms' },
    { id: 'view_submissions', label: 'View Submissions', description: 'Access to view form submissions' },
    { id: 'generate_reports', label: 'Generate Reports', description: 'Create and download reports' },
    { id: 'manage_users', label: 'Manage Users', description: 'Invite and manage other users' },
    { id: 'system_admin', label: 'System Administration', description: 'Full system access and configuration' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePermissionChange = (permissionId, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev?.permissions, permissionId]
        : prev?.permissions?.filter(p => p !== permissionId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData?.role) {
      newErrors.role = 'Role is required';
    }

    if (!formData?.department) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onInvite(formData);
      setFormData({
        email: '',
        name: '',
        role: '',
        department: '',
        sendWelcomeEmail: true,
        permissions: []
      });
      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to send invitation. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      name: '',
      role: '',
      department: '',
      sendWelcomeEmail: true,
      permissions: []
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={handleClose}
      />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Invite New User</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Send an invitation to join your organization
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="w-8 h-8"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Enter full name"
                  value={formData?.name}
                  onChange={(e) => handleInputChange('name', e?.target?.value)}
                  error={errors?.name}
                  required
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter email address"
                  value={formData?.email}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                  error={errors?.email}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Department"
                  placeholder="Select department"
                  options={departmentOptions}
                  value={formData?.department}
                  onChange={(value) => handleInputChange('department', value)}
                  error={errors?.department}
                  required
                />
                
                <Select
                  label="Role"
                  placeholder="Select role"
                  options={roleOptions}
                  value={formData?.role}
                  onChange={(value) => handleInputChange('role', value)}
                  error={errors?.role}
                  required
                />
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Permissions</h3>
              <p className="text-sm text-muted-foreground">
                Select the permissions this user should have access to
              </p>
              
              <div className="space-y-3">
                {permissionOptions?.map((permission) => (
                  <div key={permission?.id} className="flex items-start space-x-3">
                    <Checkbox
                      checked={formData?.permissions?.includes(permission?.id)}
                      onChange={(e) => handlePermissionChange(permission?.id, e?.target?.checked)}
                    />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground">
                        {permission?.label}
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {permission?.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Email Options</h3>
              
              <Checkbox
                label="Send welcome email"
                description="User will receive an email with login instructions"
                checked={formData?.sendWelcomeEmail}
                onChange={(e) => handleInputChange('sendWelcomeEmail', e?.target?.checked)}
              />
            </div>

            {/* Error Message */}
            {errors?.submit && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-md">
                <p className="text-sm text-error">{errors?.submit}</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            iconName="Send"
            iconPosition="left"
            iconSize={16}
          >
            Send Invitation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InviteUserModal;