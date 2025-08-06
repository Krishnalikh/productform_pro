import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ReportTemplateSelector from './components/ReportTemplateSelector';
import DataSourceSelector from './components/DataSourceSelector';
import ReportPreview from './components/ReportPreview';
import ReportHistory from './components/ReportHistory';
import GenerationProgress from './components/GenerationProgress';

const ReportGeneration = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedSources, setSelectedSources] = useState(['form-1']);
  const [selectedDateRange, setSelectedDateRange] = useState('last-30-days');
  const [showHistory, setShowHistory] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [leftPanelTab, setLeftPanelTab] = useState('templates'); // templates, sources
  const [isGenerating, setIsGenerating] = useState(false);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'Home' },
    { label: 'Report Generation', href: '/report-generation' }
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleSourcesChange = (sources) => {
    setSelectedSources(sources);
  };

  const handleDateRangeChange = (range) => {
    setSelectedDateRange(range);
  };

  const handleGenerateReport = () => {
    if (!selectedTemplate || selectedSources?.length === 0) {
      return;
    }
    setIsGenerating(true);
    setShowProgress(true);
  };

  const handleGenerationComplete = (reportData) => {
    setIsGenerating(false);
    console.log('Report generated:', reportData);
  };

  const handleProgressClose = () => {
    setShowProgress(false);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className={`
        transition-all duration-300 pt-16
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}
      `}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} />
            <div className="flex items-center justify-between mt-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Report Generation</h1>
                <p className="text-muted-foreground mt-1">
                  Create customized PDF reports from form submissions with advanced filtering and templates
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowHistory(true)}
                  iconName="History"
                  iconPosition="left"
                  iconSize={16}
                >
                  View History
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:flex"
                >
                  <Icon name={sidebarCollapsed ? "PanelLeftOpen" : "PanelLeftClose"} size={20} />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
            {/* Left Panel - Templates & Data Sources */}
            <div className="lg:col-span-4 bg-card rounded-lg border border-border overflow-hidden">
              {/* Mobile Tabs */}
              <div className="lg:hidden border-b border-border">
                <div className="flex">
                  <button
                    onClick={() => setLeftPanelTab('templates')}
                    className={`
                      flex-1 px-4 py-3 text-sm font-medium transition-colors
                      ${leftPanelTab === 'templates' ?'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    <Icon name="FileText" size={16} className="mr-2" />
                    Templates
                  </button>
                  <button
                    onClick={() => setLeftPanelTab('sources')}
                    className={`
                      flex-1 px-4 py-3 text-sm font-medium transition-colors
                      ${leftPanelTab === 'sources' ?'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    <Icon name="Database" size={16} className="mr-2" />
                    Data Sources
                  </button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:block h-full">
                <div className="h-1/2 border-b border-border">
                  <ReportTemplateSelector
                    selectedTemplate={selectedTemplate}
                    onTemplateSelect={handleTemplateSelect}
                  />
                </div>
                <div className="h-1/2 p-4 overflow-y-auto">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Data Sources & Filters</h3>
                  <DataSourceSelector
                    selectedSources={selectedSources}
                    onSourcesChange={handleSourcesChange}
                    selectedDateRange={selectedDateRange}
                    onDateRangeChange={handleDateRangeChange}
                  />
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden h-full">
                {leftPanelTab === 'templates' ? (
                  <ReportTemplateSelector
                    selectedTemplate={selectedTemplate}
                    onTemplateSelect={handleTemplateSelect}
                  />
                ) : (
                  <div className="p-4 h-full overflow-y-auto">
                    <DataSourceSelector
                      selectedSources={selectedSources}
                      onSourcesChange={handleSourcesChange}
                      selectedDateRange={selectedDateRange}
                      onDateRangeChange={handleDateRangeChange}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Report Preview */}
            <div className="lg:col-span-8 bg-card rounded-lg border border-border overflow-hidden">
              <ReportPreview
                template={selectedTemplate}
                dataSources={selectedSources}
                isGenerating={isGenerating}
                onGenerate={handleGenerateReport}
              />
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="mt-6 bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {selectedSources?.length}
                  </span> data source{selectedSources?.length !== 1 ? 's' : ''} selected
                </div>
                {selectedTemplate && (
                  <div className="text-sm text-muted-foreground">
                    Template: <span className="font-medium text-foreground">{selectedTemplate?.name}</span>
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  Range: <span className="font-medium text-foreground">{selectedDateRange?.replace('-', ' ')}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!selectedTemplate || selectedSources?.length === 0}
                  iconName="Eye"
                  iconPosition="left"
                  iconSize={14}
                >
                  Preview Data
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleGenerateReport}
                  disabled={!selectedTemplate || selectedSources?.length === 0 || isGenerating}
                  loading={isGenerating}
                  iconName="Download"
                  iconPosition="left"
                  iconSize={14}
                >
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Modals */}
      <ReportHistory
        isVisible={showHistory}
        onClose={() => setShowHistory(false)}
      />
      <GenerationProgress
        isVisible={showProgress}
        onClose={handleProgressClose}
        onComplete={handleGenerationComplete}
      />
    </div>
  );
};

export default ReportGeneration;