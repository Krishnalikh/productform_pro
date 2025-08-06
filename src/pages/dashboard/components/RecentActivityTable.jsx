import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentActivityTable = ({ activities = [], onEdit, onView, onSort }) => {
  const [sortField, setSortField] = useState('submittedAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    if (onSort) {
      onSort(field, newDirection);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-warning/10 text-warning border-warning/20', label: 'Draft' },
      completed: { color: 'bg-success/10 text-success border-success/20', label: 'Completed' },
      in_progress: { color: 'bg-primary/10 text-primary border-primary/20', label: 'In Progress' },
      pending: { color: 'bg-muted text-muted-foreground border-border', label: 'Pending' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown';
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Recent Form Activity</h3>
        <p className="text-sm text-muted-foreground mt-1">Latest submissions and drafts</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('formName')}
                  className="flex items-center text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  Form Name
                  <Icon name={getSortIcon('formName')} size={14} className="ml-1" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  Status
                  <Icon name={getSortIcon('status')} size={14} className="ml-1" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('submittedAt')}
                  className="flex items-center text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  Date
                  <Icon name={getSortIcon('submittedAt')} size={14} className="ml-1" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Progress
                </span>
              </th>
              <th className="px-6 py-3 text-right">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activities?.map((activity) => (
              <tr key={activity?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <Icon name="FileText" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity?.formName}</p>
                      <p className="text-xs text-muted-foreground">{activity?.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(activity?.status)}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-foreground">{formatDate(activity?.submittedAt)}</p>
                  <p className="text-xs text-muted-foreground">{activity?.submittedBy}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-full bg-muted rounded-full h-2 mr-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${activity?.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground min-w-[3rem]">
                      {activity?.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView && onView(activity?.id)}
                      className="w-8 h-8"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit && onEdit(activity?.id)}
                      className="w-8 h-8"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {activities?.length === 0 && (
        <div className="px-6 py-12 text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No recent activity</h3>
          <p className="text-muted-foreground">Start by creating your first form to see activity here.</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivityTable;