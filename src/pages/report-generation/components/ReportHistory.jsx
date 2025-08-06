import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportHistory = ({ isVisible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  const reportHistory = [
    {
      id: 'rpt-001',
      name: 'Q4 Product Analysis Report',
      template: 'Detailed Analysis',
      generatedDate: '2025-01-06',
      generatedBy: 'Sarah Johnson',
      fileSize: '2.4 MB',
      downloadCount: 12,
      status: 'completed',
      dataSources: ['Product Information Form', 'Quality Assessment Form'],
      dateRange: 'Oct 1 - Dec 31, 2024'
    },
    {
      id: 'rpt-002',
      name: 'Executive Summary - December',
      template: 'Executive Summary',
      generatedDate: '2025-01-05',
      generatedBy: 'Michael Chen',
      fileSize: '1.8 MB',
      downloadCount: 8,
      status: 'completed',
      dataSources: ['Product Information Form'],
      dateRange: 'Dec 1 - Dec 31, 2024'
    },
    {
      id: 'rpt-003',
      name: 'Compliance Audit Report',
      template: 'Compliance Report',
      generatedDate: '2025-01-04',
      generatedBy: 'Emily Rodriguez',
      fileSize: '3.1 MB',
      downloadCount: 15,
      status: 'completed',
      dataSources: ['Product Information Form', 'Quality Assessment Form', 'Market Research Form'],
      dateRange: 'Nov 1 - Dec 31, 2024'
    },
    {
      id: 'rpt-004',
      name: 'Customer Feedback Analysis',
      template: 'Standard Product Report',
      generatedDate: '2025-01-03',
      generatedBy: 'David Kim',
      fileSize: '2.7 MB',
      downloadCount: 6,
      status: 'completed',
      dataSources: ['Customer Feedback Form'],
      dateRange: 'Dec 1 - Dec 31, 2024'
    },
    {
      id: 'rpt-005',
      name: 'Monthly Product Report - November',
      template: 'Standard Product Report',
      generatedDate: '2025-01-02',
      generatedBy: 'Lisa Wang',
      fileSize: '2.2 MB',
      downloadCount: 23,
      status: 'completed',
      dataSources: ['Product Information Form', 'Customer Feedback Form'],
      dateRange: 'Nov 1 - Nov 30, 2024'
    }
  ];

  const filteredReports = reportHistory?.filter(report =>
    report?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    report?.template?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    report?.generatedBy?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const sortedReports = [...filteredReports]?.sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.generatedDate) - new Date(a.generatedDate);
      case 'date-asc':
        return new Date(a.generatedDate) - new Date(b.generatedDate);
      case 'name-asc':
        return a?.name?.localeCompare(b?.name);
      case 'name-desc':
        return b?.name?.localeCompare(a?.name);
      case 'downloads-desc':
        return b?.downloadCount - a?.downloadCount;
      default:
        return 0;
    }
  });

  const handleDownload = (reportId) => {
    console.log('Downloading report:', reportId);
    // Simulate download
  };

  const handleRegenerate = (reportId) => {
    console.log('Regenerating report:', reportId);
    // Simulate regeneration
  };

  const handleDelete = (reportId) => {
    console.log('Deleting report:', reportId);
    // Simulate deletion
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Report History</h2>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage previously generated reports
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Icon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
              />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="pl-10 pr-4 py-2 w-64 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="downloads-desc">Most Downloaded</option>
            </select>
          </div>

          <div className="text-sm text-muted-foreground">
            {sortedReports?.length} reports found
          </div>
        </div>

        {/* Report List */}
        <div className="flex-1 overflow-auto">
          {sortedReports?.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No reports found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {sortedReports?.map(report => (
                <div
                  key={report?.id}
                  className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-foreground">{report?.name}</h4>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {report?.template}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <Icon name="Calendar" size={14} className="mr-2" />
                          {report?.generatedDate}
                        </div>
                        <div className="flex items-center">
                          <Icon name="User" size={14} className="mr-2" />
                          {report?.generatedBy}
                        </div>
                        <div className="flex items-center">
                          <Icon name="HardDrive" size={14} className="mr-2" />
                          {report?.fileSize}
                        </div>
                        <div className="flex items-center">
                          <Icon name="Download" size={14} className="mr-2" />
                          {report?.downloadCount} downloads
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-1">Data Sources:</p>
                        <div className="flex flex-wrap gap-1">
                          {report?.dataSources?.map(source => (
                            <span
                              key={source}
                              className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                            >
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Date Range: {report?.dateRange}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(report?.id)}
                        iconName="Download"
                        iconPosition="left"
                        iconSize={14}
                      >
                        Download
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRegenerate(report?.id)}
                        iconName="RefreshCw"
                        iconSize={14}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(report?.id)}
                        iconName="Trash2"
                        iconSize={14}
                        className="text-error hover:text-error"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Total storage used: 12.2 MB of 100 MB
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHistory;