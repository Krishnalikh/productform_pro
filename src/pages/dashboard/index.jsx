import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MetricsCard from './components/MetricsCard';
import RecentActivityTable from './components/RecentActivityTable';
import QuickStartPanel from './components/QuickStartPanel';
import AnalyticsChart from './components/AnalyticsChart';

import Button from '../../components/ui/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data for metrics
  const metricsData = [
    {
      title: "Total Forms",
      value: "24",
      change: "+12% from last month",
      changeType: "positive",
      icon: "FileText",
      color: "primary"
    },
    {
      title: "Active Submissions",
      value: "156",
      change: "+8% from last week",
      changeType: "positive",
      icon: "Send",
      color: "success"
    },
    {
      title: "Completion Rate",
      value: "87.5%",
      change: "+2.3% from last month",
      changeType: "positive",
      icon: "CheckCircle",
      color: "success"
    },
    {
      title: "Pending Reviews",
      value: "12",
      change: "-15% from last week",
      changeType: "negative",
      icon: "Clock",
      color: "warning"
    }
  ];

  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      formName: "Product Specification Form",
      category: "Electronics",
      status: "completed",
      submittedAt: "2025-01-05T10:30:00Z",
      submittedBy: "John Smith",
      progress: 100
    },
    {
      id: 2,
      formName: "Quality Assessment Form",
      category: "Manufacturing",
      status: "in_progress",
      submittedAt: "2025-01-05T09:15:00Z",
      submittedBy: "Sarah Johnson",
      progress: 65
    },
    {
      id: 3,
      formName: "Supplier Evaluation",
      category: "Procurement",
      status: "draft",
      submittedAt: "2025-01-04T16:45:00Z",
      submittedBy: "Mike Wilson",
      progress: 30
    },
    {
      id: 4,
      formName: "Market Research Survey",
      category: "Research",
      status: "completed",
      submittedAt: "2025-01-04T14:20:00Z",
      submittedBy: "Emily Davis",
      progress: 100
    },
    {
      id: 5,
      formName: "Customer Feedback Form",
      category: "Support",
      status: "pending",
      submittedAt: "2025-01-04T11:30:00Z",
      submittedBy: "Alex Brown",
      progress: 85
    }
  ];

  // Mock data for recent templates
  const recentTemplates = [
    {
      id: 1,
      name: "Product Launch Checklist",
      category: "Product Management",
      lastUsed: "2025-01-03T12:00:00Z"
    },
    {
      id: 2,
      name: "Quality Control Form",
      category: "Manufacturing",
      lastUsed: "2025-01-02T15:30:00Z"
    },
    {
      id: 3,
      name: "Vendor Assessment",
      category: "Procurement",
      lastUsed: "2025-01-01T09:45:00Z"
    }
  ];

  // Mock data for upcoming deadlines
  const upcomingDeadlines = [
    {
      id: 1,
      formName: "Q1 Product Review",
      description: "Quarterly product assessment due",
      dueDate: "2025-01-07T17:00:00Z",
      assignee: "Product Team"
    },
    {
      id: 2,
      formName: "Supplier Audit Report",
      description: "Annual supplier evaluation",
      dueDate: "2025-01-10T12:00:00Z",
      assignee: "Procurement Team"
    },
    {
      id: 3,
      formName: "Customer Satisfaction Survey",
      description: "Monthly customer feedback collection",
      dueDate: "2025-01-15T23:59:00Z",
      assignee: "Customer Success"
    },
    {
      id: 4,
      formName: "Compliance Check",
      description: "Regulatory compliance verification",
      dueDate: "2025-01-20T16:00:00Z",
      assignee: "Legal Team"
    }
  ];

  // Mock data for analytics chart
  const submissionTrendsData = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 19 },
    { name: 'Wed', value: 15 },
    { name: 'Thu', value: 22 },
    { name: 'Fri', value: 28 },
    { name: 'Sat', value: 8 },
    { name: 'Sun', value: 5 }
  ];

  const formPerformanceData = [
    { name: 'Product Forms', value: 45 },
    { name: 'Quality Forms', value: 32 },
    { name: 'Supplier Forms', value: 28 },
    { name: 'Research Forms', value: 15 },
    { name: 'Other', value: 10 }
  ];

  const handleToggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleEditActivity = (activityId) => {
    navigate(`/form-builder?edit=${activityId}`);
  };

  const handleViewActivity = (activityId) => {
    navigate(`/submissions-management?view=${activityId}`);
  };

  const handleSortActivities = (field, direction) => {
    console.log(`Sorting by ${field} in ${direction} order`);
    // Implementation would sort the activities array
  };

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back! Here's an overview of your form activities and analytics.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => navigate('/report-generation')}
                >
                  Export Data
                </Button>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => navigate('/form-builder')}
                >
                  Create Form
                </Button>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {metricsData?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                color={metric?.color}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
            {/* Recent Activity Table */}
            <div className="xl:col-span-8">
              <RecentActivityTable
                activities={recentActivities}
                onEdit={handleEditActivity}
                onView={handleViewActivity}
                onSort={handleSortActivities}
              />
            </div>

            {/* Quick Start Panel */}
            <div className="xl:col-span-4">
              <QuickStartPanel
                recentTemplates={recentTemplates}
                upcomingDeadlines={upcomingDeadlines}
              />
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AnalyticsChart
              data={submissionTrendsData}
              type="bar"
              title="Submission Trends"
              description="Daily form submissions over the past week"
            />
            <AnalyticsChart
              data={formPerformanceData}
              type="pie"
              title="Form Performance"
              description="Distribution of form types by submission count"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;