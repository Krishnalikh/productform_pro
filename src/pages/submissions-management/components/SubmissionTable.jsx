import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const SubmissionTable = ({ 
  submissions = [], 
  selectedItems = [], 
  onSelectionChange = () => {},
  onSort = () => {},
  sortConfig = { key: '', direction: '' }
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const mockSubmissions = [
    {
      id: 'SUB-001',
      formName: 'Product Registration Form',
      submitter: 'John Doe',
      submitterEmail: 'john.doe@company.com',
      status: 'completed',
      submissionDate: '2025-01-06',
      completionTime: '8.5 min',
      formType: 'product-registration',
      department: 'Product Management',
      priority: 'high'
    },
    {
      id: 'SUB-002',
      formName: 'Customer Feedback Survey',
      submitter: 'Sarah Wilson',
      submitterEmail: 'sarah.wilson@company.com',
      status: 'pending',
      submissionDate: '2025-01-06',
      completionTime: '12.3 min',
      formType: 'customer-feedback',
      department: 'Customer Success',
      priority: 'medium'
    },
    {
      id: 'SUB-003',
      formName: 'Quality Assessment Checklist',
      submitter: 'Mike Johnson',
      submitterEmail: 'mike.johnson@company.com',
      status: 'approved',
      submissionDate: '2025-01-05',
      completionTime: '15.2 min',
      formType: 'quality-assessment',
      department: 'Quality Assurance',
      priority: 'high'
    },
    {
      id: 'SUB-004',
      formName: 'Compliance Verification',
      submitter: 'Emily Brown',
      submitterEmail: 'emily.brown@company.com',
      status: 'draft',
      submissionDate: '2025-01-05',
      completionTime: '6.8 min',
      formType: 'compliance-check',
      department: 'Legal & Compliance',
      priority: 'low'
    },
    {
      id: 'SUB-005',
      formName: 'Market Research Data',
      submitter: 'David Lee',
      submitterEmail: 'david.lee@company.com',
      status: 'rejected',
      submissionDate: '2025-01-04',
      completionTime: '22.1 min',
      formType: 'market-research',
      department: 'Marketing',
      priority: 'medium'
    }
  ];

  const data = submissions?.length > 0 ? submissions : mockSubmissions;

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'text-success', bg: 'bg-success/10', label: 'Completed' },
      pending: { color: 'text-warning', bg: 'bg-warning/10', label: 'Pending Review' },
      approved: { color: 'text-success', bg: 'bg-success/10', label: 'Approved' },
      draft: { color: 'text-muted-foreground', bg: 'bg-muted', label: 'Draft' },
      rejected: { color: 'text-error', bg: 'bg-error/10', label: 'Rejected' }
    };

    const config = statusConfig?.[status] || statusConfig?.draft;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color} ${config?.bg}`}>
        {config?.label}
      </span>
    );
  };

  const getPriorityIcon = (priority) => {
    const priorityConfig = {
      high: { icon: 'ArrowUp', color: 'text-error' },
      medium: { icon: 'Minus', color: 'text-warning' },
      low: { icon: 'ArrowDown', color: 'text-muted-foreground' }
    };

    const config = priorityConfig?.[priority] || priorityConfig?.medium;

    return (<Icon name={config?.icon} size={16} className={config?.color} />);
  };

  const handleSort = (key) => {
    const direction = sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    onSort({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(data?.map(item => item?.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      onSelectionChange([...selectedItems, id]);
    } else {
      onSelectionChange(selectedItems?.filter(item => item !== id));
    }
  };

  const toggleRowExpansion = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded?.has(id)) {
      newExpanded?.delete(id);
    } else {
      newExpanded?.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const isAllSelected = data?.length > 0 && selectedItems?.length === data?.length;
  const isPartiallySelected = selectedItems?.length > 0 && selectedItems?.length < data?.length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isPartiallySelected}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('formName')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Form Name</span>
                  <Icon name={getSortIcon('formName')} size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('submitter')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Submitter</span>
                  <Icon name={getSortIcon('submitter')} size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Status</span>
                  <Icon name={getSortIcon('status')} size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('submissionDate')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Date</span>
                  <Icon name={getSortIcon('submissionDate')} size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <span className="text-sm font-medium text-foreground">Priority</span>
              </th>
              <th className="text-right px-4 py-3">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data?.map((submission) => (
              <tr key={submission?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedItems?.includes(submission?.id)}
                    onChange={(e) => handleSelectItem(submission?.id, e?.target?.checked)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{submission?.formName}</span>
                    <span className="text-sm text-muted-foreground">{submission?.id}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{submission?.submitter}</span>
                    <span className="text-sm text-muted-foreground">{submission?.submitterEmail}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(submission?.status)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-foreground">{new Date(submission.submissionDate)?.toLocaleDateString()}</span>
                    <span className="text-sm text-muted-foreground">{submission?.completionTime}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    {getPriorityIcon(submission?.priority)}
                    <span className="text-sm capitalize text-foreground">{submission?.priority}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                    >
                      <Icon name="FileText" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                    >
                      <Icon name="Download" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                    >
                      <Icon name="MoreHorizontal" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Tablet View */}
      <div className="hidden md:block lg:hidden">
        <div className="divide-y divide-border">
          {data?.map((submission) => (
            <div key={submission?.id} className="p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={selectedItems?.includes(submission?.id)}
                    onChange={(e) => handleSelectItem(submission?.id, e?.target?.checked)}
                    className="mt-1"
                  />
                  <div>
                    <h3 className="font-medium text-foreground">{submission?.formName}</h3>
                    <p className="text-sm text-muted-foreground">{submission?.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getPriorityIcon(submission?.priority)}
                  {getStatusBadge(submission?.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Submitter</p>
                  <p className="font-medium text-foreground">{submission?.submitter}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground">{new Date(submission.submissionDate)?.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completion: {submission?.completionTime}</span>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" iconName="Eye" iconPosition="left" iconSize={14}>
                    View
                  </Button>
                  <Button variant="ghost" size="sm" iconName="Download" iconPosition="left" iconSize={14}>
                    Export
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Mobile View */}
      <div className="block md:hidden">
        <div className="divide-y divide-border">
          {data?.map((submission) => (
            <div key={submission?.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                  <Checkbox
                    checked={selectedItems?.includes(submission?.id)}
                    onChange={(e) => handleSelectItem(submission?.id, e?.target?.checked)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{submission?.formName}</h3>
                    <p className="text-sm text-muted-foreground">{submission?.id}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleRowExpansion(submission?.id)}
                  className="w-8 h-8 flex-shrink-0"
                >
                  <Icon 
                    name={expandedRows?.has(submission?.id) ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                  />
                </Button>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getPriorityIcon(submission?.priority)}
                  {getStatusBadge(submission?.status)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(submission.submissionDate)?.toLocaleDateString()}
                </span>
              </div>

              {expandedRows?.has(submission?.id) && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Submitter</p>
                    <p className="font-medium text-foreground">{submission?.submitter}</p>
                    <p className="text-sm text-muted-foreground">{submission?.submitterEmail}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium text-foreground">{submission?.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completion Time</p>
                      <p className="font-medium text-foreground">{submission?.completionTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Button variant="outline" size="sm" iconName="Eye" iconPosition="left" iconSize={14} className="flex-1">
                      View
                    </Button>
                    <Button variant="outline" size="sm" iconName="FileText" iconPosition="left" iconSize={14} className="flex-1">
                      Report
                    </Button>
                    <Button variant="outline" size="sm" iconName="Download" iconPosition="left" iconSize={14} className="flex-1">
                      Export
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubmissionTable;