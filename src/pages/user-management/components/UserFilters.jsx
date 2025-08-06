import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const UserFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  departments = [],
  roles = []
}) => {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ];

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...departments?.map(dept => ({ value: dept, label: dept }))
  ];

  const roleOptions = [
    { value: '', label: 'All Roles' },
    ...roles?.map(role => ({ value: role, label: role }))
  ];

  const hasActiveFilters = filters?.search || filters?.department || filters?.role || filters?.status;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 lg:max-w-sm">
          <Input
            type="search"
            placeholder="Search users by name or email..."
            value={filters?.search}
            onChange={(e) => onFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Filter Selects */}
        <div className="flex flex-col sm:flex-row gap-4 lg:flex-1">
          <div className="flex-1 min-w-0">
            <Select
              placeholder="Filter by department"
              options={departmentOptions}
              value={filters?.department}
              onChange={(value) => onFilterChange('department', value)}
            />
          </div>

          <div className="flex-1 min-w-0">
            <Select
              placeholder="Filter by role"
              options={roleOptions}
              value={filters?.role}
              onChange={(value) => onFilterChange('role', value)}
            />
          </div>

          <div className="flex-1 min-w-0">
            <Select
              placeholder="Filter by status"
              options={statusOptions}
              value={filters?.status}
              onChange={(value) => onFilterChange('status', value)}
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={16}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters?.search && (
            <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              Search: "{filters?.search}"
              <button
                onClick={() => onFilterChange('search', '')}
                className="ml-1 hover:text-primary/80"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          
          {filters?.department && (
            <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              Department: {filters?.department}
              <button
                onClick={() => onFilterChange('department', '')}
                className="ml-1 hover:text-primary/80"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          
          {filters?.role && (
            <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              Role: {filters?.role}
              <button
                onClick={() => onFilterChange('role', '')}
                className="ml-1 hover:text-primary/80"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          
          {filters?.status && (
            <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              Status: {filters?.status}
              <button
                onClick={() => onFilterChange('status', '')}
                className="ml-1 hover:text-primary/80"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default UserFilters;