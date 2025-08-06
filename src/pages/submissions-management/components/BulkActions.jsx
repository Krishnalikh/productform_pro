import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ 
  selectedItems = [], 
  onBulkAction = () => {},
  userPermissions = ['admin']
}) => {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const exportFormatOptions = [
    { value: 'csv', label: 'CSV File' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'pdf', label: 'PDF Report' },
    { value: 'json', label: 'JSON Data' }
  ];

  const statusOptions = [
    { value: 'approved', label: 'Approve Selected' },
    { value: 'pending', label: 'Mark as Pending' },
    { value: 'rejected', label: 'Reject Selected' },
    { value: 'archived', label: 'Archive Selected' }
  ];

  const bulkActions = [
    {
      key: 'export',
      label: 'Export',
      icon: 'Download',
      variant: 'outline',
      permission: 'export',
      onClick: () => setShowExportOptions(true)
    },
    {
      key: 'status-update',
      label: 'Update Status',
      icon: 'Edit',
      variant: 'outline',
      permission: 'edit',
      onClick: () => setShowStatusUpdate(true)
    },
    {
      key: 'generate-report',
      label: 'Generate Report',
      icon: 'FileText',
      variant: 'outline',
      permission: 'report'
    },
    {
      key: 'duplicate',
      label: 'Duplicate',
      icon: 'Copy',
      variant: 'outline',
      permission: 'create'
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'Trash2',
      variant: 'destructive',
      permission: 'delete',
      requiresConfirmation: true
    }
  ];

  const hasPermission = (permission) => {
    return userPermissions?.includes(permission) || userPermissions?.includes('admin');
  };

  const availableActions = bulkActions?.filter(action => hasPermission(action?.permission));

  const handleBulkAction = (actionKey, additionalData = {}) => {
    onBulkAction(actionKey, selectedItems, additionalData);
  };

  const handleExport = () => {
    handleBulkAction('export', { format: exportFormat });
    setShowExportOptions(false);
  };

  const handleStatusUpdate = () => {
    if (newStatus) {
      handleBulkAction('status-update', { status: newStatus });
      setShowStatusUpdate(false);
      setNewStatus('');
    }
  };

  if (selectedItems?.length === 0) return null;

  return (
    <>
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
              <Icon name="CheckSquare" size={16} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {selectedItems?.length} submission{selectedItems?.length !== 1 ? 's' : ''} selected
              </p>
              <p className="text-sm text-muted-foreground">
                Choose an action to apply to selected items
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {availableActions?.map((action) => (
              <Button
                key={action?.key}
                variant={action?.variant}
                size="sm"
                onClick={action?.onClick || (() => handleBulkAction(action?.key))}
                iconName={action?.icon}
                iconPosition="left"
                iconSize={16}
              >
                {action?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Export Options Modal */}
      {showExportOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Export Options</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowExportOptions(false)}
                className="w-8 h-8"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  Export {selectedItems?.length} selected submission{selectedItems?.length !== 1 ? 's' : ''} in your preferred format:
                </p>
                
                <Select
                  label="Export Format"
                  options={exportFormatOptions}
                  value={exportFormat}
                  onChange={setExportFormat}
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowExportOptions(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleExport}
                  iconName="Download"
                  iconPosition="left"
                  iconSize={16}
                  className="flex-1"
                >
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Status Update Modal */}
      {showStatusUpdate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Update Status</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowStatusUpdate(false)}
                className="w-8 h-8"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  Update the status of {selectedItems?.length} selected submission{selectedItems?.length !== 1 ? 's' : ''}:
                </p>
                
                <Select
                  label="New Status"
                  options={statusOptions}
                  value={newStatus}
                  onChange={setNewStatus}
                  placeholder="Select new status"
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowStatusUpdate(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleStatusUpdate}
                  disabled={!newStatus}
                  iconName="Edit"
                  iconPosition="left"
                  iconSize={16}
                  className="flex-1"
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;