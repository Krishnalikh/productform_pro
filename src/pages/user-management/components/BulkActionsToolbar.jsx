import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsToolbar = ({ 
  selectedUsers = [], 
  onBulkAction, 
  onClearSelection,
  roles = [] 
}) => {
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkRole, setBulkRole] = useState('');

  const bulkActions = [
    {
      id: 'activate',
      label: 'Activate Users',
      icon: 'UserCheck',
      variant: 'default',
      description: 'Activate selected user accounts'
    },
    {
      id: 'deactivate',
      label: 'Deactivate Users',
      icon: 'UserX',
      variant: 'outline',
      description: 'Deactivate selected user accounts'
    },
    {
      id: 'reset_password',
      label: 'Reset Passwords',
      icon: 'Key',
      variant: 'outline',
      description: 'Send password reset emails to selected users'
    },
    {
      id: 'delete',
      label: 'Delete Users',
      icon: 'Trash2',
      variant: 'destructive',
      description: 'Permanently remove selected users from the system'
    }
  ];

  const roleOptions = roles?.map(role => ({ value: role, label: role }));

  const handleBulkAction = (actionId) => {
    onBulkAction(actionId, selectedUsers);
    setShowBulkActions(false);
  };

  const handleBulkRoleChange = () => {
    if (bulkRole) {
      onBulkAction('change_role', selectedUsers, { role: bulkRole });
      setBulkRole('');
    }
  };

  if (selectedUsers?.length === 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Selection Info */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {selectedUsers?.length} user{selectedUsers?.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
            iconSize={14}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear Selection
          </Button>
        </div>

        {/* Bulk Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Role Assignment */}
          <div className="flex items-center space-x-2">
            <Select
              placeholder="Assign role..."
              options={roleOptions}
              value={bulkRole}
              onChange={setBulkRole}
              className="min-w-[150px]"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkRoleChange}
              disabled={!bulkRole}
              iconName="UserCog"
              iconPosition="left"
              iconSize={16}
            >
              Assign
            </Button>
          </div>

          {/* Bulk Actions Dropdown */}
          <div className="relative">
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowBulkActions(!showBulkActions)}
              iconName="MoreHorizontal"
              iconPosition="right"
              iconSize={16}
            >
              Bulk Actions
            </Button>

            {showBulkActions && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowBulkActions(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-md shadow-lg z-20">
                  <div className="py-1">
                    {bulkActions?.map((action) => (
                      <button
                        key={action?.id}
                        onClick={() => handleBulkAction(action?.id)}
                        className={`
                          w-full flex items-center px-4 py-3 text-sm text-left
                          transition-colors duration-200 hover:bg-muted
                          ${action?.variant === 'destructive' ? 'text-error hover:bg-error/10' : 'text-foreground'}
                        `}
                      >
                        <Icon name={action?.icon} size={16} className="mr-3" />
                        <div>
                          <div className="font-medium">{action?.label}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {action?.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsToolbar;