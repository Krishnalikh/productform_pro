import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import StatusNotification from '../../components/ui/StatusNotification';
import SubmissionMetrics from './components/SubmissionMetrics';
import SubmissionFilters from './components/SubmissionFilters';
import SubmissionTable from './components/SubmissionTable';
import BulkActions from './components/BulkActions';
import TablePagination from './components/TablePagination';

const SubmissionsManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'submissionDate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [notifications, setNotifications] = useState([]);
  const [filters, setFilters] = useState({
    formType: '',
    status: '',
    dateRange: '',
    submitter: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for pagination
  const totalSubmissions = 1247;
  const totalPages = Math.ceil(totalSubmissions / itemsPerPage);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'Home' },
    { label: 'Submissions Management', icon: 'Database' }
  ];

  const userPermissions = ['admin', 'export', 'edit', 'delete', 'create', 'report'];

  useEffect(() => {
    // Simulate loading notification
    const loadingNotification = {
      id: 'loading-' + Date.now(),
      type: 'info',
      title: 'Loading Submissions',
      message: 'Fetching latest submission data...',
      autoHide: true
    };
    setNotifications([loadingNotification]);

    // Simulate data load completion
    const timer = setTimeout(() => {
      setNotifications([]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    
    // Show filter applied notification
    const filterNotification = {
      id: 'filter-' + Date.now(),
      type: 'success',
      title: 'Filters Applied',
      message: 'Submission list has been updated based on your filters.',
      autoHide: true
    };
    setNotifications(prev => [...prev, filterNotification]);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSort = (newSortConfig) => {
    setSortConfig(newSortConfig);
    
    // Show sort notification
    const sortNotification = {
      id: 'sort-' + Date.now(),
      type: 'info',
      title: 'Sorting Applied',
      message: `Submissions sorted by ${newSortConfig?.key} in ${newSortConfig?.direction}ending order.`,
      autoHide: true
    };
    setNotifications(prev => [...prev, sortNotification]);
  };

  const handleSelectionChange = (selectedIds) => {
    setSelectedSubmissions(selectedIds);
  };

  const handleBulkAction = (actionKey, selectedItems, additionalData = {}) => {
    let notification = {
      id: 'bulk-' + Date.now(),
      autoHide: true
    };

    switch (actionKey) {
      case 'export':
        notification = {
          ...notification,
          type: 'success',
          title: 'Export Started',
          message: `Exporting ${selectedItems?.length} submissions in ${additionalData?.format?.toUpperCase()} format...`,
          action: {
            label: 'Download',
            onClick: () => console.log('Download export file')
          }
        };
        break;
      case 'status-update':
        notification = {
          ...notification,
          type: 'success',
          title: 'Status Updated',
          message: `Successfully updated status of ${selectedItems?.length} submissions to ${additionalData?.status}.`
        };
        setSelectedSubmissions([]); // Clear selection after action
        break;
      case 'delete':
        notification = {
          ...notification,
          type: 'warning',
          title: 'Deletion Confirmed',
          message: `${selectedItems?.length} submissions have been deleted permanently.`
        };
        setSelectedSubmissions([]); // Clear selection after action
        break;
      case 'generate-report':
        notification = {
          ...notification,
          type: 'info',
          title: 'Report Generation',
          message: `Generating comprehensive report for ${selectedItems?.length} submissions...`
        };
        break;
      case 'duplicate':
        notification = {
          ...notification,
          type: 'success',
          title: 'Submissions Duplicated',
          message: `Created ${selectedItems?.length} duplicate submissions successfully.`
        };
        break;
      default:
        notification = {
          ...notification,
          type: 'info',
          title: 'Action Completed',
          message: `Bulk action "${actionKey}" completed for ${selectedItems?.length} items.`
        };
    }

    setNotifications(prev => [...prev, notification]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleNotificationDismiss = (id) => {
    setNotifications(prev => prev?.filter(n => n?.id !== id));
  };

  const handleDismissAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />
      
      <Sidebar
        isCollapsed={sidebarCollapsed}
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
      />

      <main className={`pt-16 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      }`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} />
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-foreground">Submissions Management</h1>
              <p className="text-muted-foreground mt-1">
                View, search, and manage all form submissions with comprehensive filtering and export capabilities.
              </p>
            </div>
          </div>

          {/* Metrics Overview */}
          <SubmissionMetrics />

          {/* Filters */}
          <SubmissionFilters 
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
          />

          {/* Bulk Actions */}
          <BulkActions
            selectedItems={selectedSubmissions}
            onBulkAction={handleBulkAction}
            userPermissions={userPermissions}
          />

          {/* Submissions Table */}
          <SubmissionTable
            selectedItems={selectedSubmissions}
            onSelectionChange={handleSelectionChange}
            onSort={handleSort}
            sortConfig={sortConfig}
          />

          {/* Pagination */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalSubmissions}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </main>

      {/* Status Notifications */}
      <StatusNotification
        notifications={notifications}
        onDismiss={handleNotificationDismiss}
        onDismissAll={handleDismissAllNotifications}
        position="top-right"
        maxVisible={3}
        autoHideDuration={4000}
      />
    </div>
  );
};

export default SubmissionsManagement;