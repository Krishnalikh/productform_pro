import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SubmissionFilters = ({ onFiltersChange = () => {}, onSearch = () => {} }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    formType: '',
    status: '',
    dateRange: '',
    submitter: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const formTypeOptions = [
    { value: '', label: 'All Forms' },
    { value: 'product-registration', label: 'Product Registration' },
    { value: 'customer-feedback', label: 'Customer Feedback' },
    { value: 'quality-assessment', label: 'Quality Assessment' },
    { value: 'compliance-check', label: 'Compliance Check' },
    { value: 'market-research', label: 'Market Research' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'draft', label: 'Draft' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'approved', label: 'Approved' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-90-days', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const submitterOptions = [
    { value: '', label: 'All Submitters' },
    { value: 'john-doe', label: 'John Doe' },
    { value: 'sarah-wilson', label: 'Sarah Wilson' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'emily-brown', label: 'Emily Brown' },
    { value: 'david-lee', label: 'David Lee' }
  ];

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilters({
      formType: '',
      status: '',
      dateRange: '',
      submitter: ''
    });
    onFiltersChange({
      formType: '',
      status: '',
      dateRange: '',
      submitter: ''
    });
    onSearch('');
  };

  const hasActiveFilters = searchQuery || Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon 
              name="Search" 
              size={18} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              type="search"
              placeholder="Search submissions, forms, or submitters..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Select
            options={formTypeOptions}
            value={filters?.formType}
            onChange={(value) => handleFilterChange('formType', value)}
            placeholder="Form Type"
            className="w-40"
          />

          <Select
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="Status"
            className="w-36"
          />

          <Select
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
            placeholder="Date Range"
            className="w-40"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            iconName={showAdvancedFilters ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            iconSize={16}
          >
            Advanced
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
              iconSize={16}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Submitter"
              options={submitterOptions}
              value={filters?.submitter}
              onChange={(value) => handleFilterChange('submitter', value)}
              placeholder="Select submitter"
            />

            <Input
              label="Custom Date From"
              type="date"
              placeholder="Start date"
            />

            <Input
              label="Custom Date To"
              type="date"
              placeholder="End date"
            />

            <div className="flex items-end">
              <Button
                variant="outline"
                size="default"
                iconName="Filter"
                iconPosition="left"
                iconSize={16}
                className="w-full"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionFilters;