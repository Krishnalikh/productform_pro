import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const DataSourceSelector = ({ selectedSources, onSourcesChange, selectedDateRange, onDateRangeChange }) => {
  const [expandedForms, setExpandedForms] = useState(new Set(['form-1']));

  const forms = [
    {
      id: 'form-1',
      name: 'Product Information Form',
      description: 'Main product data collection form',
      submissions: 156,
      lastSubmission: '2025-01-05',
      status: 'active',
      fields: ['Product Name', 'Category', 'Description', 'Specifications', 'Images', 'Pricing']
    },
    {
      id: 'form-2',
      name: 'Quality Assessment Form',
      description: 'Product quality and testing data',
      submissions: 89,
      lastSubmission: '2025-01-04',
      status: 'active',
      fields: ['Quality Score', 'Test Results', 'Defects', 'Recommendations']
    },
    {
      id: 'form-3',
      name: 'Market Research Form',
      description: 'Market analysis and competitor data',
      submissions: 34,
      lastSubmission: '2025-01-03',
      status: 'draft',
      fields: ['Market Size', 'Competitors', 'Pricing Analysis', 'Trends']
    },
    {
      id: 'form-4',
      name: 'Customer Feedback Form',
      description: 'Customer reviews and satisfaction data',
      submissions: 203,
      lastSubmission: '2025-01-06',
      status: 'active',
      fields: ['Rating', 'Comments', 'Satisfaction Score', 'Recommendations']
    }
  ];

  const dateRanges = [
    { id: 'last-7-days', label: 'Last 7 days', value: 'last-7-days' },
    { id: 'last-30-days', label: 'Last 30 days', value: 'last-30-days' },
    { id: 'last-3-months', label: 'Last 3 months', value: 'last-3-months' },
    { id: 'last-6-months', label: 'Last 6 months', value: 'last-6-months' },
    { id: 'custom', label: 'Custom range', value: 'custom' }
  ];

  const submissionStatuses = [
    { id: 'completed', label: 'Completed', count: 482 },
    { id: 'draft', label: 'Draft', count: 23 },
    { id: 'pending-review', label: 'Pending Review', count: 15 }
  ];

  const toggleFormExpansion = (formId) => {
    const newExpanded = new Set(expandedForms);
    if (newExpanded?.has(formId)) {
      newExpanded?.delete(formId);
    } else {
      newExpanded?.add(formId);
    }
    setExpandedForms(newExpanded);
  };

  const handleFormSelection = (formId, checked) => {
    const newSources = checked 
      ? [...selectedSources, formId]
      : selectedSources?.filter(id => id !== formId);
    onSourcesChange(newSources);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'draft': return 'text-warning';
      case 'archived': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'CheckCircle';
      case 'draft': return 'Clock';
      case 'archived': return 'Archive';
      default: return 'Circle';
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Sources */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Data Sources</h4>
        <div className="space-y-3">
          {forms?.map(form => (
            <div key={form?.id} className="border border-border rounded-lg bg-background">
              {/* Form Header */}
              <div className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Checkbox
                      checked={selectedSources?.includes(form?.id)}
                      onChange={(e) => handleFormSelection(form?.id, e?.target?.checked)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-medium text-foreground text-sm">{form?.name}</h5>
                        <Icon 
                          name={getStatusIcon(form?.status)} 
                          size={14} 
                          className={getStatusColor(form?.status)} 
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{form?.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{form?.submissions} submissions</span>
                        <span>Last: {form?.lastSubmission}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFormExpansion(form?.id)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <Icon 
                      name={expandedForms?.has(form?.id) ? "ChevronUp" : "ChevronDown"} 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                  </button>
                </div>
              </div>

              {/* Form Fields (Expanded) */}
              {expandedForms?.has(form?.id) && (
                <div className="px-3 pb-3 border-t border-border bg-muted/30">
                  <div className="pt-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Available Fields:</p>
                    <div className="flex flex-wrap gap-1">
                      {form?.fields?.map(field => (
                        <span
                          key={field}
                          className="text-xs bg-background text-foreground px-2 py-1 rounded border border-border"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Date Range */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Date Range</h4>
        <div className="space-y-2">
          {dateRanges?.map(range => (
            <label key={range?.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="dateRange"
                value={range?.value}
                checked={selectedDateRange === range?.value}
                onChange={(e) => onDateRangeChange(e?.target?.value)}
                className="w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
              />
              <span className="text-sm text-foreground">{range?.label}</span>
            </label>
          ))}
        </div>

        {selectedDateRange === 'custom' && (
          <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">From</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">To</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Submission Status */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Submission Status</h4>
        <div className="space-y-2">
          {submissionStatuses?.map(status => (
            <label key={status.id} className="flex items-center justify-between cursor-pointer p-2 hover:bg-muted/50 rounded">
              <div className="flex items-center space-x-3">
                <Checkbox />
                <span className="text-sm text-foreground">{status.label}</span>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {status.count}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataSourceSelector;