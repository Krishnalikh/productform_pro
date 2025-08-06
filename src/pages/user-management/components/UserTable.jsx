import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const UserTable = ({ 
  users = [], 
  selectedUsers = [], 
  onUserSelect, 
  onSelectAll, 
  onEditUser, 
  onResetPassword, 
  onToggleStatus,
  onViewPermissions 
}) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = [...users]?.sort((a, b) => {
    const aValue = a?.[sortField];
    const bValue = b?.[sortField];
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'text-success', bg: 'bg-success/10', label: 'Active' },
      inactive: { color: 'text-error', bg: 'bg-error/10', label: 'Inactive' },
      pending: { color: 'text-warning', bg: 'bg-warning/10', label: 'Pending' }
    };

    const config = statusConfig?.[status] || statusConfig?.inactive;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.color}`}>
        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config?.color?.replace('text-', 'bg-')}`} />
        {config?.label}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'text-primary', bg: 'bg-primary/10' },
      manager: { color: 'text-accent', bg: 'bg-accent/10' },
      editor: { color: 'text-secondary', bg: 'bg-secondary/10' },
      viewer: { color: 'text-muted-foreground', bg: 'bg-muted' }
    };

    const config = roleConfig?.[role?.toLowerCase()] || roleConfig?.viewer;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${config?.bg} ${config?.color}`}>
        {role}
      </span>
    );
  };

  const formatLastLogin = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const loginDate = new Date(date);
    const diffInHours = Math.floor((now - loginDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return loginDate?.toLocaleDateString();
  };

  const isAllSelected = selectedUsers?.length === users?.length && users?.length > 0;
  const isIndeterminate = selectedUsers?.length > 0 && selectedUsers?.length < users?.length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>User</span>
                  <Icon 
                    name={sortField === 'name' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14}
                    className={sortField === 'name' ? 'text-primary' : 'text-muted-foreground'}
                  />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('role')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Role</span>
                  <Icon 
                    name={sortField === 'role' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14}
                    className={sortField === 'role' ? 'text-primary' : 'text-muted-foreground'}
                  />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('department')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Department</span>
                  <Icon 
                    name={sortField === 'department' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14}
                    className={sortField === 'department' ? 'text-primary' : 'text-muted-foreground'}
                  />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('lastLogin')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Last Login</span>
                  <Icon 
                    name={sortField === 'lastLogin' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14}
                    className={sortField === 'lastLogin' ? 'text-primary' : 'text-muted-foreground'}
                  />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-medium text-foreground">Status</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedUsers?.map((user) => (
              <tr key={user?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-4">
                  <Checkbox
                    checked={selectedUsers?.includes(user?.id)}
                    onChange={(e) => onUserSelect(user?.id, e?.target?.checked)}
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user?.name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{user?.name}</div>
                      <div className="text-sm text-muted-foreground">{user?.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {getRoleBadge(user?.role)}
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-foreground">{user?.department}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-muted-foreground">{formatLastLogin(user?.lastLogin)}</span>
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(user?.status)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewPermissions(user)}
                      className="w-8 h-8"
                    >
                      <Icon name="Shield" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditUser(user)}
                      className="w-8 h-8"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onResetPassword(user)}
                      className="w-8 h-8"
                    >
                      <Icon name="Key" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleStatus(user)}
                      className="w-8 h-8"
                    >
                      <Icon name={user?.status === 'active' ? 'UserX' : 'UserCheck'} size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Empty State */}
      {users?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
          <p className="text-muted-foreground">Get started by inviting your first user to the system.</p>
        </div>
      )}
    </div>
  );
};

export default UserTable;